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
draft: true
---

In this tutorial we will show how you can add search to your Hugo website/blog to index your posts/tags/categories and any other taxonomies using the free tier of Algolia together with the convenience of Docsearch.

<!--more-->

## Why Aloglia Docsearch?

[Algolia Docsearch](https://docsearch.algolia.com/) is a free service that is managed by Algolia for **documentation** websites. To make us of their service you [apply to the program](https://docsearch.algolia.com/apply/), provide your website address and, if approved, Algolia will scrape your website once a day and populate a search index for you. Algolia provides you with a css and javascript snippet to include on your site.

If you want to use Docsearch for blogs or any other kind of website Algolia will decline your application. However, Docsearch is [open source](https://github.com/algolia/docsearch) and if you create an Algolia account and an index (which includes the free tier) you can use Algolia's provided Docker container to scrape your own website, and update your own index with little effort.

### Advantages

There are several advantages to using Docsearch over Algolia's
[instantsearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/)
or [lunr.js](https://lunrjs.com/) for your Hugo project:

- It's incredibly quick to set up - no need to create/configure widgets.
- All of the searches and results are handled in the search bar.
- There is no need for a dedicated search page with Hugo rendering functions.
- Docsearch comes with autocomplete automatically (this shows results as you type).
- Docsearch provides all the javascript/css for you - all you have to do is insert a few lines of HTML and apply theming.
- You can use Algolia's free tier for your search index.

Try it out using the search bar at the top of this page. Search for `rust` and you'll see posts, tags, and series which have been indexed. You can also visit the [React](https://reactjs.org/docs/getting-started.html) documentation to see it in action.

{{< img "images/example_search.png" "example of a search using Docsearch" >}}

## Requirements

There are a few things you'll need to get started:

- A working Hugo site that is deployed on the internet.
- Docker so you can run the Docsearch scraper image.
  - Alternatively you can run the scraper without Docker using Python.
- Familiarity with the command line (to run Docker).
- An account with Algolia.
- A search index on Algolia.

{{< notice info >}}
Algolia has a [free tier](https://www.algolia.com/pricing/) for all accounts which includes 10,000 searches and 10,000 records. If you go over this limit you'll pay $1.00 per 1,000 requests.
{{< /notice >}}

You'll need to have a Hugo website that is published and live on the internet. This is so that the scraper can index the links to be used when a user runs a search. You shouldn't run the scraper against a local or development instance of your site.

### Create an account on Algolia

Head over to Algolia and [sign up](https://www.algolia.com/users/sign_up) for an account if you don't
already have one. You will be given a [14 day free trial](https://www.algolia.com/doc/faq/accounts-billing/does-algolia-provide-a-free-trial/) but we will be using the free tier when this trial expires. Until the trial expires you do not need to provide any payment information. When the trial ends you'll need to add this to continue to search against any of your indexes.

You can see the pricing [here](https://www.algolia.com/pricing/) and use the calculator to see how much it could cost you each month if you go over the free limit.

### Create a search index on Algolia

Once you've created an account and logged in, click the blue search icon on the panel on the left.

{{< img "images/algolia_search_page.png" "Algolia search page" >}}

In the panel that appears click *index* and then click the *New* button and choose *index*. Give your index a sensible name. For this tutorial I will give it the name `docsearch_tutorial`.

{{< img "images/new_index.png" "create a new index" >}}

You should now have an empty index in Algolia that's ready to be populated with some data.

{{< notice note >}}
In Algolia indexes belong to an Application. An Application can hold many indexes and API keys are specific to an Application. During the free trial an Application is created for you and you cannot create another one until the trial is over or you have added payment information to your account.
{{< /notice >}}

### Obtain the API keys and Application ID

We are going to need the following to populate the index:

- The Admin API Key - this is passed to the Docker container which scrapes your site, and populates the index.
- The Search-Only API Key - this is used in your HTML to allow docsearch to run searches against your site.
- The Application ID - this refers to the application where your index belongs.
- The Index name.

{{< notice warning >}}
Your Admin API Key should be kept secret at all times. Do not expose this key to anyone or anywhere in your code/site. To perform searches we will use the Search-Only API Key. Anyone who has your Admin key can perform any action against your account. If you accidently expose this key you can regenerate a new one which will disable the old key.
{{< /notice >}}

To find your API keys look at the panel where you clicked the blue search icon. At the bottom there will be an icon called *platform* that looks somewhat like a grey/blue cloud. Click this icon and click *Api Keys* under *Developer Tools*.

{{< img "images/algolia_platform_page.png" "open the platform page" >}}

On this page click the *copy to clipboard* icon to the right of the Admin API Key, Search-Only API Key and Application ID and make a note of these somewhere.

## Populate your index

Before we run the Docker image to scrape the site, we need to create a `docsearch.json` which tells the Docsearch scraper what to look for when it scrapes your website.

### docsearch.json

This is going to be different for every website, and my configuration might not necessarily be the same one you need. Docsearch naturally assumes your content is *tiered*, with well defined headings, subheadings and text underneath in order to create an index. You can read more about how this works in the Docsearch documentation [here](https://docsearch.algolia.com/docs/how-do-we-build-an-index).

You should look at the Docsearch [documentation on config files](https://docsearch.algolia.com/docs/config-file) which has all the possible options you can use in a `docsearch.json` file.

As each configuration is different, I will show the configuration I use, explain what each option is doing, and you should be able to create something similar for your own sites.

{{< highlighter json "linenos=table,linenostart=1" docsearch.json >}}
{
  "index_name": "docsearch_tutorial",
  "scrape_start_urls": false,
  "start_urls": [
    {
      "url": "https://panaetius.io/tags/",
      "selectors_key": "tags",
      "page_rank": 2
    },
    {
      "url": "https://panaetius.io/series/",
      "selectors_key": "series",
      "page_rank": 2
    },
    {
      "url": "https://panaetius.io",
      "page_rank": 1
    }
  ],
  "selectors": {
    "default": {
      "lvl0": ".content-page h1",
      "lvl1": ".content h2",
      "lvl2": ".content h3",
      "lvl3": ".content h4",
      "lvl4": ".content h5",
      "text": ".content p"
    },
    "tags": {
      "lvl0": { "selector": "h1", "default_value": "Tags" },
      "lvl1": ".tag-title h2"
    },
    "series": {
      "lvl0": { "selector": "h1", "default_value": "Series" },
      "lvl1": ".series-title h2"
    }
  }
}
{{< /highlighter >}}

#### index_name

This should be the name of the index you created earlier.

#### scrape_start_urls

The Docsearch scraper will recursively go through your site using your `start_urls` as a base. Setting `scrape_start_urls` to `false` means the scraper will not index any content on the `start_urls` themselves.

Because we want to index taxonomies (such as tags/series/categories), we do not want the `terms.html` page indexed. On this site the `terms.html` for tags would be <https://panaetius.io/tags/>. Although this page lists all the possible tags the layout of the page is not tiered. There aren't defined headings and subheadings.

Instead we should instruct the scraper to ignore this page, but scrape all the pages under this (such as <https://panaetius.io/tags/rust/> and <https://panaetius.io/tags/hugo/>) and populate the index iteratively, so when a user searches for a tag they are taken to the `list.html` page for that tag.

This is set globally so it applies to all `start_urls`, but this setting can be moved into the `start_urls` themselves if you wanted to select which ones should be scraped, and which ones should be skipped.

#### start_urls

The `start_urls` tell the scraper what URL it should use to iteratively find all pages on your site. Docsearch works on a *first hit* basis, meaning the first `start_url` it encounters will take priority over ones further down the list.

If, for example, we had a `docsearch.json` file that had the base URL of the site first:

{{< highlighter json "linenos=table,linenostart=1" docsearch.json >}}
  "start_urls": [
    {
      "url": "https://panaetius.io",
      "page_rank": 1
    },
    {
      "url": "https://panaetius.io/tags/",
      "selectors_key": "tags",
      "page_rank": 2
    },
    {
      "url": "https://panaetius.io/series/",
      "selectors_key": "series",
      "page_rank": 2
    }
  ],
{{< /highlighter >}}

The tags and series in this configuration would be ignored completely, as the base URL includes `/tags/` and `/series/` when the scraper goes through your site. The general rule of thumb is the deeper the `start_url` is on your site, the higher it should be in the configuration with the deepest first.

We have defined custom selectors for both `tags` and `series` under the `selectors_key` property. This is because we want to tell the scraper to look for a different heading/css on those pages.

`page_rank` is a way of telling Docsearch how it should display results from these pages when a user runs a search. As we want tags and series to appear first in the search results, we set this value higher than the base url.

#### selectors

`selectors` is where you define how your page is tiered, so the scraper knows what to look for. A configuration for the post pages could look like:

{{< highlighter json "linenos=table,linenostart=1" docsearch.json >}}
"default": {
  "lvl0": ".content-page h1",
  "lvl1": ".content h2",
  "lvl2": ".content h3",
  "lvl3": ".content h4",
  "lvl4": ".content h5",
  "text": ".content p"
},
{{< /highlighter >}}

Because the main heading title is `<h1>`, we set `lvl0` to this. In the `single.html` for posts in my Hugo configuration, the class `.content-page` is inserted at the top. This means the scraper will only index pages where a `<h1>` element is found under some element with `class="content-page"`.

An example of this layout in a `single.html` is:

{{< highlighter html "linenos=table,linenostart=1" single.html >}}
{{ define "main" }}
<main class="content-page">
  {{ $page := . }}
  <h1 class="card-title-gray pt-4">{{ $page.Title }}</h1>
  <div class="row">
    <div class="content">
        {{ $page.Content }}
    </div>
  </div>
  ...
{{< /highlighter >}}

Subheadings will follow the hierarchy of `<h2>`, `<h3>`, `<h4>` etc, and the css class `content` is wrapped around the actual content on a page. This ensures that only the subheadings that are actually on the content of the page are indexed.

The text on the page will always be a `<p>` under a `class="content"` element.

For taxonomies (such as tags or series), we do not have a hirearchy to follow, instead we will tell the scraper to go to each tag page and extract the tag from each one.

{{< highlighter json "linenos=table,linenostart=1" docsearch.json >}}
"tags": {
  "lvl0": { "selector": "h1", "default_value": "Tags" },
  "lvl1": ".tag-title h2"
},
{{< /highlighter >}}

This configuration means that when the scraper encounters a `list.html` page for the taxonomy tags, it will extract the tag title from the `<h2>` tag.

Take a look at at an example `list.html` for tags:

{{< highlighter html "linenos=table,linenostart=1" list.html >}}
{{ define "main" }}
<main class="list">
  <div class="col tag-title">
    {{ with .Title }}<h2>{{ . }}</h2>{{ end }}
      ...
{{< /highlighter >}}

You can see that there is **no** `<h1>` tag on this page. This is intentional, we tell the scraper to look for a `<h1>` tag on this page and if it doesn't find one, it inserts the value `Tags` using the `"default_value": "Tags"` entry.

This ensures that when a user searches for a tag, Docsearch will have the highest heading of "Tags" to make it clear to the user that it is a Tag, and not some page named after the value of the tag. The `<h1>Tags</h1>` is intentionally left out of the `list.html` page, because we don't need to display the text "Tags" on that page, just the title of the actual tag itself.

{{< img "images/example_coding_tag.png" "example of Docsearch inserting the default value in a search result" >}}

### Run the scraper

Now you have a `docsearch.json` file we can run the scraper against your site.
