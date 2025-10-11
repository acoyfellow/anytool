---
title: boto3 · Cloudflare R2 docs
description: You must generate an Access Key before getting started. All
  examples will utilize access_key_id and access_key_secret variables which
  represent the Access Key ID and Secret Access Key values you generated.
lastUpdated: 2025-08-20T18:25:25.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/examples/aws/boto3/
  md: https://developers.cloudflare.com/r2/examples/aws/boto3/index.md
---

You must [generate an Access Key](https://developers.cloudflare.com/r2/api/tokens/) before getting started. All examples will utilize `access_key_id` and `access_key_secret` variables which represent the **Access Key ID** and **Secret Access Key** values you generated.



You must configure [`boto3`](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) to use a preconstructed `endpoint_url` value. This can be done through any `boto3` usage that accepts connection arguments; for example:

```python
import boto3


s3 = boto3.resource('s3',
  endpoint_url = 'https://<accountid>.r2.cloudflarestorage.com',
  aws_access_key_id = '<access_key_id>',
  aws_secret_access_key = '<access_key_secret>'
)
```

You may, however, omit the `aws_access_key_id` and `aws_secret_access_key `arguments and allow `boto3` to rely on the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` [environment variables](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#using-environment-variables) instead.

An example script may look like the following:

```python
import boto3


s3 = boto3.client(
    service_name ="s3",
    endpoint_url = 'https://<accountid>.r2.cloudflarestorage.com',
    aws_access_key_id = '<access_key_id>',
    aws_secret_access_key = '<access_key_secret>',
    region_name="<location>", # Must be one of: wnam, enam, weur, eeur, apac, auto
)


# Get object information
object_information = s3.head_object(Bucket=<R2_BUCKET_NAME>, Key=<FILE_KEY_NAME>)


# Upload/Update single file
s3.upload_fileobj(io.BytesIO(file_content), <R2_BUCKET_NAME>, <FILE_KEY_NAME>)


# Delete object
s3.delete_object(Bucket=<R2_BUCKET_NAME>, Key=<FILE_KEY_NAME>)
```

```sh
python main.py
```

```sh
Buckets:
 -  user-uploads
 -  my-bucket-name
Objects:
 -  cat.png
 -  todos.txt
```
