# The contact backend for juasoh.com: a serverless API at aws.juasoh.com.
#
#   Browser --POST--> API Gateway (aws.juasoh.com) --> Lambda --> DynamoDB (save)
#                                                         \----> SES (email Joshua)
#
# Read docs/aws/contact-backend.md for the full walkthrough.

terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }

  # State lives in the S3 bucket made by infra/bootstrap. The bucket name is
  # passed at init time so it isn't hard-coded here:
  #   terraform init -backend-config="bucket=<TF_STATE_BUCKET>"
  # use_lockfile makes Terraform write a lock object next to the state, so two
  # applies can never run at once (no DynamoDB lock table needed).
  backend "s3" {
    key          = "contact/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.region

  # Every resource gets these tags, so the AWS console and the bill can be
  # filtered down to exactly what this stack created.
  default_tags {
    tags = {
      Project   = "juasoh"
      Stack     = "contact"
      ManagedBy = "terraform"
      Repo      = "ctmadejosh/joshua-asoh-portfolio-website"
    }
  }
}

data "aws_caller_identity" "current" {}

locals {
  name = "juasoh-contact" # prefix for every resource name
}
