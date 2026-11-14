# ---------------------------------------------------------------------------
# Lambda: runs services/contact/handler.py on every request.
# ---------------------------------------------------------------------------

# Zip the handler. Terraform re-uploads only when the file's hash changes.
data "archive_file" "handler" {
  type        = "zip"
  source_file = "${path.module}/../../services/contact/handler.py"
  output_path = "${path.module}/.build/handler.zip"
}

resource "aws_cloudwatch_log_group" "lambda" {
  #checkov:skip=CKV_AWS_158:Logs hold no secrets; CloudWatch encrypts at rest by default. A customer-managed KMS key adds ~$1/month for no real gain here.
  #checkov:skip=CKV_AWS_338:30 days is enough to debug a contact form; a year of retention costs more for logs nobody will read.
  name              = "/aws/lambda/${local.name}"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "contact" {
  #checkov:skip=CKV_AWS_116:API Gateway calls this synchronously; a dead-letter queue only applies to async invocations. Failed messages are already saved in DynamoDB first.
  #checkov:skip=CKV_AWS_117:The function talks only to AWS public endpoints (DynamoDB, SES). A VPC would need a NAT gateway (~$32/month) and add nothing.
  #checkov:skip=CKV_AWS_115:New AWS accounts have a 10-execution concurrency quota and Lambda refuses reservations that leave under 10 unreserved. API Gateway throttling (2 req/s) caps concurrency instead.
  #checkov:skip=CKV_AWS_272:Code signing guards against tampered deploy artifacts in multi-team pipelines; here Terraform zips the reviewed source directly.
  #checkov:skip=CKV_AWS_173:The environment variables are a table name and two email addresses, not secrets; Lambda encrypts them at rest with an AWS-managed key anyway.
  function_name = local.name
  description   = "juasoh.com contact form: validate, save to DynamoDB, email via SES"
  role          = aws_iam_role.lambda.arn

  filename         = data.archive_file.handler.output_path
  source_code_hash = data.archive_file.handler.output_base64sha256
  handler          = "handler.handler"
  runtime          = "python3.13"

  # Graviton (ARM) is about 20% cheaper than x86 for the same work.
  architectures = ["arm64"]
  memory_size   = 128 # the smallest size; this function needs very little
  timeout       = 10  # seconds; a normal request takes well under one

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.messages.name
      FROM_EMAIL = "Joshua Asoh website <${var.sender_address}>"
      TO_EMAIL   = var.recipient_email
    }
  }

  # X-Ray traces each request (API Gateway -> Lambda -> DynamoDB/SES) with
  # timings, so a slow or failing call shows exactly which step it was.
  tracing_config {
    mode = "Active"
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.lambda.name
  }

  depends_on = [aws_cloudwatch_log_group.lambda, aws_iam_role_policy.lambda]
}

# ---------------------------------------------------------------------------
# IAM: the Lambda can do exactly three things, and nothing else.
# ---------------------------------------------------------------------------

data "aws_iam_policy_document" "lambda_trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${local.name}-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
}

data "aws_iam_policy_document" "lambda" {
  statement {
    sid       = "SaveMessages"
    actions   = ["dynamodb:PutItem"] # write only: it can't read or delete messages
    resources = [aws_dynamodb_table.messages.arn]
  }
  statement {
    sid     = "SendFromVerifiedIdentitiesOnly"
    actions = ["ses:SendEmail"]
    resources = [
      aws_sesv2_email_identity.domain.arn,
      aws_sesv2_email_identity.recipient.arn,
    ]
  }
  statement {
    sid       = "SendXRayTraces"
    actions   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords"]
    resources = ["*"] # X-Ray doesn't support resource-level permissions
  }
  statement {
    sid       = "WriteOwnLogs"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.lambda.arn}:*"]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name   = "contact"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda.json
}
