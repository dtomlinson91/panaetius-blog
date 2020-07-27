
To create a website

Create a route53 hosted zone
Change nameservers in the registrar to point at the aws ones

In certificate manager request a certificate for the domain. Use the basename and a wildcard in the same cert. (panaetius.io and *.panaetius.io)

Use the cloudfront_s3_cdn TF module with aliases - this will create the A and AAAA records in route53 to point at cloudfront.



When creating an IAM role in terraform, the `assume_role_policy` defines the trust relationship. It is not a policy attachment - it defines what resources should be allowed to assume the role itself.
To attach policies you should create a policy and policy attachment seperately.


CF Lambda@Edge only need the lambda_function_association setting on the CF instance for the default origin.
If you needed to run Lambda@Edge against different files in the origin (say only on image files), you would create a ordered_cache and then specify exactly what you wanted to run it against. You can specify only certain methods, only forward certain header values etc.

If you need to check the logs, check Cloudfront in the region that is closest to you (not in the region where you created the lambda).


Favicon generator:
<https://realfavicongenerator.net>


HTML Checker:
docker run -v /Users/dtomlinson/git-repos/web-dev/hugo/blog/blog/public/:/mounted-site mtlynch/htmlproofer /mounted-site --url-swap "https?\:\/\/(panaetius.io):"

We are using `--url-swap` to replace the site's URL with a blank string. This forces HTMLProofer to check for the existance of the file, rather than make a HTTPS call to see if it's live.




Main.tf

The provider aws should set the version
Should also set the aws profile to use

Try with a main.tf in the root that sets the provider, and have the rest of it in a ./terraform directory

Tagging should use the label module for tags only

Cloudposse modules should append ?ref=tags/0.4.0 onto the end of any .git links.
Should add git:: before the link as well



Adding a domain

- Create a hosted zone in route53, change the nameservers to the aws ones if you want aws to handle dns
- Create an SSL for the domain in ACM.

Run `gmake plan` to see the plan of what terraform will deploy
