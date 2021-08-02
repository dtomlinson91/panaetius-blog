---
title: "Add Search to a Hugo Website Using Algolia Docsearch"
date: 2021-08-02T03:29:45+01:00
images:
  - "images/banner.png"
authors:
  - "Daniel Tomlinson"
tags:
  - "hugo"
  - "tutorials"
series:
  - "series"
draft: true
---

In this tutorial we will show how you can add search to your Hugo website/blog to
index your posts/tags/categories and any other taxonomies using the free tier of Algolia
together with the convenience of Docsearch.

<!--more-->

## Why Aloglia Docsearch?

[Algolia Docsearch](https://docsearch.algolia.com/) is a completely free service offered by Algolia
for documentation websites. You sign up, provide your website address and Algolia will
scrape your website once a day and provides you with a css and javascript snippet to
include on your site.

If you want to use Docsearch for blogs or any other kind of website Algolia will decline your application.
However, Docsearch is [open source](https://github.com/algolia/docsearch) and if you
create an Algolia account and an index (which includes the free tier) you can use
Algolia's provided Docker container to scrape your own website, and update your own index with
little effort.

### Advantages

There are several advantages to using Docsearch over Algolia's
[instantsearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/)
or [lunr.js](https://lunrjs.com/) for your Hugo project:

- It's incredibly quick to set up - no need to create/configure widgets.
- All of the searches and results are handled in the search bar - no need for a dedicated search page.
- Docsearch comes with autocomplete automatically.
- Docsearch provides all the javascript/css for you - all you have to do is insert a few lines of HTML and apply theming.
- You can use Algolia's free tier for your search index.

Try it out using the search bar at the top of this page. Search for `rust` and you'll see
posts, tags, and series which have been indexed. You can also visit the [React](https://reactjs.org/docs/getting-started.html)
documentation to see it in action.


{{< img "images/example_search.png" "example of a search using Docsearch" >}}

## Requirements
