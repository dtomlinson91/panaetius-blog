# Commands

## Build and Deploy

`yarn buildBlog`
`docker run -v /Users/dtomlinson/git-repos/web-dev/panaetius-blog/blog/public/:/mounted-site mtlynch/htmlproofer /mounted-site --url-swap "https?\:\/\/(panaetius.io):"`
`cd public`
`aws s3 sync . s3://prod-panaetius-blog-origin --delete --profile admin && aws cloudfront create-invalidation --distribution-id E2IHXIMPI3MZ2X --paths "/*" --profile admin`

S3deploy isn't working... not accepting `--profile` for some reason...
## Convert svg to png

`rsvg-convert -h 1000 banner.svg > banner.png`

## Docker

### Algolia

`docker run -it --env-file=.env -e "CONFIG=$(cat /Users/dtomlinson/git-repos/web-dev/panaetius-blog/blog/docsearch.json | jq -r tostring)" algolia/docsearch-scraper`
