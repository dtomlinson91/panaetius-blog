## Layout

There are a lot of template types: <https://gohugo.io/templates/>.

### Templates

The layout order is important in Hugo. You can use this to see all the different template pages you can create, and where they should go. It will show the order of preference when looked up.

<https://gohugo.io/templates/lookup-order/>

#### Base template

<https://gohugo.io/templates/base/#define-the-base-template>

You should create a base template in `layouts/_default/baseof.html`.

This base template should define blocks and partials as a base template for the whole site.

#### Homepage

<https://gohugo.io/templates/homepage/>

You should create an `index.html` file in `./layouts`. This html file will be your homepage. Typically you would define a main block and have the main content of the page generated here.

You can use front matter and content to fill this homepage. You should create a `./content/_index.md` file to populate page variables, e.g `{{.Content}}`.

Alternatively, you can just have the `index.html` reference `Site` wide variables from your config file and not have the `_index.md`. This is done in the chunky theme.

```hugo
{{- range first 1 (where .Site.RegularPages "Type" "in"
.Site.Params.mainSections) -}}
{{ $page := . }}
```

#### Single pages

<https://gohugo.io/templates/single-page-templates/>

These are useful for blog posts. You should create a folder with the name of the single page type and a `single.html` in `./layouts`: `./layouts/post/single.html`.

You can have a `single.html` in `./layouts/_default` to be used as a default as well. Any content which has a `single.html` will take precedence over this file.

This `single.html` can then define a main block.

Content from markdown files should go in `./content/post`. No `index.md` file is needed in this case. You can of course create a bundle of associated images or extra content to be able to reference them from the front matter.

#### List pages

<https://gohugo.io/templates/lists>

You can define a list page for taxonomies for example.

A list template is a page that houses a list of things. These could be articles, or taxonomies, or even articles under a taxonomy.

To do this for authors, create a `list.html` in `./layouts/authors`.

This `list.html` should define a `main` block, and what you want the page to look like when this is visited. If you create a `daniel-tomlinson` author, this is the page that will be used to display this author.

This `list.html` will be used for the endpoint `/authors`, as well any actual authors `/authors/daniel-tomlinson`. If you want to display a different template for the `/authors`, say a list of all authors, then look at term pages.

To display content, create an `_index.md` file in `./content/authors/daniel-tomlinson`.

For a _branch_ bundle you need an `_index.md` at the lowest branch for the tree to be navigable. You can optionally put one at other points along the chain if you want metadata in there as well. E.g `./layouts/authors` can have an `_index.md`, but it doesn't need one. You would need one in `./layouts/authors/daniel-tomlinson` in order for the tree to work.

This `_index.md` is used for metadata, and any content you want to be displayed. This content can be displayed in the `list.html` with

```hugo
<div class="content">
    {{ $term.Content }}
</div>
```

#### Term pages

In addition to list pages, you might want to display a different page if someone visits `panaetius.io/authors` to the page if you visited an actual author. With just a `list.html` in `./layouts/authors`, this `list.html` will be used for the `/authors` endpoint.

To display different content, you should create a `terms.html`.

You can list all pages under this taxonomy in this `list.html` with the variable `{{ range .Data.Pages }}`.

You can also list all site variables, for example you can have a `/tags` endpoint and reference and display all the tags, even though they're not physically rendered in any other page:

```hugo
<ul>
{{ range .Site.Taxonomies.tags }}
    <li>
        <a href="{{ .Page.Permalink }}">{{ .Page.Title }}
        </a> {{ .Count }}</li>
{{ end }}
</ul>
```

If you create a `terms.html` in `./layouts/authors` you can then access all pages under this bundle. To Display and link to the author names pages themselves:

```hugo
<div class="row justify-content-center">
    <ul>
    {{ range .Data.Pages }}
    {{ $page := . }}
    {{ range .Params.name }}
    <li><a href="{{ $page.Permalink }}">{{ . }}</a></li>
    {{ end }}
    {{ end }}
    </ul>
</div>
```

