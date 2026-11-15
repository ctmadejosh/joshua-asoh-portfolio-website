# ---------------------------------------------------------------------------
# Public status page: juasoh.com/status
# ---------------------------------------------------------------------------
#
#   EventBridge (every 5 min) ──> status-check Lambda ──GET──> juasoh.com
#                                        │                └──> aws.juasoh.com/health
#                                        └── PutMetricData: Up, LatencyMs (juasoh/Status)
#                                                  │
#   CloudWatch alarms: down 2 checks in a row ─────┴──> SNS ──> alert email
#
#   Browser ──GET /status (public)──> status Lambda ──> reads those metrics
#                                                       + this month's cost total
#
# Cost: $0. Four custom metrics and two alarms fit CloudWatch's free 10 + 10,
# ~8,600 checks a month fit Lambda's free tier, and scheduled EventBridge
# rules are free.

locals {
  status_targets = toset(["website", "api"])
}

# --- The checker ---------------------------------------------------------

data "archive_file" "status_check" {
  type        = "zip"
  source_file = "${path.module}/../../services/contact/status_check.py"
  output_path = "${path.module}/.build/status_check.zip"
}

resource "aws_cloudwatch_log_group" "status_check" {
  #checkov:skip=CKV_AWS_158:Logs hold no secrets; CloudWatch encrypts at rest by default. A customer-managed KMS key adds ~$1/month for no real gain here.
  #checkov:skip=CKV_AWS_338:30 days of check results is plenty; the metrics keep the long-term history.
  name              = "/aws/lambda/${local.name}-status-check"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "status_check" {
  #checkov:skip=CKV_AWS_116:A failed scheduled run simply records nothing; the next one runs 5 minutes later, so a dead-letter queue adds nothing.
  #checkov:skip=CKV_AWS_117:The function calls public URLs and CloudWatch's public endpoint. A VPC would need a NAT gateway (~$32/month) and add nothing.
  #checkov:skip=CKV_AWS_115:New AWS accounts have a 10-execution concurrency quota and Lambda refuses reservations that leave under 10 unreserved. One run every 5 minutes needs no reservation.
  #checkov:skip=CKV_AWS_272:Code signing guards against tampered deploy artifacts in multi-team pipelines; here Terraform zips the reviewed source directly.
  #checkov:skip=CKV_AWS_173:There are no environment variables to encrypt.
  function_name = "${local.name}-status-check"
  description   = "Checks juasoh.com and aws.juasoh.com every 5 minutes for the status page"
  role          = aws_iam_role.status_check.arn

  filename         = data.archive_file.status_check.output_path
  source_code_hash = data.archive_file.status_check.output_base64sha256
  handler          = "status_check.handler"
  runtime          = "python3.13"
  architectures    = ["arm64"]
  memory_size      = 128
  timeout          = 30 # two requests with an 8-second timeout each, plus margin

  tracing_config {
    mode = "Active"
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.status_check.name
  }

  depends_on = [aws_cloudwatch_log_group.status_check, aws_iam_role_policy.status_check]
}

resource "aws_iam_role" "status_check" {
  name               = "${local.name}-status-check-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
}

data "aws_iam_policy_document" "status_check" {
  #checkov:skip=CKV_AWS_356:PutMetricData doesn't support resource-level permissions; the condition below limits it to the juasoh/Status namespace.
  statement {
    sid       = "WriteStatusMetricsOnly"
    actions   = ["cloudwatch:PutMetricData"]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "cloudwatch:namespace"
      values   = ["juasoh/Status"]
    }
  }
  statement {
    sid       = "SendXRayTraces"
    actions   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords"]
    resources = ["*"] # X-Ray doesn't support resource-level permissions
  }
  statement {
    sid       = "WriteOwnLogs"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.status_check.arn}:*"]
  }
}

resource "aws_iam_role_policy" "status_check" {
  name   = "status-check"
  role   = aws_iam_role.status_check.id
  policy = data.aws_iam_policy_document.status_check.json
}

