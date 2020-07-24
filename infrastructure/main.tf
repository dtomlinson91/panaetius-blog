# aws config
provider "aws" {
  region  = var.region
  profile = var.profile
  version = "~> 2.66"
}

provider "aws" {
  alias   = "us_east_1"
  profile = var.profile
  region  = "us-east-1"
}

# tags
locals {
  tags = {
    "Project"     = "panaetius-blog"
    "Description" = "terraform resources to host the blog"
  }
}

# cloudfront
module "cloudfront_s3_cdn" {
  source                   = "git::https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn.git?ref=tags/0.23.1"
  stage                    = var.stage
  name                     = var.name
  parent_zone_id           = var.parent_zone_id
  acm_certificate_arn      = var.acm_certificate_arn
  use_regional_s3_endpoint = true
  origin_force_destroy     = true
  compress                 = true
  cors_allowed_headers     = ["*"]
  cors_allowed_methods     = ["GET", "HEAD", "PUT", "POST"]
  cors_allowed_origins     = var.allowed_origins
  tags                     = local.tags
  aliases                  = var.aliases
  index_document           = "index.html"
  lambda_function_association = [
    {
      event_type : "origin-request",
      lambda_arn : aws_lambda_function.directory_indexes.qualified_arn,
      include_body : false
    }
  ]

  # this policy sets the bucket to be public for all newly created files
  additional_bucket_policy = <<-EOT
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid":"PublicRead",
        "Effect":"Allow",
        "Principal":"*",
        "Action":["s3:GetObject"],
        "Resource":"arn:aws:s3:::${module.cloudfront_s3_cdn.s3_bucket}/*"
      }
    ]
  }
  EOT
}

# # cloudfront lambda@edge

# resource "aws_s3_bucket" "lambda_s3" {
#   provider = aws.us_east_1
#   region   = var.s3_region
#   bucket   = "${var.stage}-${var.name}-lambda-function"
#   acl      = var.acl
#   tags     = local.tags
# }

data "archive_file" "lambda_main" {
  type        = "zip"
  source_file = var.source_file
  output_path = "${var.source_file}.zip"
}

# resource "aws_s3_bucket_object" "main" {
#   provider = aws.us_east_1
#   bucket   = aws_s3_bucket.lambda_s3.id
#   key      = var.lambda_key
#   acl      = var.acl
#   source   = var.source_file
# }

resource "aws_lambda_function" "directory_indexes" {
  provider         = aws.us_east_1
  function_name    = "${var.stage}-${var.name}-directory_indexes"
  filename         = "${var.source_file}.zip"
  source_code_hash = data.archive_file.lambda_main.output_base64sha256
  # s3_bucket     = aws_s3_bucket.lambda_s3.id
  # s3_key        = var.lambda_key
  handler = var.handler
  runtime = var.runtime
  role    = aws_iam_role.lambda_role.arn
  publish = true
  tags    = local.tags

  depends_on = [aws_iam_role_policy_attachment.lambda_logging]
}

## Lambda iam role & policies

resource "aws_iam_role" "lambda_role" {
  name = "${var.stage}-${var.name}-lambda"
  tags = local.tags

  assume_role_policy = <<-EOT
  {
    "Version": "2012-10-17",
    "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
              "Service": [
                "lambda.amazonaws.com",
                "edgelambda.amazonaws.com"
              ]
          },
          "Action": "sts:AssumeRole"
        }
    ]
  }
  EOT
}

resource "aws_iam_policy" "lambda_logging" {
  name   = "${var.stage}-${var.name}-lambda_logging"
  policy = <<-EOT
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*",
        "Effect": "Allow"
      }
    ]
  }
  EOT
}

resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}
