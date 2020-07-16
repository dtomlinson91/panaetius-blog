provider "aws" {
  region  = var.region
  profile = var.profile
  version = "~> 2.66"
}

locals {
  tags = {
    "Project"     = "panaetius-blog"
    "Description" = "terraform resources to host the blog"
  }
}

module "cloudfront_s3_cdn" {
  source              = "git::https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn.git?ref=tags/0.23.1"
  stage               = var.stage
  name                = var.name
  parent_zone_id      = var.parent_zone_id
  acm_certificate_arn = var.acm_certificate_arn
  # log_expiration_days          = var.log_expiration_days
  # log_standard_transition_days = var.log_standard_transition_days
  use_regional_s3_endpoint = true
  origin_force_destroy     = true
  cors_allowed_headers     = ["*"]
  cors_allowed_methods     = ["GET", "HEAD", "PUT", "POST"]
  cors_allowed_origins     = var.allowed_origins
  tags                     = local.tags
  aliases                  = var.aliases
  additional_bucket_policy = <<-EOT
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid":"PublicRead",
        "Effect":"Allow",
        "Principal": "*",
        "Action":["s3:GetObject"],
        "Resource": "arn:aws:s3:::${module.cloudfront_s3_cdn.s3_bucket}/*"
      }
    ]
  }
  EOT
}

resource "aws_s3_bucket_object" "index" {
  bucket       = module.cloudfront_s3_cdn.s3_bucket
  key          = "index.html"
  acl          = "public-read"
  source       = "${path.module}/test/index.html"
  content_type = "text/html"
  etag         = md5(file("${path.module}/test/index.html"))
}
