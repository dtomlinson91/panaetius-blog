# Commands

## Sync static asssets

Use `yarn syncAssets`

`aws s3 sync . s3://prod-panaetius-blog-static-assets/ --exclude "*" --include "*.png" --exclude "*node_modules/*" --exclude "*resources/*" --exclude "public/*" --profile admin`

## HTMLProofer

`docker run -v /Users/dtomlinson/git-repos/web-dev/hugo/blog/blog/public/:/mounted-site mtlynch/htmlproofer /mounted-site --url-swap "https?\:\/\/(panaetius.io):"`

## Manual deployment

### Send to S3

In `./public`:

`aws s3 sync . s3://prod-panaetius-blog-origin`

### Invalidte cache

`aws cloudfront create-invalidation --distribution-id E2IHXIMPI3MZ2X --paths "/*"`