For more things you can do with taxonomy or term pages, see <https://gohugo.io/templates/taxonomy-templates/>.

### Difference between \_index.md and index.md (Bundles)

A really good resource explaining these concepts, and going into more detail on resources in Hugo is: <https://regisphilibert.com/blog/2018/01/hugo-page-resources-and-how-to-use-them/>

<https://gohugo.io/content-management/page-bundles/#readout>

<https://discourse.gohugo.io/t/what-is-the-difference-between-index-md-and-index-md/10330/11>

There are two types of bundles:

- Leaf bundle: has no children
- Branch bundle: homepage, section, taxonomy terms, taxonomy list.

|                                    | Leaf Bundle                                              | Branch Bundle                                                                                                  |     |     |
| ---------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --- | --- |
| Usage                              | Collection of content and attachments for single pages   | Collection of attachments for section pages (home page, section, taxonomy terms, taxonomy list)                |     |     |
| Index file name                    | index.md                                                 | \_index.md                                                                                                     |     |     |
| Allowed Resources                  | Page and non-page (like images, pdf, etc.) types         | Only non-page (like images, pdf, etc.) types                                                                   |     |     |
| Where can the Resources live?      | At any directory level within the leaf bundle directory. | Only in the directory level of the branch bundle directory i.e. the directory containing the \_index.md (ref). |     |     |
| Layout type                        | single                                                   | list                                                                                                           |     |     |
| Nesting                            | Does not allow nesting of more bundles under it          | Allows nesting of leaf or branch bundles under it                                                              |     |     |
| Example                            | content/posts/my-post/index.md                           | content/posts/\_index.md                                                                                       |     |     |
| Content from non-index page files… | Accessed only as page resources                          | Accessed only as regular pages                                                                                 |     |     |

#### Leaf bundles

You can use these to "bundle up" content that needs to be useable.

An example of using headless bundles to reference pages in a bundle and display them somewhere: <https://gohugo.io/content-management/page-bundles/#headless-bundle>.

##### Use 1: Images

For example, you can create `./content/images` with an `index.md` that has `headless: true`. The contents of `./content/images` won't be published, but they will be accessible to other resources. You could reference these images locally in another content type. E.g `./content/posts/page.md` could reference one of these images.

```text
./content/images
├── data_report.svg
├── first_post.svg
├── homepage.svg
└── index.md
```

These can be referenced in front matter with `images: ["/images/first_post.svg"]` in the files:

```text
./content/post
├── first_post.md
└── second_post.md
```

##### index.md

Essentially: `index.md` is used to create _bundles_ of content. If you're writing a collection of single posts, you can create a folder for each one in `./content/posts/`:

```text
./content/post
├── first_post
│  ├── images
│  │  └── banner.svg
│  └── index.md
└── second_post
   ├── images
   │  └── banner.svg
   └── index.md
```

The `index.md` should contain all the markdown for the page. Because it is called `index.md`, it won't create a new endpoint it will be referenced and displayed at `/post/first_post`.

You can then create `single.html` and custom views like `card.html` in `./layouts/post` for this content.

In the `single.html` in `./layouts/post/` we can use the following to refer to the banner image for each post:

```html
{{- with .Resources.Match "images/banner.svg" -}} {{ range . }}
<div class="row justify-content-center mb-3">
  <div class="col-lg-10">
    <img
      data-src="{{ .RelPermalink }}"
      class="img-fluid rounded mx-auto d-block"
      alt="{{ $page.Title }}"
      data-aos="zoom-in"
    />
  </div>
</div>
{{- end -}} {{- end -}}
```

#### Branch bundles

These are used in list pages.

If you have a taxonomy, you need a

If you have an `_index.md` then all markdown files alongside it will render as a list template, and not as a single page template: <https://gohugo.io/templates/lists#add-content-and-front-matter-to-list-pages>.

##### Use 1: Taxonomy metadata

<https://gohugo.io/content-management/taxonomies/#add-custom-metadata-to-a-taxonomy-term>

