---
title: "The difference between mod and use in Rust"
date: 2020-11-01T17:46:54Z
images:
  - "images/banner.svg"
authors:
  - "Daniel Tomlinson"
tags:
  - "rust"
  - "coding"
draft: true
---

There is sometimes some confusion for those new to Rust about the differences between using `mod` and `use` in Rust projects, especially if you are coming from a language such as Python.

We explore the basic differences between them and how to use them in Rust projects comparing with Python to show the differences.

<!--more-->

{{< notice info >}}
If you haven't already you should check [Chapter 7 in the Rust book](https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html) on how to manage and create a Rust project composed of submodules.
{{< /notice >}}

# use

Let's begin with the easier to understand, `use`.

{{< notice info >}}
You should check the [Rust by example page](https://doc.rust-lang.org/stable/rust-by-example/mod/use.html) on `use` if you haven't already.
{{< /notice >}}

Using `use` simply brings another _item_ (or _variable_) into the current namespace by following another _path_. An [item](https://doc.rust-lang.org/reference/items.html) is some general _object_ (if coming from Python) such as a function, struct or trait etc. that you need to access. A path is module heirarchy you need to follow to access it (we will see examples later). The current namespace means bringing an item into the current file so you can access it as if it were local.

Let's have a look at what this means.

## standard library

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

In this example we have brought `std::thread::spawn` into the current namespace. It can now be accessed with just `spawn`.

Simple enough, we can see that using `use` for items in the standard library can make things less repetitive, and more concise.

## external crates

What about external crates? Let's look at using [`tungstenite`](https://crates.io/crates/tungstenite) - a WebSocket inplementation for Rust.

As usual for any external crates we need to add the dependency to our `cargo.toml` file:

{{< highlighter toml "linenos=table,linenostart=1" cargo.toml >}}
tungstenite = "0.11.1"
{{< /highlighter >}}

For an simple example, we can use the snippet given on the `tungstenite` main page:

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

## additional information

Rust has a very dynamic system in place for `use` that makes it easy to bring multiple items into the current namespace without too much effort.

### `{}` glob-like syntax

If you want to bring multiple items into the current namespace with `use` you can use `{}` glob-like syntax:

`use std::path::{self, Path, PathBuf};`

You can also chain them, such as:

`use a::b::{c, d, e::f, g::h::i};`

### `self` keyword

You can use the `self` keyword, allowing you to bring the common parent module into the namespace as well as any items you want to access:

{{< highlighter rust "linenos=table,linenostart=1" main.rs >}}
use std::collections::hash_map::{self, HashMap};

fn main() {
    // Both `hash_map` and `HashMap` are in scope.
    let map1 = HashMap::new();
    let map2 = hash_map::HashMap::new();
}
{{< /highlighter >}}

### `as` keyword

When you use `use` the last item you bring in will be what is bound.

For example when we used

`use std::thread::spawn;`

we access this by using `spawn()`.

If you want to avoid naming conflicts, or wish to rename items, you can use the `as` keyword such as

`use std::thread::spawn as spwn;`

You can then access this with `spwn()`.

This can also be used with the `{}` syntax and `self` keyword:

`use a::b::{self as ab, c as abc};`

### asterisk wildcard syntax

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

### creating a public interface

Finally one important tip when building modules is that you can use `use` to declare a public inteface for your library/module. For those coming from python this is similar to using an `__init__.py` to declare multiple `import` statements at some top level, which then conveniently brings any deeply nested objects into scope.

Using the Python library [Pandas](https://github.com/pandas-dev/pandas/blob/master/pandas/__init__.py) as an example we can see that the bulk of the library is written in `pandas.core.api`, but by importing `pandas` the `__init__.py` brings all these into scope so you can access `DataFrame` by doing

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

Although this example isn't using multiple `.rs` files, it is using the `mod` declaration showing how you can nest modules inside other modules. After looking at using `mod` in the next section and the rest of the articles in this series which show you how to create file heirarchies for Rust projects you will be able to achieve the same convenient imports you get when using an `__init__.py` file.

### summary

In summary, using `use` just allows you to conveniently bring items from other Rust modules into the current namespace in the `.rs` file you are working in.

{{< notice tip >}}
Using `use` is entirely **optional**. It does not function like `import` in Python. You can access any item from any path directly, there is no need to explicitly import something if you want to use it.
{{< /notice >}}

This is because Cargo does a lot of magic behind the scenes. When you `cargo build` your project, it will dynamically import and bundle up anything you have accessed in your project. Using `use` is just for convenience. **There is no need to use `use` to import anything** in Rust - just access things directly, and use `use` to make things easier and avoid repetition.

{{< notice info >}}
As always the various Rust documentation resources are really well written and you can see more information of everything discussed here in the reference pages [here](https://doc.rust-lang.org/reference/items/use-declarations.html).
{{< /notice >}}
