# One-time setup, run by hand (from AWS CloudShell or your laptop) BEFORE the
# pipeline can deploy anything. It creates the two things a pipeline needs
# but cannot create for itself:
#
#   1. An S3 bucket for Terraform state (the record of what Terraform built).
#   2. A trust link (OIDC) so GitHub Actions can sign in to AWS with short-lived
#      credentials instead of long-lived access keys stored as secrets.
#
# This folder keeps its own state in a local file (terraform.tfstate) because
# the state bucket doesn't exist yet when it runs. Keep that file safe, or
# simply re-import if it's lost; it's small and rarely changes.

terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = "juasoh", ManagedBy = "terraform", Stack = "bootstrap" }
  }
}

data "aws_caller_identity" "current" {}

locals {
  state_bucket = "juasoh-terraform-state-${data.aws_caller_identity.current.account_id}"
  repo         = "${var.github_owner}/${var.github_repo}"
}

# ---------------------------------------------------------------------------
# 1. Terraform state bucket
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "state" {
  #checkov:skip=CKV_AWS_18:Access logging needs a second bucket and mostly records Terraform's own reads; CloudTrail already records who changed the bucket.
  #checkov:skip=CKV2_AWS_62:Nothing needs to react to state file writes.
  #checkov:skip=CKV_AWS_144:Cross-region replication doubles the cost for a single small file that versioning already protects.
  #checkov:skip=CKV_AWS_145:Encrypted with S3-managed keys (AES-256); a customer-managed KMS key adds cost for no gain on a single-user account.
  bucket = local.state_bucket
  # The state is the only record of what Terraform manages; don't let a
  # `terraform destroy` here take it out by accident.
  lifecycle {
    prevent_destroy = true
  }
}

# Keep every previous version of the state, so a bad apply can be rolled back.
resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Old state versions are kept 90 days for rollback, then deleted, so the
# bucket doesn't grow forever. The current version is never expired.
resource "aws_s3_bucket_lifecycle_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    id     = "expire-old-state-versions"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration {
      noncurrent_days = 90
    }
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# State can contain sensitive values; it must never be public.
resource "aws_s3_bucket_public_access_block" "state" {
  bucket                  = aws_s3_bucket.state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Refuse any request that isn't over HTTPS.
resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "DenyInsecureTransport"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"]
      Condition = { Bool = { "aws:SecureTransport" = "false" } }
    }]
  })
}

# ---------------------------------------------------------------------------
# 2. GitHub Actions -> AWS with OIDC (no stored keys)
# ---------------------------------------------------------------------------
# GitHub issues each workflow run a signed token that says which repo, branch,
# and environment it is. AWS checks that token against the rules below and,
# if it matches, hands back credentials that expire within the hour.

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_policy_document" "state_access" {
  statement {
    sid       = "ListStateBucket"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.state.arn]
  }
  statement {
    sid = "ReadWriteStateAndLock"
    # Terraform writes a small .tflock file next to the state while it runs,
    # so even a read-only plan needs to put and delete that one object.
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.state.arn}/*"]
  }
}

# --- Plan role: used by pull requests. Can read everything, change nothing
# (apart from Terraform's own state lock). Safe to run on any PR.

data "aws_iam_policy_document" "trust_pull_requests" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.repo}:pull_request"]
    }
  }
}

resource "aws_iam_role" "plan" {
  name                 = "juasoh-github-plan"
  description          = "GitHub Actions: terraform plan on pull requests (read-only)"
  assume_role_policy   = data.aws_iam_policy_document.trust_pull_requests.json
  max_session_duration = 3600
}

resource "aws_iam_role_policy_attachment" "plan_readonly" {
  role       = aws_iam_role.plan.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

resource "aws_iam_role_policy" "plan_state" {
  name   = "terraform-state"
  role   = aws_iam_role.plan.id
  policy = data.aws_iam_policy_document.state_access.json
}

# --- Deploy role: used only by jobs running in the GitHub "production"
# environment, which requires a manual approval before the job starts.

data "aws_iam_policy_document" "trust_production" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.repo}:environment:production"]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name                 = "juasoh-github-deploy"
  description          = "GitHub Actions: terraform apply for the contact backend (production environment only)"
  assume_role_policy   = data.aws_iam_policy_document.trust_production.json
  max_session_duration = 3600
}

# What the deploy role may change: only the services the contact backend
# uses, and IAM only for roles and policies named juasoh-contact-*.
data "aws_iam_policy_document" "deploy" {
  #checkov:skip=CKV_AWS_109:Deploying needs permission to set policies on the stack's own resources (Lambda permissions, SNS topic policy). Scoped to the services this stack uses; only reachable from the approved production environment.
  #checkov:skip=CKV_AWS_110:IAM writes are limited to roles named juasoh-contact-*, and PassRole to those same roles, so the role can't grant itself more access.
  #checkov:skip=CKV_AWS_111:Terraform must be able to create resources whose ARNs don't exist yet. Tightening to per-resource ARNs is a follow-up once the stack is stable.
  #checkov:skip=CKV_AWS_356:Same reason: create actions need "*" because the resources don't exist until Terraform makes them.
  statement {
    sid = "ContactBackendServices"
    actions = [
      "apigateway:*",
      "lambda:*",
      "dynamodb:*",
      "acm:*",
      "ses:*",
      "logs:*",
      "cloudwatch:*",
      "sns:*",
      "budgets:*",
    ]
    resources = ["*"]
  }
  statement {
    sid = "OwnIamRolesOnly"
    actions = [
      "iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:UpdateRole",
      "iam:TagRole", "iam:UntagRole", "iam:ListRolePolicies", "iam:ListAttachedRolePolicies",
      "iam:PutRolePolicy", "iam:GetRolePolicy", "iam:DeleteRolePolicy",
      "iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:ListInstanceProfilesForRole",
      "iam:UpdateAssumeRolePolicy",
    ]
    resources = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/juasoh-contact-*"]
  }
  statement {
    sid       = "PassOwnRolesToLambdaAndApiGateway"
    actions   = ["iam:PassRole"]
    resources = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/juasoh-contact-*"]
  }
  statement {
    sid       = "ServiceLinkedRoleForApiGatewayLogs"
    actions   = ["iam:CreateServiceLinkedRole"]
    resources = ["*"]
    condition {
      test     = "StringLike"
      variable = "iam:AWSServiceName"
      values   = ["ops.apigateway.amazonaws.com"]
    }
  }
  statement {
    sid       = "ReadIdentity"
    actions   = ["sts:GetCallerIdentity"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "contact-backend"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}

resource "aws_iam_role_policy" "deploy_state" {
  name   = "terraform-state"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.state_access.json
}
