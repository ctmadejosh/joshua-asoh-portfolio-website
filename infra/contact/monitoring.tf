# ---------------------------------------------------------------------------
# Alarms -> SNS -> your email. You hear about problems before a visitor does.
# ---------------------------------------------------------------------------

resource "aws_sns_topic" "alerts" {
  #checkov:skip=CKV_AWS_26:CloudWatch alarms can't publish to a topic encrypted with the AWS-managed SNS key; enabling it would silently stop every alert. Alert emails contain no sensitive data.
  name = "${local.name}-alerts"
}

# SNS emails a "Confirm subscription" link to this address; click it once.
resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

locals {
  alarm_defaults = {
    period              = 300 # 5-minute windows
    evaluation_periods  = 1
    comparison_operator = "GreaterThanOrEqualToThreshold"
    threshold           = 1
    statistic           = "Sum"
    # No traffic is normal for a contact form, so "no data" means OK, not alarm.
    treat_missing_data = "notBreaching"
  }
}

# 1. The function crashed (an unhandled error, timeout, or out of memory).
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${local.name}-lambda-errors"
  alarm_description   = "The contact Lambda failed at least once in 5 minutes. Check its CloudWatch logs."
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  dimensions          = { FunctionName = aws_lambda_function.contact.function_name }
  period              = local.alarm_defaults.period
  evaluation_periods  = local.alarm_defaults.evaluation_periods
  comparison_operator = local.alarm_defaults.comparison_operator
  threshold           = local.alarm_defaults.threshold
  statistic           = local.alarm_defaults.statistic
  treat_missing_data  = local.alarm_defaults.treat_missing_data
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

# 2. The API itself returned server errors (5xx) to visitors.
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "${local.name}-api-5xx"
  alarm_description   = "The contact API returned a 5xx error. Visitors saw a failure and fell back to email."
  namespace           = "AWS/ApiGateway"
  metric_name         = "5xx"
  dimensions          = { ApiId = aws_apigatewayv2_api.contact.id, Stage = "$default" }
  period              = local.alarm_defaults.period
  evaluation_periods  = local.alarm_defaults.evaluation_periods
  comparison_operator = local.alarm_defaults.comparison_operator
  threshold           = local.alarm_defaults.threshold
  statistic           = local.alarm_defaults.statistic
  treat_missing_data  = local.alarm_defaults.treat_missing_data
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

# 3. A message was saved but its email didn't send. The handler logs
#    EMAIL_SEND_FAILED; this filter turns those log lines into a metric.
resource "aws_cloudwatch_log_metric_filter" "email_failed" {
  name           = "${local.name}-email-send-failed"
  log_group_name = aws_cloudwatch_log_group.lambda.name
  pattern        = "EMAIL_SEND_FAILED"

  metric_transformation {
    name          = "EmailSendFailed"
    namespace     = "Juasoh/Contact"
    value         = "1"
    default_value = "0"
  }
}

resource "aws_cloudwatch_metric_alarm" "email_failed" {
  alarm_name          = "${local.name}-email-send-failed"
  alarm_description   = "A contact message was saved to DynamoDB but SES didn't email it. Read it in the table and check SES."
  namespace           = "Juasoh/Contact"
  metric_name         = "EmailSendFailed"
  period              = local.alarm_defaults.period
  evaluation_periods  = local.alarm_defaults.evaluation_periods
  comparison_operator = local.alarm_defaults.comparison_operator
  threshold           = local.alarm_defaults.threshold
  statistic           = local.alarm_defaults.statistic
  treat_missing_data  = local.alarm_defaults.treat_missing_data
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

# ---------------------------------------------------------------------------
# Budget: a hard-to-miss email if spending ever drifts upward.
# ---------------------------------------------------------------------------
# This watches the whole AWS account, not just this stack: on a personal
# account that's the safer net, and it works immediately (a tag-filtered
# budget only counts costs after the tag is activated in Billing).

resource "aws_budgets_budget" "monthly" {
  name         = "juasoh-account-monthly"
  budget_type  = "COST"
  limit_amount = tostring(var.monthly_budget_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }
}
