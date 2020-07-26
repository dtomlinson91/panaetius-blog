# CircleCI

- `git clone https://git.panaetius.co.uk/hugo/blog`
- `cd blog`
- `git submodule init`
- `git submodule update --remote`
- `cd blog`
- `yarn`
- `cd themes/panaetius-theme`
- `yarn`
- `cd ../..`

Save output
New job with hugo orb
build with gulp
Copy to s3

Seperate job to checkout

- needs git lfs
- use cache on the lfs folder: <https://www.develer.com/en/avoiding-git-lfs-bandiwdth-waste-with-github-and-circleci/>

aws s3 sync . s3://prod-panaetius-blog-static-assets/ --exclude "_" --include "_.png" --exclude "_node_modules/_" --exclude "_resources/_" --profile admin

## Jobs

CircleCI config reference (shows all commands/options): <https://circleci.com/docs/2.0/configuration-reference/>

Default folder is `/home/circleci/project`. If you do a checkout before this, it will place you in this folder which will contain your repo (i.e it will do a `git clone` then rename the folder to `project` and go into it.)

If you are not using an orb's executor, and you are defining your own, you can change this path in your job using `working_directory` as a key-value to your job name: <https://circleci.com/docs/2.0/configuration-reference/#job_name>

## Orbs

Orb registry: <https://circleci.com/orbs/registry/>.

Orbs give you access to special commands. E.g the `node` orb has commands built in to install node/yarn, and to automatically cache when you do an install of your packages.

Orbs can also come with executors pre-configured. The `node` orb comes with a `node` docker executor bundled, so you don't need to worry about choosing the write docker image you can use the executor provided by the orb and pass in any additional paramters if you need to choose the version.

## Docker images

CircleCI convenience docker images: <https://circleci.com/docs/2.0/circleci-images/#python>.

CircleCI application docker images: <https://github.com/cibuilds>.

Repo for language docker images: <https://github.com/CircleCI-Public/circleci-dockerfiles>.