One typical use is to add metadata to taxonomies. For example, if you have an author in `./content/authors/daniel-tomlinson`, you can place an `_index.md` file in here with a `twitter: link`. Then in the `./layouts/authors/list.html` you can reference it with `$term.Params.twitter`.

You can place markdown content inside this `_index.md` file to be displayed on the page. In the `list.html` you should reference it with:

```hugo
{{ define "main" }}
{{- $term := . -}}
<div class="content">
    {{ $term.Content }}
</div>
```

### Using bundles to reference files relative to its own post

We've seen how we can use bundles to access images relative to its own page. (I.e a banner image that is shown automatically in the `single.html`)

We can extend this and use Resources and the page's front matter to include anything in these bundles, and have them available locally.

This link explains it in detail: <https://regisphilibert.com/blog/2018/01/hugo-page-resources-and-how-to-use-them/#practice-page-manifest-using-resources-and-metadata>.

### Shortcodes

<https://regisphilibert.com/blog/2018/01/hugo-page-resources-and-how-to-use-them/#in-my-markdown>

We can use shortcodes to define snippets of html that we can reference in the markdown. This will let us dynamically insert content, such as an image or even a link to a file.

#### Displaying an image

The following is a shortcode template that can be used to display an image:

```html
{{ $img := $.Page.Resources.GetMatch (.Get 0)}}
<figure>
  <img src="{{ $img.RelPermalink }}" alt="(.Get 1)" />
  <figcaption>{{.Get 1}}</figcaption>
</figure>
```

This shortcode expects two arguments (by using `.Get`). The first is the name of the image which `Resources` will use to find the file, and the second is a caption to go alongside it.

This shortcode should go in `./layouts/shortcodes/` and we will call it `img.html`.

Then, in your markdown you can reference it using:

```markdown
{{< img "*overcooked-dough*" "Those cupcakes are way overcooked!" >}}
```

It will look for the image called `overcooked-dough` and use the caption we provided.

#### Rendering a list of files

<https://regisphilibert.com/blog/2018/01/hugo-page-resources-and-how-to-use-them/#practice-page-manifest-using-resources-and-metadata>

You can use metadata in your front matter to reference and define resources: <https://regisphilibert.com/blog/2018/01/hugo-page-resources-and-how-to-use-them/#page-resources-metadata>.

We can create a `manifest.html` in `./layouts/shortcodes`:

```html
<ul>
  {{ range .Resources.Match "documents/*" }}
  <li>
    <a target="_blank" href="{{ .Permalink }}">
      <i class="far fa-file-{{ .Params.icon }}"></i> {{ .Title }}
      <small>{{ with .Params.ref }}(Ref.{{ . }}) {{ end }}</small>
    </a>
  </li>
  {{ end }}
</ul>
```

Then in the markdown we reference it like:

```markdown
title: "Bogus Application"
date: 2018-01-10T10:36:47-05:00

resources:

- src: 'documents/guide.pdf'
  name: Instruction Guide
  params:
  ref: '90564568'
- src: 'documents/checklist.pdf'
  name: Document Checklist
  params:
  ref: '90564572'
- src: photo_specs.pdf
  name: Photo Specifications
  params:
  ref: '90564687'
- src: 'documents/payment.docx'
  name: Proof of Payment

# Now our shared values

- src: '\*.pdf'
  params:
  icon: pdf
- src: '\*.docx'
  params:
  icon: word

{{< manifest >}}
```

This will look for all files in (for example) `./content/post/first_post/documents` and display them in a list.

Note the metadata. When using this resources in the front matter although the items in the list are all lower case in the template they will be referenced by their capital letter. Eg `.Name` and `.Title`.

name is _overwriting_ the filename. If you specify name you're setting a new name for Hugo. It will match with `.Match` and `.GetMatch` against this new name. This is useful if your filenames are ugly, or automatically generated by something and you want to display them differently.

Title is using the same name as name (confusing!).

