---
title: Authentication · Cloudflare R2 docs
description: You can generate an API token to serve as the Access Key for usage
  with existing S3-compatible SDKs or XML APIs.
lastUpdated: 2025-09-15T10:59:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/api/tokens/
  md: https://developers.cloudflare.com/r2/api/tokens/index.md
---

You can generate an API token to serve as the Access Key for usage with existing S3-compatible SDKs or XML APIs.

Note

This page contains instructions on generating API tokens *specifically* for R2. Note that this is different from generating API tokens for other services, as documented in [Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

You must purchase R2 before you can generate an API token.

To create an API token:

1. In the Cloudflare dashboard, go to the **R2 object storage** page.

   [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

2. Select **Manage API tokens**.

3. Choose to create either:

   * **Create Account API token** - These tokens are tied to the Cloudflare account itself and can be used by any authorized system or user. Only users with the Super Administrator role can view or create them. These tokens remain valid until manually revoked.
   * **Create User API token** - These tokens are tied to your individual Cloudflare user. They inherit your personal permissions and become inactive if your user is removed from the account.

4. Under **Permissions**, choose a permission types for your token. Refer to [Permissions](#permissions) for information about each option.

5. (Optional) If you select the **Object Read and Write** or **Object Read** permissions, you can scope your token to a set of buckets.

6. Select **Create Account API token** or **Create User API token**.

After your token has been successfully created, review your **Secret Access Key** and **Access Key ID** values. These may often be referred to as Client Secret and Client ID, respectively.

Warning

You will not be able to access your **Secret Access Key** again after this step. Copy and record both values to avoid losing them.

You will also need to configure the `endpoint` in your S3 client to `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.

Find your [account ID in the Cloudflare dashboard](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/).

Buckets created with jurisdictions must be accessed via jurisdiction-specific endpoints:

* European Union (EU): `https://<ACCOUNT_ID>.eu.r2.cloudflarestorage.com`
* FedRAMP: `https://<ACCOUNT_ID>.fedramp.r2.cloudflarestorage.com`

Warning

Jurisdictional buckets can only be accessed via the corresponding jurisdictional endpoint. Most S3 clients will not let you configure multiple `endpoints`, so you'll generally have to initialize one client per jurisdiction.

## Permissions

| Permission | Description |
| - | - |
| Admin Read & Write | Allows the ability to create, list, and delete buckets, edit bucket configuration, read, write, and list objects, and read and write to data catalog tables and associated metadata. |
| Admin Read only | Allows the ability to list buckets and view bucket configuration, read and list objects, and read from the data catalog tables and associated metadata. |
| Object Read & Write | Allows the ability to read, write, and list objects in specific buckets. |
| Object Read only | Allows the ability to read and list objects in specific buckets. |

Note

Currently **Admin Read & Write** or **Admin Read only** permission is required to use [R2 Data Catalog](https://developers.cloudflare.com/r2/data-catalog/).

## Create API tokens via API

You can create API tokens via the API and use them to generate corresponding Access Key ID and Secret Access Key values. To get started, refer to [Create API tokens via the API](https://developers.cloudflare.com/fundamentals/api/how-to/create-via-api/). Below are the specifics for R2.

### Access Policy

An Access Policy specifies what resources the token can access and the permissions it has.

#### Resources

There are two relevant resource types for R2: `Account` and `Bucket`. For more information on the Account resource type, refer to [Account](https://developers.cloudflare.com/fundamentals/api/how-to/create-via-api/#account).

##### Bucket

Include a set of R2 buckets or all buckets in an account.

A specific bucket is represented as:

```json
"com.cloudflare.edge.r2.bucket.<ACCOUNT_ID>_<JURISDICTION>_<BUCKET_NAME>": "*"
```

* `ACCOUNT_ID`: Refer to [Find zone and account IDs](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/#find-account-id-workers-and-pages).
* `JURISDICTION`: The [jurisdiction](https://developers.cloudflare.com/r2/reference/data-location/#available-jurisdictions) where the R2 bucket lives. For buckets not created in a specific jurisdiction this value will be `default`.
* `BUCKET_NAME`: The name of the bucket your Access Policy applies to.

All buckets in an account are represented as:

```json
"com.cloudflare.api.account.<ACCOUNT_ID>": {
  "com.cloudflare.edge.r2.bucket.*": "*"
}
```

* `ACCOUNT_ID`: Refer to [Find zone and account IDs](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/#find-account-id-workers-and-pages).

#### Permission groups

Determine what [permission groups](https://developers.cloudflare.com/fundamentals/api/how-to/create-via-api/#permission-groups) should be applied.

| Permission group | Resource | Description |
| - | - | - |
| `Workers R2 Storage Write` | Account | Can create, delete, and list buckets, edit bucket configuration, and read, write, and list objects. |
| `Workers R2 Storage Read` | Account | Can list buckets and view bucket configuration, and read and list objects. |
| `Workers R2 Storage Bucket Item Write` | Bucket | Can read, write, and list objects in buckets. |
| `Workers R2 Storage Bucket Item Read` | Bucket | Can read and list objects in buckets. |
| `Workers R2 Data Catalog Write` | Account | Can read from and write to data catalogs. This permission allows access to the Iceberg REST catalog interface. |
| `Workers R2 Data Catalog Read` | Account | Can read from data catalogs. This permission allows read-only access to the Iceberg REST catalog interface. |

#### Example Access Policy

```json
[
  {
    "id": "f267e341f3dd4697bd3b9f71dd96247f",
    "effect": "allow",
    "resources": {
      "com.cloudflare.edge.r2.bucket.4793d734c0b8e484dfc37ec392b5fa8a_default_my-bucket": "*",
      "com.cloudflare.edge.r2.bucket.4793d734c0b8e484dfc37ec392b5fa8a_eu_my-eu-bucket": "*"
    },
    "permission_groups": [
      {
        "id": "6a018a9f2fc74eb6b293b0c548f38b39",
        "name": "Workers R2 Storage Bucket Item Read"
      }
    ]
  }
]
```

### Get S3 API credentials from an API token

You can get the Access Key ID and Secret Access Key values from the response of the [Create Token](https://developers.cloudflare.com/api/resources/user/subresources/tokens/methods/create/) API:

* Access Key ID: The `id` of the API token.
* Secret Access Key: The SHA-256 hash of the API token `value`.

Refer to [Authenticate against R2 API using auth tokens](https://developers.cloudflare.com/r2/examples/authenticate-r2-auth-tokens/) for a tutorial with JavaScript, Python, and Go examples.

## Temporary access credentials

If you need to create temporary credentials for a bucket or a prefix/object within a bucket, you can use the [temp-access-credentials endpoint](https://developers.cloudflare.com/api/resources/r2/subresources/temporary_credentials/methods/create/) in the API. You will need an existing R2 token to pass in as the parent access key id. You can use the credentials from the API result for an S3-compatible request by setting the credential variables like so:

```plaintext
AWS_ACCESS_KEY_ID = <accessKeyId>
AWS_SECRET_ACCESS_KEY = <secretAccessKey>
AWS_SESSION_TOKEN = <sessionToken>
```

Note

The temporary access key cannot have a permission that is higher than the parent access key. e.g. if the parent key is set to `Object Read Write`, the temporary access key could only have `Object Read Write` or `Object Read Only` permissions.
