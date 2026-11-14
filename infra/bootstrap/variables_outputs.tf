variable "region" {
  description = "AWS region for the state bucket. Keep it the same as the contact stack."
  type        = string
  default     = "us-east-1"
}

variable "github_owner" {
  description = "GitHub user or organization that owns the repository."
  type        = string
  default     = "ctmadejosh"
}

variable "github_repo" {
  description = "Repository whose workflows may deploy."
  type        = string
  default     = "joshua-asoh-portfolio-website"
}

# Copy these three values into the repo's Settings -> Secrets and variables ->
# Actions -> Variables (they're identifiers, not secrets).

output "TF_STATE_BUCKET" {
  description = "Repo variable TF_STATE_BUCKET"
  value       = aws_s3_bucket.state.bucket
}

output "AWS_PLAN_ROLE_ARN" {
  description = "Repo variable AWS_PLAN_ROLE_ARN (pull request plans)"
  value       = aws_iam_role.plan.arn
}

output "AWS_DEPLOY_ROLE_ARN" {
  description = "Repo variable AWS_DEPLOY_ROLE_ARN (production applies)"
  value       = aws_iam_role.deploy.arn
}
