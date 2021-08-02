# Commands

## Convert svg to png

`rsvg-convert -h 1000 banner.svg > banner.png`

## Docker

### Algolia

`docker run -it --env-file=.env -e "CONFIG=$(cat /Users/dtomlinson/git-repos/web-dev/panaetius-blog/blog/docsearch.json | jq -r tostring)" algolia/docsearch-scraper`
