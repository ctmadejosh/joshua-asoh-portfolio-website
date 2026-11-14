# ---------------------------------------------------------------------------
# aws.juasoh.com: TLS certificate and custom domain (two-step).
# ---------------------------------------------------------------------------
# juasoh.com's DNS lives in Cloudflare, not Route 53, so Terraform can't add
# DNS records itself. The flow is:
#
#   Apply #1 (custom_domain_ready = false)
#     -> ACM creates a certificate request for aws.juasoh.com
#     -> outputs show the validation CNAME (and SES's DKIM CNAMEs)
#   You add those records in Cloudflare (DNS only, grey cloud)
#   Apply #2 (custom_domain_ready = true)
#     -> waits for ACM to issue the certificate
#     -> attaches aws.juasoh.com to the API
#     -> outputs the final CNAME: aws.juasoh.com -> API Gateway's hostname

resource "aws_acm_certificate" "api" {
  domain_name       = var.api_domain
  validation_method = "DNS"

  # When a certificate has to be replaced, make the new one before deleting
  # the old, so the domain never goes without TLS.
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "api" {
  count           = var.custom_domain_ready ? 1 : 0
  certificate_arn = aws_acm_certificate.api.arn

  timeouts {
    create = "30m"
  }
}

resource "aws_apigatewayv2_domain_name" "api" {
  count       = var.custom_domain_ready ? 1 : 0
  domain_name = var.api_domain

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api[0].certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2" # refuse old, insecure TLS versions
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  count       = var.custom_domain_ready ? 1 : 0
  api_id      = aws_apigatewayv2_api.contact.id
  domain_name = aws_apigatewayv2_domain_name.api[0].id
  stage       = aws_apigatewayv2_stage.default.id
}
