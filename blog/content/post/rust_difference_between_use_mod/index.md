---
title: "The difference between mod and use in Rust"
date: 2020-11-01T00:02:52Z
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

There is sometimes some confusion for those new to Rust about the differences between using `mod` and `use` in Rust projects, especially if you are coming from a language such as Python.

We explore the basic differences between them and how to use them in Rust projects comparing with Python to show the differences.

<!--more-->

{{< notice series >}}
Part 1 in the [Creating modules in Rust 🦀 series](/series/creating-modules-in-rust/). Parts 2 and 3 to follow soon.
{{< /notice >}}

If you haven't already you should check [Chapter 7 in the Rust book](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html) on how to manage and create a Rust crate composed of submodules.

## use

Let's begin with the easier to understand, `use`.

{{< notice info >}}
You should check the [Rust by example page](https://doc.rust-lang.org/stable/rust-by-example/mod/use.html) on `use` if you haven't already.
{{< /notice >}}

Using `use` simply brings another _item_ (or _variable_) into the current namespace by following another _path_. An [item](https://doc.rust-lang.org/reference/items.html) is some general _object_ (if coming from Python) such as a function, struct or trait etc. that you need to access. A path is module heirarchy you need to follow to access it (we will see examples later). The current namespace means bringing an item into the current file so you can access it as if it were local.

Let's have a look at what this means.

### standard library

Let's say we want to use the [`spawn()`](https://doc.rust-lang.org/std/thread/fn.spawn.html) function from the `std` library without using `use`. Because `std` is a standard library we don't need to add it to our `cargo.toml` file. In a rust file you can access it by typing:

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
tungstenite = "0.11.1"
{{< /highlighter >}}

For a simple example, we can use the snippet given on the `tungstenite` main page:

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

We can see on the highlighted lines that by using `use` allows us to simply reference the items directly, without having to type out the full path each time.

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

We see that this compiles and runs just fine. No matter if you're using an item from the standard library, an item you've written yourself somewhere in your crate or a third party library you've imported - using `use` simply provides a convenient short way to bring items into the current namespace.

{{< notice tip >}}
Using `use` is entirely **optional**. It does not function like `import` in Python. You can access any item from any path directly, there is no need to explicitly import something if you want to use it.
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

When you use `use` the last item you bring in will be what is bound.

For example when we used

`use std::thread::spawn;`

we access this by using `spawn()`.

If you want to avoid naming conflicts, or wish to rename items, you can use the `as` keyword such as

`use std::thread::spawn as spwn;`

You can then access this with `spwn()`.

This can also be used with the `{}` syntax and `self` keyword:

`use a::b::{self as ab, c as abc};`

#### asterisk wildcard syntax

You can also use the asterisk wildcard syntax to bind all paths matching a given prefix. Let's say `b` is a module that contains two public functions: `download()` and `save()`:

{{< highlighter rust "linenos=table,linenostart=1" main.rs >}}
use a::b::*;

fn main() {
  download();
  save();
}
{{< /highlighter >}}

Using the wildcard syntax means we can bring everything from `b` into the namespace in one go.

{{< notice warning >}}
For obvious reasons you cannot use the `as` keyword with the wildcard glob-like syntax as this wouldn't make sense.
{{< /notice >}}

#### creating a public interface

{{< notice note >}}
Remember that in order to use `use` an item must be declared public with the `pub` keyword.
{{< /notice >}}

Finally one important tip when building modules is that you can use `use` to declare a public inteface for your library/module. For those coming from python this is similar to using an `__init__.py` to declare multiple `import` statements at some top level, which then conveniently brings any deeply nested objects into scope.

Using the Python library [Pandas](https://github.com/pandas-dev/pandas/blob/master/pandas/__init__.py) as an example we can see that the bulk of the library is written in `pandas.core.api`, but when you `import pandas` the `__init__.py` brings all these into scope so you can conveniently access `DataFrame` by doing

{{< highlighter python "linenos=table,linenostart=1" main.py >}}
import pandas as pd

def main():
  df = pd.DataFrame()

if __name__ == "__main__":
  main()
{{< /highlighter >}}

Rather than

{{< highlighter python "linenos=table,linenostart=1" main.py >}}
import pandas.core.api

def main():
  df = pandas.core.api.DataFrame()

if __name__ == "__main__":
  main()
{{< /highlighter >}}

By using `use` and declaring the statement _public_ we can achieve the same thing in Rust:

{{< highlighter rust "linenos=table,linenostart=1" main.rs >}}
mod quux {
    pub use self::foo::{bar, baz};
    pub mod foo {
        pub fn bar() {}
        pub fn baz() {}
    }
}

fn main() {
    quux::bar();
    quux::baz();
}
{{< /highlighter >}}

Although this example isn't using multiple `.rs` files, it is using the `mod` declaration showing how you can nest modules inside other modules.

We can see that the full path to `bar()` is `quux::foo::bar` (and similarly for `baz()`). But we have used `use` in the _parent_ module and declared the statement public meaning we can access `bar()` by doing `quux::bar()`.

Using `use` in this way allows you to create logical structures for your Rust crates/libraries, while providing a nice easy to understand public api for other users (or just for yourself) to use.

After looking at using `mod` in the next section and the rest of the articles in this series which show you how to create file heirarchies for Rust crates you will be able to achieve the same convenient imports you get when using an `__init__.py` file as shown in the `Pandas` example above.

#### `use` summary

In summary, using `use` just allows you to conveniently bring items from other Rust modules (or from other parts of your crate) into the current namespace in the `.rs` file you are working in.

The reason there is no explicit need to import items is because Cargo does a lot of magic behind the scenes. When you `cargo build` your crate, it will dynamically import and bundle up anything you have accessed in your crate so it's accessible in the final binary/library.

Using `use` is just for convenience. **There is no need to use `use` to import anything** in Rust - just access things directly, and use `use` to make things easier and avoid repetition.

{{< notice info >}}
As always the various Rust documentation resources are really well written and you can see more information of everything discussed about `use` in the reference pages [here](https://doc.rust-lang.org/reference/items/use-declarations.html).
{{< /notice >}}

## mod

In Rust a lot of beginners struggle with `mod` and the real difference over `use`. When creating modules and submodules you use `mod` to declare them so you can utilise them in your current `.rs` file which can be confusing. Why not simply use `use`?

In Rust a module is simply a container for zero or more [items](https://doc.rust-lang.org/reference/items.html). It's a way of grouping items together in a logical way so that your module is easy to navigate.

Modules can be used to build up a _tree_ structure of your crate, allowing you to separate your work out over many files arbitrarily deep if needs be.

Modules can be one per `.rs` file, or a single file can contain many modules itself.

### example

Let's look at the standard library for an example. Consider the following path:

`std::os::unix::fs::MetadataExt`

Here `std` is the crate, `os` is a module, `unix` is a module inside `os`, `fs` is a module inside `unix` and `MetadataExt` is a [trait](https://doc.rust-lang.org/rust-by-example/trait.html) inside `fs`.

If this were a single file it could look like (it doesn't but let's pretend it does):

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

Or it could be split over many files (using the newer style in Rust 2018):

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

What's interesting to note is that `fs.rs` above does not contain a `mod` declaration. This is because the parent of `fs.rs`, `unix.rs`, declares `fs` as a module using `mod`. Simiarly, `os.rs` declares `unix` as a module using `mod` and finally there is a `mod` declaration in `lib.rs` which declares `os` as a module.

How this is done is explained below and the following article in this series on how to create a module/library in Rust will show you how to use this to create a module of your own. For now just note that using `mod` simply groups items together, and that this can be either be in one single file or spread across many files.

Both of these layouts using `mod` allow you to use the path `std::os::unix::fs::MetadataExt` to access this trait.

### module source filenames

In the example above the first example shows multiple `mod` declarations in a single file.

You can also use `mod` without declaring a body (without the `{}`). When you do this Rust will look for a `.rs` file in the current directory.

{{< notice info >}}
You can read the Rust reference documentation for more on using `mod` in this way [here](https://doc.rust-lang.org/reference/items/modules.html#module-source-filenames).
{{< /notice >}}

Imagine we have a new cargo project called `myLibrary`. Inside this library we want to write some code to download a file. We decide to separate this out into its own module called `downloader`. We could create a file hirearchy like:

```
.
└── myLibrary
   ├── downloader.rs
   └── lib.rs
```

with `lib.rs` containing

{{< highlighter rust "linenos=table,linenostart=1" lib.rs >}}
pub mod downloader;
{{< /highlighter >}}

{{< notice info >}}
We are using a `lib.rs` file for this example and not `main.rs`. If you follow along your crate will compile but Rust will not create binary for you to run yourself. Part 3 of this series (coming soon) will show you the difference between these two special files in Rust, when to use each one and how they interact with each other.
{{< /notice >}}

Compare this to the first code block in the previous example for the `std` crate. We are not using a module body in a single file, rather we have simply declared `downloader.rs` a module by putting a `mod` declaration in its parent (`lib.rs`).

Importantly, what this does when you use `mod` in this way is it **brings the contents of `downloader.rs` and inserts it into the current file.**

This means that in `lib.rs` you can use any items you've written in `downloader.rs` as if they were actually written inside a `mod downloader {};` block in `lib.rs` (as this is what Cargo will do for you when you build your crate).

Let's say we have a public function `download()` inside `downloader.rs`. In `lib.rs` you would refer to this (and indeed any other item) in `downloader.rs` with the path `downloader::download()` (or to be more explicit: `self::downloader::download()`).

You can, of course, use a `use` statement:

`use downloader::download;`

which would allow you to simply call `download()` inside `lib.rs`, rather than its full path `downloader::download()`.

{{< notice note >}}
If you use both a `mod` and a `use` statement to refer to the same path, the order matters. In this example the `use` statement must come after the `mod` statement. If you reverse the order, Rust would not know `downloader.rs` is a module and it would not compile.
{{< /notice >}}

This behaviour means you can write your code in separate `.rs` files, and declare them as modules using `mod` in some other file which then acts as a parent. When you do a `cargo build`, this parent file will contain all the code neatly wrapped in `mod {}` blocks. This makes it easy to split your source code out and build a heirarchy of files for your crate while mainting a nice and easy way for others to use your library.

**This is the main difference between `mod` and `use`.** Remember that using `use` simply brings an item into the current namespace so you can access it more easily. Whereas `mod` (without a body block `{}`) literally brings the contents of a file and inserts in its place.

**We cannot replace the `pub mod downloader;` line with a `use` statement**. We have to declare `downloader.rs` as a module so it's added to the crate structure.

If we published this to Cargo and someone added `myLibrary` to their `cargo.toml` file, they could then use

`use myLibrary::downloader::download;`

to access the function `download()`.

Without using `pub mod downloader;` in `lib.rs`, Rust would not know that `downloader.rs` is a module (even if `downloader.rs` contains valid Rust code).

#### path attribute

By default Rust will look at the path relative to the current `.rs` file you are working in. You can change this by using the `path` attribute which will change the path Rust uses to find the `.rs` file you want to use. The Rust reference documentation has some good examples [here](https://doc.rust-lang.org/reference/items/modules.html#the-path-attribute).

{{< notice warning >}}
Using the `path` attribute is not the correct way to use `mod` when working with files in nested directories. The next article in this series will show you how to structure and name your `.rs` files in order to create a crate that uses `mod` when working with many files and directories.
{{< /notice >}}

### `mod` summary

Using `mod` allows you to group items together in a logical way. You can create `mod` blocks in a single `.rs` file, or you can split your source code out over many `.rs` files and use `mod` without the body (`{}`) and have Cargo insert the code into the current file you are working with when building the crate.

`mod` is used to create a heirarchy for your crate. If you want to split your work out accross multiple files, using `mod` will allow you put source code in different files, but still being able to use them in the current file as if it were written there. If someone else uses your crate, they can access items directly or they can use `use` to access items you write in Rust.

## summary

We have looked at both `use` and `mod` and seen how they can be used in a Rust crate you write. In the next article in this series, we will look at how we can use `mod` to create a file structure to allow you to create your own libraries in Rust.

If you have any questions, queries or comments, leave them below.
