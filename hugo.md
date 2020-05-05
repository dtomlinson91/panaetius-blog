# Hugo block

## Running server

You can use `hugo server -D` to run a server locally to view your site in real time.

The `-D` flag will include drafts - make sure to set the draft to false in any content before publishing.

## Initialising

### gitignore

TODO: Add this add a seperate Trilium link for resources.

Use <https://www.gitignore.io>.

Example for Hugo:

```text
# Created by https://www.gitignore.io/api/hugo
# Edit at https://www.gitignore.io/?templates=hugo

### Hugo ###
# Generated files by hugo
/public/
/resources/_gen/

# Executable may be added to repository
hugo.exe
hugo.darwin
hugo.linux

# End of https://www.gitignore.io/api/hugo
```

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

#### Rebuilding theme

Any custom scss should go in `./blog/themes/hugo-theme-chunky-poster/src/scss/chunky-poster.scss`.

Beware that any overrides must come **before** the scss import. It is better to place them in `_variables.scss` as in the source code this comes before the bootstrap + chunky-poster stylesheets.

Any bootstrap variable overrides can go in `_variables.scss` in that folder.

To rebuild the theme for production, you should first do `yarn install` then `yarn build`. Make sure you do not commit the `node_modules` folder to git.

##### Overriding css

In the `_variables.scss` you can add an overrides section:

```scss
// Overrides

$body-bg: #f9f9f9;

.navbar {
  border-bottom: 1px solid rgb(210, 210, 214);
}

body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif !important;
}
```

#### Configuration

In the `config.toml` you should configure the theme.

You should configure the menubar, taxonomies and the params of the homepage.

Example `config.toml` file: <https://git.panaetius.co.uk/hugo/blog/src/branch/master/blog/config.toml>.

#### Create a new Author

The author folder name should have `-` not `_`.

Based on <https://www.netlify.com/blog/2018/07/24/hugo-tips-how-to-create-author-pages/>.

Author is a taxomony, create a new author with (in the root of the hugo project):

`hugo new authors/daniel-tomlinson/_index.md`

Example file: <https://raw.githubusercontent.com/puresyntax71/hugo-theme-chunky-poster/master/exampleSite/content/authors/hugo-authors/_index.md>.

Refer to the author in posts with the value in `name`.

#### Create new post

`hugo new post/post-title.md`

#### Footer at bottom of page

On pages where the content does fill the full height, the footer won't go to the bottom of the page. To fix this (for taxomonies) you should add `min-height: calc(100vh - 121px);` to the `<main>` element in all the `list.html` files.

The hight to subtract should be the exact height of the footer.

#### Commento

You can add the url to the commento `.js` file in the `config.toml`.

```toml
[params.commento]
enable = true
url = "http://localhost/js/commento.js"
```

Comments will then be available on a post page.

### Adding images to content

You can edit the `config.toml` under the `[params]` stanza to edit the homepage description text on the homepage. The title is under the root header.

Images should go in `contents/images`. For each post you can specify an image that shares the same filename. E.g `post1.md` should have `post1.png` in `content/images`.

The homepage image should go under the `params` stanza.

### Editing default files

- homepage
- _index for posts (explain how)

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

When you visit a taxomony URL (say <http://localhost:1313/tags/>) it will use (in theme) `./layouts/_default/list.html`.

If you want a custom layout for a certain taxomony, e.g author, create this file in the relative path: `./layouts/authors/list.html`.

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

### Shortcodes

<https://gohugo.io/content-management/shortcodes/#use-hugo-s-built-in-shortcodes>

Shortcodes are snippets provided by Hugo that allow quick linking to additional content. E.g you can refer to a youtube video in your markdown with: `{{< youtube ZJthWmvUzzc >}}`.

A really useful feature is the ability to quickly generate a link to another page in Hugo using its filename:

<https://gohugo.io/content-management/shortcodes/#use-hugo-s-built-in-shortcodes>

```markdown
[Neat]({{< ref "blog/neat.md" >}})
[Who]({{< relref "about.md#who" >}})
```

