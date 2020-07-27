# AWS Commands

## S3

### Sync contents of folder to bucket

`aws s3 sync . s3://prod-panaetius-blog-origin --delete --profile admin`

## Cloudfront

### Create invalidation

`aws cloudfront create-invalidation --distribution-id E2IHXIMPI3MZ2X --paths "/*" --profile admin`

### Get invalidation status

`aws cloudfront get-invalidation --distribution-id E2IHXIMPI3MZ2X --id I2IYTT15CTHJU0 --profile admin`
