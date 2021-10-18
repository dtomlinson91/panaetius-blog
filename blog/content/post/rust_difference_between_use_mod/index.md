---
title: "The difference between mod and use in Rust"
date: 2021-10-18T00:02:52Z
images:
  - "images/banner.png"
authors:
  - "Daniel Tomlinson"
tags:
  - "rust"
  - "coding"
series:
  - "Creating modules in Rust 🦀"
---

When starting out in Rust there can be some confusion around the differences between using `mod` and `use` in Rust projects, especially if you are coming from a language such as Python/Java.

In this article we explore the basic differences between them and how to use them in Rust projects.

<!--more-->

{{< notice series >}}
Part 1 in the [Creating modules in Rust 🦀 series](/series/creating-modules-in-rust/).
{{< /notice >}}

If you haven't already you should check [Chapter 7 in the Rust book](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html) on how to manage and create a Rust crate composed of submodules.

## TLDR

Using `use` brings a Rust item into the current scope. In most cases, using `use` is optional, and can be avoided by referring to the full path of the item you want to access. `use` is primarily used to make code cleaner and less verbose.

Using `mod` defines a module which is a collection of Rust items. When you define a module, you can refer to any item inside it either by its full path, or by using `use` to bring the module into scope.

Read on for some code examples on where you would use `use` and `mod`.
## use

Let's begin with the easier to understand, `use`.

