# ---------------------------------------------------------------------------
# Private inbox: lets Joshua (and only Joshua) read and delete messages at
# juasoh.com/inbox.
# ---------------------------------------------------------------------------
#
#   Browser ──sign in──> Cognito (password + authenticator app code)
#      │                    │ issues a short-lived access token (JWT)
#      └── GET/DELETE /messages  Authorization: Bearer <token>
#                │
#          API Gateway JWT authorizer: rejects any request whose token
#          wasn't issued by this user pool for this app (never reaches Lambda)
#                │
#          admin Lambda: also checks the token belongs to Joshua's user,
#          then reads or deletes in DynamoDB
#
# The admin Lambda is separate from the public contact Lambda on purpose:
# the public function stays write-only, so a bug in the form handler can never
# leak messages. Only this function can read or delete, and only behind login.

# --- Cognito: the login system -------------------------------------------

resource "aws_cognito_user_pool" "admin" {
  name = "${local.name}-admin"

  # Nobody can sign up. The only account is created below by Terraform.
  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password AND a 6-digit code from an authenticator app on every sign-in.
  mfa_configuration = "ON"
  software_token_mfa_configuration {
    enabled = true
  }

  password_policy {
    minimum_length                   = 12
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Stops `terraform destroy` (or a console click) from deleting the login.
  deletion_protection = "ACTIVE"
}

# Cognito's hosted sign-in page lives at
# https://juasoh-inbox.auth.us-east-1.amazoncognito.com. It handles the
# password, the first-time authenticator setup (QR code) and resets, so the
# website never sees a password.
resource "aws_cognito_user_pool_domain" "admin" {
  domain       = var.inbox_auth_domain_prefix
  user_pool_id = aws_cognito_user_pool.admin.id
}

# The website's "app" in Cognito. It's a public client (no secret: anything
# shipped to a browser is public) and uses the authorization-code flow with
# PKCE, which is the recommended flow for single-page apps.
resource "aws_cognito_user_pool_client" "inbox" {
  name         = "${local.name}-inbox"
  user_pool_id = aws_cognito_user_pool.admin.id

  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls                        = var.inbox_urls
  logout_urls                          = var.inbox_urls
  explicit_auth_flows                  = ["ALLOW_REFRESH_TOKEN_AUTH"]

  # Tokens are short-lived: an hour of access, then sign in again.
  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 1
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  enable_token_revocation       = true
  prevent_user_existence_errors = "ENABLED"
}

# The one account. Cognito emails a temporary password to this address; the
# first sign-in asks for a new password and sets up the authenticator app.
resource "aws_cognito_user" "owner" {
  user_pool_id = aws_cognito_user_pool.admin.id
  username     = var.recipient_email
  attributes = {
    email          = var.recipient_email
    email_verified = "true"
  }
  desired_delivery_mediums = ["EMAIL"]

  # Cognito manages the password from here on; don't fight it.
  lifecycle {
    ignore_changes = [temporary_password, password]
  }
}

# --- API Gateway: the protected routes ------------------------------------

resource "aws_apigatewayv2_authorizer" "inbox" {
  api_id           = aws_apigatewayv2_api.contact.id
  name             = "cognito-inbox"
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  # API Gateway checks the token's signature, expiry, issuer (this user pool)
  # and audience (this app) before the request ever reaches Lambda.
  jwt_configuration {
    issuer   = "https://${aws_cognito_user_pool.admin.endpoint}"
    audience = [aws_cognito_user_pool_client.inbox.id]
  }
}

resource "aws_apigatewayv2_integration" "admin" {
  api_id                 = aws_apigatewayv2_api.contact.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.admin.invoke_arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

resource "aws_apigatewayv2_route" "list_messages" {
  api_id             = aws_apigatewayv2_api.contact.id
  route_key          = "GET /messages"
  target             = "integrations/${aws_apigatewayv2_integration.admin.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.inbox.id
}

resource "aws_apigatewayv2_route" "delete_message" {
  api_id             = aws_apigatewayv2_api.contact.id
  route_key          = "DELETE /messages/{id}"
  target             = "integrations/${aws_apigatewayv2_integration.admin.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.inbox.id
}

resource "aws_lambda_permission" "admin_api" {
  statement_id  = "AllowInvokeFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.contact.execution_arn}/*/*/messages*"
}

# --- Lambda: the admin function --------------------------------------------

data "archive_file" "admin" {
  type        = "zip"
  source_file = "${path.module}/../../services/contact/admin.py"
  output_path = "${path.module}/.build/admin.zip"
}

resource "aws_cloudwatch_log_group" "admin" {
  #checkov:skip=CKV_AWS_158:Logs hold no secrets; CloudWatch encrypts at rest by default. A customer-managed KMS key adds ~$1/month for no real gain here.
  #checkov:skip=CKV_AWS_338:30 days is enough to see who read or deleted what; longer retention costs more for logs nobody will read.
  name              = "/aws/lambda/${local.name}-admin"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "admin" {
  #checkov:skip=CKV_AWS_116:API Gateway calls this synchronously; a dead-letter queue only applies to async invocations.
  #checkov:skip=CKV_AWS_117:The function talks only to DynamoDB's public endpoint. A VPC would need a NAT gateway (~$32/month) and add nothing.
  #checkov:skip=CKV_AWS_115:New AWS accounts have a 10-execution concurrency quota and Lambda refuses reservations that leave under 10 unreserved. API Gateway throttling caps concurrency instead.
  #checkov:skip=CKV_AWS_272:Code signing guards against tampered deploy artifacts in multi-team pipelines; here Terraform zips the reviewed source directly.
  #checkov:skip=CKV_AWS_173:The environment variables are a table name and a user ID, not secrets; Lambda encrypts them at rest with an AWS-managed key anyway.
  function_name = "${local.name}-admin"
  description   = "juasoh.com private inbox: list and delete messages (behind Cognito login)"
  role          = aws_iam_role.admin.arn

  filename         = data.archive_file.admin.output_path
  source_code_hash = data.archive_file.admin.output_base64sha256
  handler          = "admin.handler"
  runtime          = "python3.13"
  architectures    = ["arm64"]
  memory_size      = 128
  timeout          = 10

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.messages.name
      # The Cognito user ID ("sub") allowed in. A valid token for any other
      # user in the pool still gets 403.
      OWNER_SUB = aws_cognito_user.owner.sub
    }
  }

  tracing_config {
    mode = "Active"
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.admin.name
  }

  depends_on = [aws_cloudwatch_log_group.admin, aws_iam_role_policy.admin]
}

resource "aws_iam_role" "admin" {
  name               = "${local.name}-admin-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
}

data "aws_iam_policy_document" "admin" {
  statement {
    sid       = "ReadAndDeleteMessages"
    actions   = ["dynamodb:Scan", "dynamodb:DeleteItem"]
    resources = [aws_dynamodb_table.messages.arn]
  }
  statement {
    sid       = "SendXRayTraces"
    actions   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords"]
    resources = ["*"] # X-Ray doesn't support resource-level permissions
  }
  statement {
    sid       = "WriteOwnLogs"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.admin.arn}:*"]
  }
}

resource "aws_iam_role_policy" "admin" {
  name   = "inbox"
  role   = aws_iam_role.admin.id
  policy = data.aws_iam_policy_document.admin.json
}
