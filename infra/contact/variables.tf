variable "region" {
  description = "AWS region. us-east-1 keeps SES, ACM and API Gateway in one place."
  type        = string
  default     = "us-east-1"
}

variable "api_domain" {
  description = "Custom domain for the API. The website calls https://<api_domain>/contact."
  type        = string
  default     = "aws.juasoh.com"
}

variable "allowed_origins" {
  description = "Web pages allowed to call the API from a browser (CORS)."
  type        = list(string)
  default = [
    "https://juasoh.com",
    "https://www.juasoh.com",
    "http://localhost:8080", # vite dev server
  ]
}

variable "sender_domain" {
  description = "Domain the notification email is sent from. SES must verify it (DKIM records in DNS)."
  type        = string
  default     = "juasoh.com"
}

variable "sender_address" {
  description = "From address for notification emails. Must be on sender_domain."
  type        = string
  default     = "contact@juasoh.com"
}

variable "recipient_email" {
  description = "Where contact form messages are delivered (Joshua's inbox). SES sends a verification link to it."
  type        = string
}

variable "alert_email" {
  description = "Where alarms and budget alerts go. Usually the same as recipient_email."
  type        = string
}

variable "custom_domain_ready" {
  description = <<-EOT
    Two-step switch for aws.juasoh.com. Leave false on the first apply: it
    creates the TLS certificate and prints the DNS records to add in
    Cloudflare. After adding them, set true and apply again to attach the
    domain (and turn off the default execute-api URL).
  EOT
  type        = bool
  default     = false
}

variable "monthly_budget_usd" {
  description = "Email an alert if the AWS account's monthly bill passes 80% of this, or is forecast to pass it."
  type        = number
  default     = 5
}

variable "log_retention_days" {
  description = "How long Lambda and API logs are kept. Shorter is cheaper."
  type        = number
  default     = 30
}