{{< notice info >}}
You should check the [Rust by example page](https://doc.rust-lang.org/stable/rust-by-example/mod/use.html) on `use` if you haven't already.
{{< /notice >}}

Using `use` simply brings another _item_ into the current namespace by following another _path_. An [item](https://doc.rust-lang.org/reference/items.html) is some general _object_ such as a function, struct or trait that you need to access.

A path is module hierarchy you need to follow to access it (we will see examples later). The current namespace means bringing an item into the current file so you can access it as if it were local.

Let's have a look at what this means.

### standard library

Let's say we want to use the [`spawn()`](https://doc.rust-lang.org/std/thread/fn.spawn.html) function from the `std` library. Because `std` is a standard library we don't need to add it to our `cargo.toml` file. In a rust file you can access it by typing:

{{< highlighter rust "linenos=table,linenostart=1" example.rs>}}
let spawned_thread = std::thread::spawn(|| {
  // some thread code
});
{{< /highlighter >}}

We can simply use the full path `std::thread::spawn()` to access this function from anywhere in our code.

But this can be become repetitive if we find ourselves using `spawn()` many times in the same file. So we can use `use` to make things more concise:

{{< highlighter rust "linenos=table,linenostart=1" example.rs >}}
use std::thread:spawn;

let spawned_thread = spawn(|| {
  // some thread code
});
{{< /highlighter >}}

By bringing `std::thread::spawn` into the current namespace it can now be accessed with just `spawn()`.

This is what `use` is used for in Rust. By using it for items we can make things less repetitive, and more concise.

### external crates

What about external crates? Does using `use` have any effect on _importing_ items?

Let's look at using [`tungstenite`](https://crates.io/crates/tungstenite) - a WebSocket inplementation for Rust.

As usual for any external crates we need to add the dependency to our `cargo.toml` file:

{{< highlighter toml "linenos=table,linenostart=1" cargo.toml >}}
tungstenite = "0.15.0"
{{< /highlighter >}}

For an example, we can use the snippet given on the `tungstenite` main page:

{{< highlighter rust "linenos=true,hl_lines=2-3 8-9" example.rs >}}
use std::net::TcpListener;
use std::thread::spawn;
use tungstenite::server::accept;

/// A WebSocket echo server
let server = TcpListener::bind("127.0.0.1:9001").unwrap();
for stream in server.incoming() {
    spawn (move || {
        let mut websocket = accept(stream.unwrap()).unwrap();
        loop {
            let msg = websocket.read_message().unwrap();

            // We do not want to send back ping/pong messages.
            if msg.is_binary() || msg.is_text() {
                websocket.write_message(msg).unwrap();
            }
        }
    });
}
{{< /highlighter >}}

We can see on the highlighted lines that using `use` allows us to simply reference the items directly, without having to type out the full path each time.

But what if we don't use `use` in this case? If we remove lines 2-3 and replace each function call with its full path instead:

{{< highlighter rust "linenos=true,hl_lines=6-7" example.rs >}}
use std::net::TcpListener;

/// A WebSocket echo server
let server = TcpListener::bind("127.0.0.1:9001").unwrap();
for stream in server.incoming() {
    std::thread::spawn (move || {
        let mut websocket = tungstenite::server::accept(stream.unwrap()).unwrap();
        loop {
            let msg = websocket.read_message().unwrap();

            // We do not want to send back ping/pong messages.
            if msg.is_binary() || msg.is_text() {
                websocket.write_message(msg).unwrap();
            }
        }
    });
}
{{< /highlighter >}}

We see that this compiles and runs just fine.

No matter if you're using an item from the standard library, an item you've written yourself somewhere in your crate or a third party library you've imported - using `use` simply provides a convenient short way to bring items into the current namespace.

{{< notice tip >}}
Using `use` is mostly **optional**. It does not function like an `import` statement. You can access any item from any path directly, there is no need to explicitly import something if you want to use it. There are a few niche cases where you can't get away without using it, but in most cases you will want to use it.
{{< /notice >}}

### additional information

Rust has a very dynamic system in place for `use` that makes it easy to bring multiple items into the current namespace without too much effort.

#### `{}` glob-like syntax

If you want to bring multiple items into the current namespace with `use` you can use `{}` glob-like syntax:

`use std::path::{self, Path, PathBuf};`

You can also chain them, such as:

`use a::b::{c, d, e::f, g::h::i};`

#### `self` keyword

You can use the `self` keyword, allowing you to bring the common parent module into the namespace as well as any items you want to access:

{{< highlighter rust "linenos=table,linenostart=1" main.rs >}}
use std::collections::hash_map::{self, HashMap};

fn main() {
    // Both `hash_map` and `HashMap` are in scope.
    let map1 = HashMap::new();
    let map2 = hash_map::HashMap::new();
}
{{< /highlighter >}}

#### `as` keyword

You can use the `as` keyword to rename items and avoid naming conflicts. For example, if we wanted to rename at `std::thread::spawn` from our earlier example we could type:

`use std::thread::spawn as spwn;`

Which can then be accessed by `spwn()`.

This can also be used with the `{}` syntax and `self` keyword:

`use a::b::{self as ab, c as abc};`

#### asterisk wildcard syntax

You can also use the asterisk wildcard syntax to bind all paths matching a given prefix. Let's say `utilities` is a module that contains two public functions: `utilities::download` and `utilities::save`:

{{< highlighter rust "linenos=table,linenostart=1" main.rs >}}
use utilities::*;

fn main() {
  download();
  save();
}
{{< /highlighter >}}

Using the wildcard syntax means we can bring everything from `utilities` into the current namespace in one go.

#### `use` summary

In summary, using `use` allows you to conveniently bring items from other Rust modules (or from other parts of your crate) into the current namespace in your current `.rs` file.

The reason there is no explicit need to import items is due to Cargo. Cargo does a lot of work behind the scenes - when you run `cargo build` on your crate, it will dynamically import and bundle up anything you have accessed in your crate so it's accessible in the final binary/library.

{{< notice info >}}
The Rust documentation resources are really well written and you can see more information of everything discussed about `use` in the reference pages [here](https://doc.rust-lang.org/reference/items/use-declarations.html).
{{< /notice >}}

## mod

It can be confusing when starting out in Rust to understand `mod` and how it differs over `use`.

When creating modules and submodules you use `mod` to declare them so you can utilise them in your current `.rs` file which can be confusing. Why not simply use `use`?

In Rust a module is simply a container for zero or more [items](https://doc.rust-lang.org/reference/items.html). It's a way of grouping items together in a logical way so that your module is easy to navigate.

Modules can be used to build up a _tree_ structure of your crate, allowing you to separate your work out over many files arbitrarily deep if needs be.

Modules can be one per `.rs` file, or a single file can contain many modules itself.

### example

Let's look at the standard library for an example. Consider the following path:

`std::os::unix::fs::MetadataExt`

Here:

- `std` is the crate.
- `os` is a module.
- `unix` is a module inside `os`.
- `fs` is a module inside `unix`
- `MetadataExt` is a [trait](https://doc.rust-lang.org/rust-by-example/trait.html) inside `fs`.

{{< notice info >}}
`pub` declares an item _public_ in Rust, allowing other people who use your crate to access the item in their own code. Without a `pub` statement, the item cannot be accessed externally. See the Rust page on [visibility and privacy](https://doc.rust-lang.org/reference/visibility-and-privacy.html) for more information on `pub`.
{{< /notice >}}

If this were a single file it could look like:

{{< highlighter rust "linenos=table,linenostart=1" lib.rs >}}
pub mod os {
  pub mod unix {
    pub mod fs {
      pub trait MetadataExt {
        // the trait code goes in here
      }
    }
  }
}
{{< /highlighter >}}


Or it could be split over many files:

```
.
└── std
   ├── lib.rs
   ├── os
   │  ├── unix
   │  │  └── fs.rs
   │  └── unix.rs
   └── os.rs
```

with `fs.rs` containing:

{{< highlighter rust "linenos=table,linenostart=1" fs.rs >}}
pub trait MetadataExt {
  // the trait code goes in here
}
{{< /highlighter >}}

What's interesting to note is that `fs.rs` above does not contain a `mod` declaration.

This is because the module `unix` (which is the parent of `fs`), declares `fs` as a module using `mod`. Similarly `os` declares `unix` as a module using `mod`. Looking at the single file example above, you can see the structure needed to create the hirearchy `std::os::unix::fs::MetadataExt` using `mod`.

How this works is explained below.

### module source filenames

In the example above we see that we can write a `mod` statement without declaring a body (the curly brackets `{}`). When you do this and compile your crate, Cargo will look for a `.rs` file in the current directory with the name given after the `mod` declaration.

{{< notice info >}}
You can read the Rust reference documentation for more on using `mod` in this way [here](https://doc.rust-lang.org/reference/items/modules.html#module-source-filenames).
{{< /notice >}}

Imagine we have a new cargo project called `media`. Inside this library we want to write some code to download a file. We decide to separate this out into its own module called `utilities`. We could create a file hirearchy like:

```
.
└── media
   ├── utilities.rs
   └── lib.rs
```

with `lib.rs` containing

{{< highlighter rust "linenos=table,linenostart=1" lib.rs >}}
pub mod utilities;
{{< /highlighter >}}

When you use `mod` in this way and compile, Cargo **brings the contents of `utilities.rs` and inserts it into the current file.**

This means that in `lib.rs` you can use any items you've written in `utilities.rs` as if they were actually written inside a `mod utilities {}` block inside `lib.rs` (as this is what Cargo will do for you when you build your crate).

Let's say we have a public function `download` inside `utilities.rs`.

In `lib.rs` you would refer to this function by `utilities::download()` (or to be more explicit: `self::utilities::download()`).

By declaring `utilities` a module, you have added it to the tree hierarchy of your crate and the function `download` can now be accessed by its path `media::utilities::download` by anyone who installs your crate.

### combining both mod and use

You can, of course, use a `use` statement:

{{< highlighter rust "linenos=table,linenostart=1" lib.rs >}}
pub mod utilities;
use utilities::download;

download("some_url")
{{< /highlighter >}}

which would allow you to simply call `download()` inside `lib.rs`, rather than its full path `utilities::download()`.

Someone who installs your crate could access `download` with the path `media::download`, rather than its full path `media:utilities::download` if you use both a `mod` and `use` statement in this way.

{{< notice note >}}
If you use both a `mod` and a `use` statement to refer to the same path, the order matters. In this example the `use` statement must come after the `mod` statement. If you reverse the order, Rust would not know `utilities.rs` is a module and it would not compile.
{{< /notice >}}

**This is the main difference between `mod` and `use`.** Remember that using `use` simply brings an item into the current namespace so you can access it more easily. Whereas `mod` (without a body block `{}`) literally brings the contents of a file and inserts in its place.

**We cannot replace the `pub mod utilities;` line with a `use` statement**. We have to declare `utilities.rs` as a module so it's added to the crate structure.

Without using `pub mod utilities;` in `lib.rs`, Rust would not know that `utilities.rs` is a module (even if `utilities.rs` contains valid Rust code).

#### path attribute

By default Rust will look at the path relative to the current `.rs` file you are working in. You can change this by using the `path` attribute which will change the path Rust uses to find the `.rs` file you want to use. The Rust reference documentation has some good examples [here](https://doc.rust-lang.org/reference/items/modules.html#the-path-attribute).

### `mod` summary

Using `mod` allows you to group items together in a logical way. You can create `mod` blocks in a single `.rs` file, or you can split your source code out over many `.rs` files, use `mod` and have Cargo be responsible for building the tree structure of your crate.

## summary

Hopefully you have a better understanding of the differences between `use` and `mod` in Rust.

We have looked at both `use` and `mod` and seen how they can be used in a Rust crate you write. In the next article in this series (coming soon), we will look at how we can use `mod` to create a file structure to allow you to create your own libraries in Rust.

If you have any questions, queries or comments, feel free to leave them below.
