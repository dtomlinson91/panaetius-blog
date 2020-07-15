# Terraform

## Structure

The following should go in the root of your project - this is for the LS VSCode which needs the terraform in the root of the project.

Place the `Makefile` in the root of this folder.

Create a `Makefile.env` file

Create a `./variables` folder and create `.tfvars` files in here with the naming convention `stage-environment.tfvars` e.g `prod-us-east-2.tfvars`.

You can then create a `main.tf`, `outputs.tf` and `variables.tf` file in the root of your folder.

## Makefile

Using the makefile from <https://github.com/pgporada/terraform-makefile>.

`wget https://raw.githubusercontent.com/pgporada/terraform-makefile/master/Makefile`.

Current version has a pull request pending that fixes a dynamo db issue:

`wget https://raw.githubusercontent.com/geftactics/terraform-makefile/geftactics-dynamodb-check/Makefile`.

- Add `-include Makefile.env` after the `.PHONY` entry to the `Makefile`.
- Change the `S3_BUCKET` and `DYNAMODB_TABLE` to:

```env
S3_BUCKET="$(ENV)-$(REGION)-$(PROJECT)-terraform"
DYNAMODB_TABLE="$(ENV)-$(REGION)-$(PROJECT)-terraform"
```

In the `Makefile.env` add the environment variables needed for the `Makfile`:

```env
ENV="prod"
REGION="eu-west-1"
PROJECT="panaetius-blog"
AWS_PROFILE="admin"
```

### Options

```text
$ make
apply                          Have terraform do the things. This will cost money.
destroy-backend                Destroy S3 bucket and DynamoDB table
destroy                        Destroy the things
destroy-target                 Destroy a specific resource. Caution though, this destroys chained resources.
plan-destroy                   Creates a destruction plan.
plan                           Show what terraform thinks it will do
plan-target                    Shows what a plan looks like for applying a specific resource
prep                           Prepare a new workspace (environment) if needed, configure the tfstate backend, update any modules, and switch to the workspace
```

## Commands

### New project

`gmake prep` - this will create an S3 bucket for tfstate and a DynamoDB table for the lock state.
