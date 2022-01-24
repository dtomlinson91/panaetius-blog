---
title: "Download Directory From a Google Cloud Storage Bucket in Python"
date: 2022-01-23T05:54:12Z
images:
  - "images/banner.png"
authors:
  - "Daniel Tomlinson"
tags:
  - "python"
  - "gcp"
  - "gcs"
  - "snippet"
banner: false
---

Download a directory/folder in a Google Cloud Storage bucket using the Python SDK.

<!--more-->

## snippet

{{< highlighter python "linenos=table" main.py >}}
import pathlib

from google.cloud import storage

def download_data_from_bucket(
  bucket_name: str, directory_in_bucket: str
):
    storage_client = storage.Client()
    blobs_in_bucket = storage_client.list_blobs(
      bucket_name, prefix=directory_in_bucket
    )
    for blob in blobs_in_bucket:
        local_filename = (
          pathlib.Path("/some/local/path") / blob.name.split("/")[-1]
        ).resolve()
        blob.download_to_filename(filename=str(local_filename))
{{< /highlighter >}}

- `bucket_name` should be the name of the bucket **without** the `gs://` prefix.
- `directory_in_bucket` should be the path of the directory in the bucket.

### pypi requirements
- `google-cloud-storage`
