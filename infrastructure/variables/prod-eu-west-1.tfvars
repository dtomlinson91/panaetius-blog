name                = "panaetius-blog"
region              = "eu-west-1"
stage               = "prod"
profile             = "admin"
bucket_name         = "prod-panaetius-blog-origin"
acm_certificate_arn = "arn:aws:acm:us-east-1:745437999005:certificate/60af49f0-07bb-4680-8f5b-3c9a33f756e5"
parent_zone_id      = "Z05316671VABVSMAAF1RC"
aliases             = ["panaetius.io"]
allowed_origins     = ["*.panaetius.io"]
# log_expiration_days          = 60
# log_standard_transition_days = 60
