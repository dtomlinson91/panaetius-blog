# Seperate bundles for different sections

## Example

- Webpack configs - <https://github.com/dtomlinson91/panaetius-theme/tree/develop/webpack>

## Documentation

You can have multiple bundles - this is useful if you want to only run some code or import some vendor on a specific section.

An example is using the `bootstrap-toc` library on `posts` pages only in a blog. This code does not need to be ran anywhere else, we can use a sperate bundle for this.

### Webpack configs

Create seperate webpack configs for each bundle. Have a global prod bundle for sitewide and a folder with a new prod bundle.
