output "api_base_url" {
  description = "Where the API answers right now. Before the custom domain is ready, this is the default execute-api URL."
  value       = var.custom_domain_ready ? "https://${var.api_domain}" : aws_apigatewayv2_api.contact.api_endpoint
}

output "contact_url" {
  description = "The URL the website posts the form to."
  value       = "${var.custom_domain_ready ? "https://${var.api_domain}" : aws_apigatewayv2_api.contact.api_endpoint}/contact"
}

output "dns_records_to_add_in_cloudflare" {
  description = "Add each of these in Cloudflare -> juasoh.com -> DNS. Set Proxy status to 'DNS only' (grey cloud)."
  value = concat(
    [for o in aws_acm_certificate.api.domain_validation_options : {
      purpose = "Proves you own ${o.domain_name} so AWS can issue its TLS certificate"
      type    = o.resource_record_type
      name    = o.resource_record_name
      value   = o.resource_record_value
    }],
    [for t in aws_sesv2_email_identity.domain.dkim_signing_attributes[0].tokens : {
      purpose = "DKIM: proves you own ${var.sender_domain} and signs email so it isn't marked as spam"
      type    = "CNAME"
      name    = "${t}._domainkey.${var.sender_domain}"
      value   = "${t}.dkim.amazonses.com"
    }],
    var.custom_domain_ready ? [{
      purpose = "Points ${var.api_domain} at the API"
      type    = "CNAME"
      name    = var.api_domain
      value   = aws_apigatewayv2_domain_name.api[0].domain_name_configuration[0].target_domain_name
    }] : []
  )
}

output "next_step" {
  description = "What to do next."
  value = var.custom_domain_ready ? (
    "Done. Check: curl https://${var.api_domain}/health"
    ) : (
    "Add the DNS records above in Cloudflare (DNS only), click the SES and SNS verification emails, then set custom_domain_ready = true and apply again."
  )
}

output "messages_table" {
  description = "DynamoDB table holding every message (AWS console -> DynamoDB -> Explore items)."
  value       = aws_dynamodb_table.messages.name
}
