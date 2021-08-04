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
- An account with Algolia.
- A search index on Algolia.

{{< notice info >}}
Algolia has a [free tier](https://www.algolia.com/pricing/) for all accounts which includes 10,000 searches and 10,000 records. If you go over this limit you'll pay $1.00 per 1,000 requests.
{{< /notice >}}

You'll need to have a Hugo website that is published and live on the internet. This is so that the scraper can index the links to be used when a user runs a search. You shouldn't run the scraper on a local or development instance of your site.

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
- The Application ID - this refers to the application where you index belongs.
- The Index name.

{{< notice warning >}}
Your Admin API Key should be kept secret at all times. Do not expose this key to anyone or anywhere in your code/site. To perform searches we will use the Search-Only API Key. Anyone who has your Admin key can perform any action against your account. If you accidently expose this key you can regenerate a new one which will disable the old key.
{{< /notice >}}

To find your API keys look at the panel where you clicked the blue search icon. At the bottom there will be an icon called *platform* that looks somewhat like a grey/blue cloud. Click this icon and click *Api Keys* under *Developer Tools*.

{{< img "images/algolia_platform_page.png" "open the platform page" >}}

On this page click the *copy to clipboard* icon to the right of the Admin API Key, Search-Only API Key and Application ID and make a note of these somewhere.
