## Layout

There are a lot of template types: <https://gohugo.io/templates/>.

### Templates

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

### Difference between \_index.md and index.md (Bundles)

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

#### Branch bundles

These are used in list pages.

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

### Adding content

There are a lot of template types: <https://gohugo.io/templates/>.

- Adding single pages (about etc)
- Adding content (blog posts) - index + html files
