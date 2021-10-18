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




{{< notice warning >}}
Using the `path` attribute is not the correct way to use `mod` when working with files in nested directories. The next article in this series will show you how to structure and name your `.rs` files in order to create a crate that uses `mod` when working with many files and directories.
{{< /notice >}}
