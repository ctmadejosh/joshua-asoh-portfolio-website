# ---------------------------------------------------------------------------
# DynamoDB: every message is stored here, even if the email fails.
# ---------------------------------------------------------------------------

resource "aws_dynamodb_table" "messages" {
  #checkov:skip=CKV_AWS_119:Encrypted at rest with an AWS-managed key. A customer-managed KMS key (~$1/month) mainly matters when other accounts or strict key rotation policies are involved.
  name = "${local.name}-messages"

  # On-demand: you pay per request (fractions of a cent) instead of for
  # reserved capacity. Right for a table that sees a few writes a week.
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  # Continuous backups: restore the table to any second in the last 35 days.
  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  # Stops `terraform destroy` (or a console click) from deleting your messages.
  # Turn this off first if you ever really want the table gone.
  deletion_protection_enabled = true
}

# ---------------------------------------------------------------------------
# SES: sends the notification email.
# ---------------------------------------------------------------------------
# New AWS accounts start in the SES "sandbox": you can only send TO verified
# addresses. That's fine here, because every email goes to you, and your
# address is verified below. No need to request production access.

# The sending domain. SES gives three DKIM tokens; adding them to DNS as
# CNAMEs proves you own juasoh.com and signs every email so it lands in the
# inbox instead of spam.
resource "aws_sesv2_email_identity" "domain" {
  email_identity = var.sender_domain
}

# Your inbox. SES emails a verification link to this address; click it once.
resource "aws_sesv2_email_identity" "recipient" {
  email_identity = var.recipient_email
}
