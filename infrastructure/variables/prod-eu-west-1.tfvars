# module
name    = "panaetius-blog"
region  = "eu-west-1"
stage   = "prod"
profile = "admin"

# cloudfront
acm_certificate_arn = "arn:aws:acm:us-east-1:745437999005:certificate/60af49f0-07bb-4680-8f5b-3c9a33f756e5"
parent_zone_id      = "Z05316671VABVSMAAF1RC"
aliases             = ["panaetius.io"]
allowed_origins     = ["*.panaetius.io"]

# s3 & lambda
acl         = "private"
lambda_key  = "main.zip"
source_file = "./lambda/prod-panaetius-blog-lambda/main.zip"
handler     = "main.handler"
runtime     = "nodejs12.x"
s3_region   = "us-east-1"