# Run it every 5 minutes.
resource "aws_cloudwatch_event_rule" "status_check" {
  name                = "${local.name}-status-check"
  description         = "Uptime check for the juasoh.com status page"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "status_check" {
  rule = aws_cloudwatch_event_rule.status_check.name
  arn  = aws_lambda_function.status_check.arn
}

resource "aws_lambda_permission" "status_check_schedule" {
  statement_id  = "AllowRunFromSchedule"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.status_check.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.status_check.arn
}

# Email an alert when a target fails two checks in a row (10 minutes), and
# again when it recovers. With no data (e.g. right after creation) the alarm
# waits rather than alerting.
resource "aws_cloudwatch_metric_alarm" "target_down" {
  for_each            = local.status_targets
  alarm_name          = "${local.name}-${each.key}-down"
  alarm_description   = each.key == "api" ? "aws.juasoh.com/health failed two uptime checks in a row." : "juasoh.com failed two uptime checks in a row."
  namespace           = "juasoh/Status"
  metric_name         = "Up"
  dimensions          = { Target = each.key }
  statistic           = "Minimum"
  period              = 300
  evaluation_periods  = 2
  comparison_operator = "LessThanThreshold"
  threshold           = 1
  treat_missing_data  = "missing"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

# --- The public status API ------------------------------------------------

data "archive_file" "status" {
  type        = "zip"
  source_file = "${path.module}/../../services/contact/status.py"
  output_path = "${path.module}/.build/status.zip"
}

resource "aws_cloudwatch_log_group" "status" {
  #checkov:skip=CKV_AWS_158:Logs hold no secrets; CloudWatch encrypts at rest by default. A customer-managed KMS key adds ~$1/month for no real gain here.
  #checkov:skip=CKV_AWS_338:30 days is enough to debug a read-only status endpoint.
  name              = "/aws/lambda/${local.name}-status"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "status" {
  #checkov:skip=CKV_AWS_116:API Gateway calls this synchronously; a dead-letter queue only applies to async invocations.
  #checkov:skip=CKV_AWS_117:The function talks only to CloudWatch's public endpoint. A VPC would need a NAT gateway (~$32/month) and add nothing.
  #checkov:skip=CKV_AWS_115:New AWS accounts have a 10-execution concurrency quota and Lambda refuses reservations that leave under 10 unreserved. API Gateway throttling caps concurrency instead.
  #checkov:skip=CKV_AWS_272:Code signing guards against tampered deploy artifacts in multi-team pipelines; here Terraform zips the reviewed source directly.
  #checkov:skip=CKV_AWS_173:There are no environment variables to encrypt.
  function_name = "${local.name}-status"
  description   = "Public, read-only status data for juasoh.com/status"
  role          = aws_iam_role.status.arn

  filename         = data.archive_file.status.output_path
  source_code_hash = data.archive_file.status.output_base64sha256
  handler          = "status.handler"
  runtime          = "python3.13"
  architectures    = ["arm64"]
  memory_size      = 128
  timeout          = 10

  tracing_config {
    mode = "Active"
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.status.name
  }

  depends_on = [aws_cloudwatch_log_group.status, aws_iam_role_policy.status]
}

resource "aws_iam_role" "status" {
  name               = "${local.name}-status-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
}

data "aws_iam_policy_document" "status" {
  #checkov:skip=CKV_AWS_356:GetMetricStatistics doesn't support resource-level permissions; it's read-only.
  statement {
    sid       = "ReadMetrics"
    actions   = ["cloudwatch:GetMetricStatistics"]
    resources = ["*"]
  }
  statement {
    sid       = "SendXRayTraces"
    actions   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords"]
    resources = ["*"] # X-Ray doesn't support resource-level permissions
  }
  statement {
    sid       = "WriteOwnLogs"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.status.arn}:*"]
  }
}

resource "aws_iam_role_policy" "status" {
  name   = "status"
  role   = aws_iam_role.status.id
  policy = data.aws_iam_policy_document.status.json
}

resource "aws_apigatewayv2_integration" "status" {
  api_id                 = aws_apigatewayv2_api.contact.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.status.invoke_arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

resource "aws_apigatewayv2_route" "status" {
  #checkov:skip=CKV_AWS_309:A public status page can't require visitors to log in. It returns only uptime, response times and one cost total; it's read-only, cached and throttled.
  api_id    = aws_apigatewayv2_api.contact.id
  route_key = "GET /status"
  target    = "integrations/${aws_apigatewayv2_integration.status.id}"
}

resource "aws_lambda_permission" "status_api" {
  statement_id  = "AllowInvokeFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.status.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.contact.execution_arn}/*/GET/status"
}
