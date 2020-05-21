# Hugo block

Awesome Hugo: <https://github.com/msfjarvis/hugo-social-metadata>

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

If you want to edit the theme, you should fork the theme, and commit it to a new repo. Then add the theme from the new repo as a submodule. Any merges upstreaming can then be done into your fork.

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

Alternatively you can follow this commit here which sets the footer to sticky: <https://github.com/MooseMagnet/hugo-theme-chunky-poster/commit/f7961d3b54cf4a0c00e8b00cf5b1b7c0b6600516>.

#### Commento

You can add the url to the commento `.js` file in the `config.toml`.

```toml
[params.commento]
enable = true
url = "http://localhost/js/commento.js"
```

Comments will then be available on a post page.

### Adding images + description to content

You can edit the `config.toml` under the `[params]` stanza to edit the homepage description text on the homepage. The title is under the root header.

You should create an `index.md` under `./content/images`. This file shoudld contain front matter:

```yaml
headless: true
```

Images should go in `contents/images`. For each post you can specify an image that shares the same filename. E.g `post1.md` should have `post1.png` in `content/images`. Remember to add the image to the list in the front matter of the post:

```yaml
title: "First Post"
date: "2020-05-04T02:14:50+01:00"
images: ["/images/Untitled 3.png"]
```

The homepage image should go under the `params` stanza.

The images should be `.png` with a size of `900x500`. You should edit

`index.html`, `single.html` and `card.html` and change the image widthxheight to `900x500` if you have downloaded the theme from scratch.

### Editing default files

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

### Image processing

You can edit and insert images dynamically with front matter. See <https://git.panaetius.co.uk/hugo/chunky-theme/src/branch/master/layouts/post/single.html#L25> for an example.

You can apply additional filtering, apply blur, resize etc: <https://gohugo.io/content-management/image-processing/>.

### Adding images to content

Good blog post explaining different ways to utilise Hugo's features: <https://laurakalbag.com/processing-responsive-images-with-hugo/>.

If you want to insert an image in the html you can use the `<img>` tag directly.

Place all images in `./static/images`, Hugo will reference these as `/images/$image`:

```html
<img
  src="/images/DUCK_256.png"
  width="30"
  height="30"
  class="mr-3 rotate-a-20"
/>
```

### Working with parameters and front matter

You can define data in your front matter, say a list of images or a single image path.

In the `html` of the post, you can then access these variables:

```hugo
{{- with $page.Params.images -}}
    {{- $images := . -}}
    {{- with $page.Site.GetPage "section" "images" -}}
        {{- with .Resources.GetMatch (strings.TrimPrefix "/images/" (index $images 0)) -}}
            {{- $image := .  -}}
            <div class="row justify-content-center mb-3">
                <div class="col-lg-10">
                    <img data-src="{{ $image.RelPermalink }}" class="img-fluid rounded mx-auto d-block" alt="{{ $page.Title }}">
                </div>
```

You can use `{{- with $page.Params.images -}}` to open a `with` block in a list.

You can set a variable to whatever the `with` block is referencing by immediately doing a `{{- $images:= . -}}`.

The `-` on both sides trims any whitespace in the outputted HTML.

## Email

### Sending email with AWS SES

You can use SES to send emails for software/clients that request email credentials (commento is one example).

The main documentation page is here: <https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-smtp.html>.

A IAM user for sending emails is:

```yaml
IAM User: ses-smtp-user.20200505-212533
SMTP Username: AKIA23D4RF6O2UKDMTCW
SMTP Password: BIx9F8PR7g1K9oObHQGElHmf3nIjCkUhJpu4GP3O3/Yq
```

You should verify an email (or domain ) that you own with AWS: <https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html>.

An example `docker-compose` for compose app sending emails with SES is here: <https://git.panaetius.co.uk/hugo/docker-compose/src/branch/master/blog/commento/docker-compose.yml>.

## Adding a new font family with CSS

To create a new font family you should create a `@font-face` in the scss. You should create multiple instances of these and specify the `font-weight` in order for the html to use the appropiate style of font.

`font-face` documentation: <https://www.w3schools.com/cssref/css3_pr_font-face_rule.asp>.

A table of `font-weight` and what `normal` and `black` correspond to in numbers (for css) can be found: <https://docs.microsoft.com/en-us/typography/opentype/spec/os2#usweightclass>.

The default `font-weight` is `normal` and the default `font-style` is `normal`.

To set an italic font you should set `font-style: italic;` in this `@font-face` for the custom italic font you want to use. Without setting this, the browser will take the weight font you are using, and apply its own slanting to it.

You should apply `font-display: swap;` to make sure the browser shows text with the default system font while the custom font is loaded in.

TODO: Link to `fonts.scss` in git

An example of what this might look like for two styles is:

```scss
@font-face {
  font-family: "RNSSanz";
  src: url("../../static/fonts/RNSSanz-Light.ttf");
  font-weight: 300;
  font-display: swap;
}

@font-face {
  font-family: "RNSSanz";
  src: url("../../static/fonts/RNSSanz-Normal.ttf");
  font-display: swap;
}
```

Then in your other `scss` files you can refer to this with `font-family: "RNSSanz` along with any of the `font-weight` you have defined.
