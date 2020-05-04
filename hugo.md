# Hugo block

## Initialising

### Installation

<https://gohugo.io/getting-started/quick-start/>

Install with brew: `brew install hugo`.

### New project

Create a new site: `hugo new site blog`.

### Adding a theme

Install a theme in `./blog/themes`. If the theme is in git, you can add it as a submodule:

`git submodule add https://github.com/puresyntax71/hugo-theme-chunky-poster themes/hugo-theme-chunky-poster`.

Add the theme to the `config.toml` file:

```toml
theme = "hugo-theme-chunky-poster"
```

### Adding content

Use the command `hugo new folder/content.md`. You can manually create the file, but this command will insert some metadata for you automatically.

## Themes

### hugo-theme-chunky-poster

<https://themes.gohugo.io/hugo-theme-chunky-poster/>

Example `config.toml` for this theme: <https://github.com/puresyntax71/hugo-theme-chunky-poster/blob/master/exampleSite/config.toml>.

#### Configuration

In the `config.toml` you should configure the theme.

You should configure the menubar, taxonomies and the params of the homepage.



#### Create a new Author

Based on <https://www.netlify.com/blog/2018/07/24/hugo-tips-how-to-create-author-pages/>.

Author is a taxomony, create a new author with (in the root of the hugo project):

`hugo new authors/daniel-tomlinson/_index.md`

Example file: <https://raw.githubusercontent.com/puresyntax71/hugo-theme-chunky-poster/master/exampleSite/content/authors/hugo-authors/_index.md>.

#### Create new page

## Features

### Taxonomies

<https://gohugo.io/content-management/taxonomies/>

You can use taxonomies to group content together. They are logical grouping of posts which can be used to group different posts together based on additional metadata.

An example from the documentation for an actor taxomony:

```text
Actor                    <- Taxonomy
    Bruce Willis         <- Term
        The Sixth Sense  <- Value
        Unbreakable      <- Value
        Moonrise Kingdom <- Value
    Samuel L. Jackson    <- Term
        Unbreakable      <- Value
        The Avengers     <- Value
        xXx              <- Value
```

For example, you could have a series taxomony to group together a long series of blog posts. This blog post could be "deploying Strapi to EB" and be comprised of many posts in different tags all grouped under one taxomony. You can then add additional series for different things and see them all from one place.

#### Configure

You should define the taxonomies in the `config.toml`:

```toml
[taxonomies]
  category = "categories"
  series = "series"
  tag = "tags"
```

Then add it to your front matter (posts etc.):

```markdown
categories = ["Development"]
project_url = "https://github.com/gohugoio/hugo"
series = ["Go Web Dev"]
slug = "hugo"
tags = ["Development", "Go", "fast", "Blogging"]
title = "Hugo: A fast and flexible static site generator"
```

### Front matter

You can insert metadata into your markdown/html. This is called front matter and is metadata associated with a post.

<https://gohugo.io/content-management/front-matter/#front-matter-formats>.

There are different opening/closing formats for front matter depending on what data format you want to use.

TOML uses `+++` whereas YAML uses `---`.

### Aliases

Aliases can be used to redirect people to another page.

For example, if you write a new blog post to replace an old one, you can add an alias to the old one in the new one. Then whenever someone visits the old page they will be redirected automatically to the new one.

<https://gohugo.io/content-management/urls/#aliases>.
