# ---------------------------------------------------------------------------
# API Gateway (HTTP API): the public front door.
# ---------------------------------------------------------------------------
# HTTP APIs are the newer, simpler, ~70% cheaper flavour of API Gateway. It
# handles TLS, CORS, throttling and routing, then hands each request to Lambda.

resource "aws_apigatewayv2_api" "contact" {
  name          = local.name
  protocol_type = "HTTP"
  description   = "juasoh.com contact form API"

  # CORS: browsers only let pages on these origins read the API's answers.
  # API Gateway answers the browser's OPTIONS "preflight" itself, so those
  # never reach (or bill) the Lambda.
  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 3600
  }

  # Once aws.juasoh.com is attached, switch off the default
  # https://<id>.execute-api.us-east-1.amazonaws.com URL, so the API has one
  # public address only.
  disable_execute_api_endpoint = var.custom_domain_ready
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.contact.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.invoke_arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 10000
}

resource "aws_apigatewayv2_route" "contact" {
  #checkov:skip=CKV_AWS_309:A public contact form can't require visitors to log in. It's protected by throttling, CORS, input validation, a honeypot, and alarms instead.
  api_id    = aws_apigatewayv2_api.contact.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_route" "health" {
  #checkov:skip=CKV_AWS_309:Health checks must be callable without credentials; the route returns only {"ok": true}.
  api_id    = aws_apigatewayv2_api.contact.id
  route_key = "GET /health"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_cloudwatch_log_group" "api_access" {
  #checkov:skip=CKV_AWS_158:Access logs hold no secrets; CloudWatch encrypts at rest by default. A customer-managed KMS key adds ~$1/month for no real gain here.
  #checkov:skip=CKV_AWS_338:30 days is enough to investigate abuse of a contact form.
  name              = "/aws/apigateway/${local.name}"
  retention_in_days = var.log_retention_days
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.contact.id
  name        = "$default"
  auto_deploy = true

  # Throttling: at most 2 requests per second on average, bursts up to 5.
  # A person sends one message; a bot hammering the form gets HTTP 429s and
  # can't run up the bill.
  default_route_settings {
    throttling_rate_limit  = 2
    throttling_burst_limit = 5
  }

  # One JSON line per request: who called, which route, status, and timing.
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_access.arn
    format = jsonencode({
      requestId        = "$context.requestId"
      ip               = "$context.identity.sourceIp"
      requestTime      = "$context.requestTime"
      routeKey         = "$context.routeKey"
      status           = "$context.status"
      latencyMs        = "$context.responseLatency"
      integrationError = "$context.integrationErrorMessage"
      userAgent        = "$context.identity.userAgent"
    })
  }
}

# Let API Gateway (and only this API) invoke the function.
resource "aws_lambda_permission" "api" {
  statement_id  = "AllowInvokeFromApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.contact.execution_arn}/*/*"
}