params allows you to specify additional custom information about the file. Here we're using a wildcarded `src` to find `.pdf` files and setting an `icon` parameter for Font Awesome.

An example of this live is here: <https://regisphilibert.com/bogus/application/>.

### Blocks

You can define blocks in a base template and put content in it. Then you can overwrite these blocks in other templates.

E.g in a `baseof.html`: `{{ block "main" . }}{{ end }}`.

In any content, you can define a `main` block to fill and override this content in:

```hugo
{{ define "main" }}
<main class="content-page container pt-7 pb-5">
{{ end }}
```

You can of course use the local variables to access the content's metadata in these define blocks.

Base templates should go in `./layouts/_default`. E.g a `single.html`

### Partials

<https://gohugo.io/templates/partials>

Partials are partial page content that can be used in addition to blocks.

They only have access to the parent scope and you must pass down the scope with a `.` when you write the partial tag:

```html
{{ partial "footer.html" . }}
```

You have access to the `Site` variables globally, and any other variables that are defined in its parent.

You can also use partials to return a value of any type. For example, you could create a partial which returns pages that has a `featured` parameter in its front matter.

You can access `site.RegularPages` in the partial to access a parameter in each page, and display them: <https://gohugo.io/templates/partials#example-getfeatured>.

### Render functions

In a template file, can grab content (with the `Range` function):

```html
<div class="articles row row-cols-1 row-cols-lg-3">
  {{ range after 1 (where .Site.RegularPages "Type" "in"
  .Site.Params.mainSections) }}
  <div class="col mb-3" data-aos="zoom-in">
    {{ .Render "card" }}
  </div>
  {{ end }}
</div>
```

And pass it off to a Render function which references a view. In this case `card` is a template in `./layouts/_default/card.html`.

If you want a different view depending on the content being rendered, you should create the `card.html` for each content you want it to be applied to.

So if we wanted to use `card.html` for post and it be different to the default view, we should create `./layouts/post/card.html`.

Hugo knows the content type and location when using a render, and will use it if it exists, and default to the view in `./layout/_default` if not.

This only works in a list context - i.e in your `html` template you should use `range` or some other command that gets you a list context.

#### Not using render functions

If you don't need to use render functions, say you want to grab the content and not pass it to a view html template you can always do it inline:

```html
{{- range first 1 (where .Site.RegularPages "Type" "in"
.Site.Params.mainSections) -}} {{ $page := . }}
<div class="latest row py-lg-5">
  <div class="col-lg-6 mb-3">
    {{- with .Resources.Match "images/banner.svg" -}} {{ range . }} {{- $image
    := . -}}
    <a href="{{ $page.RelPermalink }}" class="d-block">
      <img
        data-src="{{ $image.RelPermalink }}"
        class="img-fluid rounded"
        alt="{{ $page.Title }}"
        data-aos="zoom-in"
      />
    </a>
    {{- end -}} {{- end -}}
  </div>
  <div class="col-lg-6 mb-3">
    <h5 class="created text-muted text-uppercase font-weight-bold">
      {{ $page.Date.Format "January 2, 2006" }}
    </h5>
    <h2><a href="{{ $page.RelPermalink }}">{{ $page.Title }}</a></h2>

    <div class="content">
      {{ $page.Summary }}
    </div>
  </div>
</div>
{{- end -}}
```

### Chaining multiple Range or With commands in html templates

If you need to use multiple `range` and `with` statements in the `html` templates, you can use variables in Hugo to store the reference to be used later on in the chain:

```hugo
{{- range first 1 (where .Site.RegularPages "Type" "in" .Site.Params.mainSections) -}}
    {{ $page := . }}
    <div class="latest row py-lg-5">
        <div class="col-lg-6 mb-3">
            {{- with $page.Params.images -}}
                {{- $images := . -}}
```

### html snippets for templates

#### Get authors from front matter

`{{ .Params.authors }}`

#### Iterate through a list

```hugo
{{ range $term.Params.name }}
{{ end }}
```

#### Get n'th item

`{{ index $term.Params.name 0 }}`

