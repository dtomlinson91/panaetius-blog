---
title: "Development"
date: "2021-07-13T13:35:50+0100"
images:
  - "images/banner.png"
draft: true
authors:
  - "Daniel Tomlinson"
tags:
  - "Introduction"
  - "test"
  - "another"
  - "tagging"
  - "hugo"
  - "newz"
series:
  - "Test series of articles"
banner: true
---

Hugo ships with several [Built-in Shortcodes](https://gohugo.io/content-management/shortcodes/#use-hugo-s-built-in-shortcodes) for rich content, along with a [Privacy Config](https://gohugo.io/about/hugo-and-gdpr/) and a set of Simple Shortcodes that enable static and no-JS versions of various social media embeds.

{{< notice series >}}
Part 1 of the [Test series of articles](/series/test-series-of-articles/) series
{{< /notice >}}

<!--more-->

## Test code

```python
import flask

def flask():
    something = flask.something()
    return something
```

## Instagram Simple Shortcode

<!-- {{< instagram_simple BGvuInzyFAe hidecaption >}} -->

<br>

---

## YouTube Privacy Enhanced Shortcode

{{< youtube ZJthWmvUzzc >}}

<br>

---

## Twitter Simple Shortcode

{{< twitter_simple 1085870671291310081 >}}

<br>

---

## Vimeo Simple Shortcode

{{< vimeo_simple 48912912 >}}

---

## Test img shortcode

{{< img "images/banner.svg" >}}

### Test indent

something

## Test table

Does Hugo put the class of the table as `content table`? If so do we need to add the bootstrap `table` class?.

Hugo adds no css to the table. In order to style it you should select the `<table>` element in the `.content` class, and add the `.table` class to it.

| Name   | Job      |
| ------ | -------- |
| Daniel | Capacity |
| Dale   | Capacity |

## Admonitions

{{< notice note >}}
Note Admonition
{{< /notice >}}

{{< notice tip >}}
Tip Admonition
{{< /notice >}}

{{< notice info >}}
Infomation Admonition
{{< /notice >}}

{{< notice warning >}}
This is a warning notice. Be warned! `code`
{{< /notice >}}
