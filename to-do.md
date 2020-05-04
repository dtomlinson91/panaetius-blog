# To do

- Add images to posts + homepage and document where they go.

## Questions

Can we edit files in a submodule and commit them to the parent git repo?
No, doing this will send a pull request to merge the changes.

Instead use `git clone` and commit the repo to your main repo. Then if you need to pull the remote repo in the future you can go into it and pull, and handle any conflicts manually.