#### Get the corresponding page in a bundle from an author

You can access paramters in other pages from a different page by using `$.Site.GetPage` to find the page. You can find the page using front matter from the current page you are in as a variable.

```hugo
{{- with $.Site.GetPage (printf "/authors/%s" (. | urlize)) -}}
{{- $term := . -}}
```

You can get the permalink of this page to use in the html

`{{ $term.RelPermalink }}`

We use this to get the image of an author in a branch bundle.

#### Get a resource (image etc) from a parameter

`{{- with .Resources.GetMatch (index $term.Params.images 0) -}}`
`{{ end }}`

You can resize the image

`{{- $image := .Resize "64x" -}}`

And then use the permalink to display in html

`{{ $image.RelPermalink }}`

#### Set parameter

`{{ $term := . }}`

#### Access all pages in a branch bundle

If you're writing a `terms.html` you can find all page in the bundle with

```hugo
{{ range .Data.Pages }}
{{ end }}
```

### Search

Using `lunr.js` with Hugo: <https://codewithhugo.com/hugo-lunrjs-search-index/>.

Generating a search index that recursively finds all files: <https://git.sr.ht/~exprez135/mediumish-taliaferro/tree/master/layouts/search-page/search.html>.

#### Creating a search index using Scratch (optional)

<https://gohugo.io/functions/scratch/>
<https://regisphilibert.com/blog/2017/04/hugo-scratch-explained-variable/>

You can dynamically create a whole index of all blog posts or any content in a json file with Hugo.

This won't be used to search against, but it can be useful if you want to see all content across all pages.

You should first add `JSON` to the `[outputs]` stanza in your `config.toml` file:

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
  page = ["HTML", "RSS"]
```

Then in `./layouts/_default` create an `index.json` file.

We can utilise the Hugo command scratch, which creates a temporary scratch pad to store variables, to create a json object for the whole site:

```json
{{- $.Scratch.Add "index" slice -}}
{{- range .Site.RegularPages -}}
    {{- $.Scratch.Add "index" (dict "title" .Title "subtitle" .Params.subtitle "description" .Params.description "tags" .Params.tags "images" .Params.images "content" .Plain "permalink" .Permalink) -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

#### Creating a search page

You can create a new `single.html` in `./layouts/search/`.

Then you can create a new markdown file `index.md` in `./content/search`.

This markdown file should set the `type` in the front matter - this should be set to `search` so it uses the search `single.html`.

```markdown
---
headless: false
type: "search"
---
```

#### Using lunr.js

In the root of the Hugo project, next to the `config.toml`, do:

`yarn add lunr`
`yarn add parser-front-matter`

TODO: document installing this using webpack bundles! Not copying `lunr` across to the `./static/js` folder.

We write the javascript that runs `lunr.js` to build the index. An example can be found here:

TODO: link to the `build-lunrjs-index.js` file.

Edit this file appropiately (content to be displayed, filenames to be ignored) for your project.

To build the index you run the following with node:

`node ./build-lunrjs-index.js > static/search-index.json`.

#### Search page content

TODO: Link to the search's `index.html` in the new theme.

You can see an example of the search page's content in the repo above.

The idea is to have Hugo generate the data you want to show after a search for all posts that you want to search against. Since Hugo is a static site generator, once it's built it's final and we can't dynamically alter content easily.

```hugo
<div class="row">
    {{ $p := slice }}
    {{ range (where .Site.RegularPages "Section" "==" "post") }}
    {{ $.Scratch.Set "image" .RelPermalink }}
    {{ $.Scratch.Add "image" (index .Params.images 0) }}
    {{ $post := dict "link" .RelPermalink "author" (index .Params.authors 0) "tags" .Params.tags "title" .Title "date" (.Params.date.Format "January 2, 2006") "image" ($.Scratch.Get "image") "content" (substr .Plain 0 200) -}}
    {{ $p = $p | append $post -}}
    {{ end }}
    {{ $p | jsonify }}
</div>
```

Here we are getting the title, image, tags, author and first 200 words of the content. This is the content we want to show after a search has been ran, it has nothing to do with the query itself. The final line is printing the content on the page so you can debug/test it.

In our `single.html` we load the content of this variable into javascript using Hugo's templating:

```javascript
const posts = JSON.parse(
  {{ $p | jsonify }}
);
```

We can then write the `lunr.js` code that takes the input from the user, runs it against the `lunr.js` index it has created and return a list of titles that match the search query.

We then map these titles from `lunr.js` with the titles from the frontmatter. We can then return some `html` that dynamically renders search results using the Hugo loaded variable as the content.

### SEO

To optimise Hugo for SEO we can follow this guide: <https://regisphilibert.com/blog/2017/04/hugo-scratch-explained-variable/>.

#### Structured data

Structured data is provided in your html base template that allows Google to know more about the content it is showing. Structured data shows the ratings in a review, or the calories in a recipe on the card itself in the search results.

There is a standard from Schema that shows all possible rules you can use: <https://schema.org/docs/full.html>.

Google also has documentation for certain types. A blog post or article can be found here: <https://developers.google.com/search/docs/data-types/article>.

We use this guide to set the structured data: <https://dev.to/pdwarkanath/adding-structured-data-to-your-hugo-site-58db> for a Hugo article.

Create a `schema.html` file in `./layouts/partials/`.

An example file for an article is: <https://git.panaetius.co.uk/hugo/chunky-theme/src/branch/master/layouts/partials/schema.html>.

You **need to make sure** that there is an `_index.md` in `./content/post/` which defines front matter for the `list.html`. The `schema.html` references `"image": {{ index .Params.images 0 | absURL }},` which will be checked on the `list` page because its section is equal to `post`. If you ommit this then Hugo will fail to build and give a `<index .Params.images 0>: error calling index: index of untyped nil` error.

Set the relevant parameters in the `config.toml`:

```toml
baseURL = "https://weekinmemes.com"

[params]
author = "DK"
logo = "img/logo.jpg"
header = "Week In Memes"

facebook = "weekinmemes"
twitter = "weekinmemes"
instagram = "weekinmemes"
github = "weekinmemes"
```

You should test your structured data against: <https://search.google.com/structured-data/testing-tool/u/0/>. Make sure that it is recognising all contexts you've defined. Your object should be valid json so make sure there is a parent array with commas seperating the objects.

#### Generic meta tags

The following should go in your `<head>` block:

```html
<meta charset="utf-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, shrink-to-fit=no"
/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
```

#### Title

You should set a title for your pages.

You should have a unique title for each page. This will be used to create a dynamic title for SEO like `My first blog post | panaetius.io`.

```hugo
<!-- Set dynamic title for metadata -->
{{ $scratch := newScratch }}
{{ with .Params.Title }}
{{ $scratch.Set "title" . }}
{{ $scratch.Add "title" " | " }}
{{ end }}
{{ $scratch.Add "title" .Site.Title }}

<meta property="og:title" content={{ $scratch.Get "title" }} />
<meta name="twitter:title" content={{ $scratch.Get "title" }} />
<meta itemprop="name" content={{ $scratch.Get "title" }} />
<meta name="application-name" content={{ $scratch.Get "title" }} />
<meta property="og:site_name" content={{ .Site.Title }} />
```

If the `Title` has been set on a page, it will use this then append the site title, else it will just the site title.

#### Description

<https://yoast.com/meta-descriptions/>

You should set a description on your posts and other pages.

This description should be no more than 155 characters and a few sentences. It should succintly and accurately describe your page and its content. E.g if you're writing a tutorial you would say so explicitly and give a brief idea of what it is.

```hugo
<!-- Set description -->
{{ if .Description }}
{{ $scratch.Set "description" .Description}}
{{ else if .Site.Params.description }}
{{ $scratch.Set "description" .Site.Params.description }}
{{ end }}

<meta name="description" content={{ $scratch.Get "description" }} />
<meta itemprop="description" content={{ $scratch.Get "description" }} />
<meta property="og:description" content={{ $scratch.Get "description" }} />
<meta name="twitter:description" content={{ $scratch.Get "description" }} />
```

#### Languages

<https://regisphilibert.com/blog/2018/08/hugo-multilingual-part-1-managing-content-translation/>

<https://gohugo.io/content-management/multilingual/>

You should set in your `config.toml`:

```toml
[languages]
[lanugages.en]
weight = 1
[languages.en.params]
LanguageName = "English"
```

And the following at the top level (root no header):

```toml
languageCode = "en"
DefaultContentLanguage = "en"
```

Then in the `head.html`:

```html
<meta property="og:locale" content="{{ .Language.Lang }}" />
<meta name="language" content="{{ .Site.Params.LanguageName }}" />
{{ range .AllTranslations }}
<link
  rel="alternate"
  hreflang="{{ .Language.Lang }}"
  href="{{ .Permalink }}"
  title="{{ .Language.LanguageName }}"
/>
{{ end }}
```

#### Images

Add the following to `head.html`

```hugo
<!-- Set image -->
{{ with .Params.images }}
{{ $image := index . 0 }}
<meta itemprop="image" content="{{ $image | absURL }}" />
<meta property="og:image" content="{{ $image | absURL }}" />
<meta name="twitter:image" content="{{ $image | absURL }}" />
<meta name="twitter:image:src" content="{{ $image | absURL }}" />
{{ else }}
<meta itemprop="image" content="{{ .Site.Params.homepageimage | absURL }}" />
<meta property="og:image" content="{{ .Site.Params.homepageimage | absURL }}" />
<meta name="twitter:image" content="{{ .Site.Params.homepageimage | absURL }}" />
<meta name="twitter:image:src" content="{{ .Site.Params.homepageimage | absURL }}" />
{{ end }}
```

We are using the `homepageimage` and the first image of the `images` array for any list content.

#### Date

We set the property of updated time and get the sitemap for the whole site, and for the page we are on.

```hugo
<!-- Set date -->
<meta property="og:updated_time" content={{ .Lastmod.Format "2006-01-02T15:04:05Z0700" | safeHTML }} />
<!-- Sitemap & RSS Feed Tags -->
<link rel="sitemap" type="application/xml" title="Sitemap" href="{{ .Site.BaseURL }}sitemap.xml" />
{{ with .OutputFormats.Get "RSS" }}
  <link href="{{ .Permalink }}" rel="alternate" type="application/rss+xml" title="{{ $.Site.Title }}" />
  <link href="{{ .Permalink }}" rel="feed" type="application/rss+xml" title="{{ $.Site.Title }}" />
{{ end }}
```

#### Article pages

These tags set the pagination, the publish time and author information. These should only be for blog posts or articles, not single pages like `home` or `about`.

This should be set for each `.Section` that is an article type, in this case it is just `post`.

```hugo
<!-- Set tags for article pages -->
{{ if eq .Section "post" }}
  <!-- Pagination meta tags for list pages only -->
  {{ $paginator := .Paginate (where .Pages "Section" "post") }}
  {{ if $paginator }}
    <link rel="first" href="{{ $paginator.First.URL }}">
    <link rel="last" href="{{ $paginator.Last.URL }}">
    {{ if $paginator.HasPrev }}
      <link rel="prev" href="{{ $paginator.Prev.URL }}">
    {{end }}
    {{ if $paginator.HasNext }}
      <link rel="next" href="{{ $paginator.Next.URL }}">
    {{end }}
  {{end }}
  <meta property="og:type" content="article" />
  <meta property="article:publisher" content="{{ .Site.Params.facebook }}" />
  <meta property="og:article:published_time" content={{ .Date.Format "2006-01-02T15:04:05Z0700" | safeHTML }} />
  <meta property="article:published_time" content={{ .Date.Format "2006-01-02T15:04:05Z0700" | safeHTML }} />
  {{ if .Params.authors }}
  {{ $authors := delimit .Params.authors ", " }}
    <meta property="og:article:author" content="{{ $authors }}" />
    <meta property="article:author" content="{{ $authors }}" />
    <meta name="author" content="{{ $authors }}" />
  {{ else }}
  {{ $authors := .Site.Params.author }}
    <meta property="og:article:author" content="{{ $authors }}" />
    <meta property="article:author" content="{{ $authors }}" />
    <meta name="author" content="{{ $authors }}" />
  {{ end }}
{{ end }}
```

#### Single pages

These should only be set on pages that are not articles. To do this we can use Hugo's scratch.

You should set `{{ .Scratch.Set "IsSingle" true }}` on the following templates:

- `./layouts/index.html` which is for the homepage.
- `./layouts/_default/single.html` which is for single pages like `About`.

For each article you need to make sure the `single.html` is set it is own folder where this isn't set. For example `./layouts/post/single.html` exists and does not set it.

You need to make sure the right context is passed into the partial if you do this.

Alternatively, you can do:

```hugo
<!-- Set tags for single pages -->
{{ if ne .Section "post" }}
<meta property="og:type" content="website" />
<meta name="author" content="{{ .Site.Params.author }}" />
{{ end }}
```

#### Favicon

TODO: Create seperate note with link to generating a favicon for a project.

You can generate a favicon here: <https://favicon.io/favicon-generator/>.

If you already have an icon you want to use, you can create a set of favicons out of it here: <https://realfavicongenerator.net>.

You should add the following to the `head.html` to set the favicon and additional ios/android settings. Remember to set the `manifest.json`.

```hugo
<!-- Set favicon tags -->
<link rel="shortcut icon" href="{{ "favicon.ico" | absURL }}" />
<link rel="icon" type="image/x-icon" sizes="16x16 32x32" href="{{ "favicon.ico" | absURL }}" />
<link rel="apple-touch-icon" href="{{ "apple-touch-icon.png" | absURL }}" sizes="180x180">
<link rel="icon" href="{{ "favicon-32x32.png" | absURL }} " sizes="32x32" type="image/png">
<link rel="icon" href="{{ "favicon-16x16.png" | absURL }}" sizes="16x16" type="image/png">
<link rel="manifest" href="{{ "manifest.json" | absURL }}">
<link rel="mask-icon" href="{{ "safari-pinned-tab.svg" | absURL }}" color="#0c344b">
```

#### Search engine tags

These tell google and other search engines that they can index and scrape the site.

```hugo
<meta name="robots" content="index,follow" />
<meta name="googlebot" content="index,follow" />
```

#### Twitter/Facebook tags

More information on these is here: <https://stackoverflow.com/questions/10836135/when-do-i-need-a-fbapp-id-or-fbadmins>. These are optional if you're not maintaining a facebook app to go alongside the website.

```hugo
<meta name="twitter:site" content="{{ .Site.Params.twitter }}">
<meta name="twitter:creator" content="{{ .Site.Params.twitter }}" />
<meta property="fb:app_id" content="538089519640705" />
<meta property="fb:admins" content="100000686899395" />
```

#### Other tags

```hugo
<!-- Theme Color -->
<meta name="theme-color" content="#141414" />
<meta name="msapplication-TileColor" content="#141414" />

<meta name="keywords" content="" />
<meta name="imagemode" content="force" />
<meta name="coverage" content="Worldwide" />
<meta name="distribution" content="Global" />
<meta name="HandheldFriendly" content="True" />
<meta name="msapplication-tap-highlight" content="no" />
<meta name="apple-mobile-web-app-title" content="{{ .Site.Params.header }}" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-touch-fullscreen" content="yes" />
```

#### Internal templates

Hugo ships with internal templates for common metadata for sites: <https://gohugo.io/templates/internal/>.

```hugo
{{- template "_internal/opengraph.html" . -}}
{{- template "_internal/google_news.html" . -}}
{{- template "_internal/schema.html" . -}}
{{- template "_internal/twitter_cards.html" . -}}
```
