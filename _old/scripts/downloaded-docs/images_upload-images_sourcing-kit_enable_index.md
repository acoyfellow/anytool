---
title: Enable Sourcing Kit · Cloudflare Images docs
description: Enabling Sourcing Kit will set it up with the necessary information
  to start importing images from your Amazon S3 account.
lastUpdated: 2025-09-05T07:54:14.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/images/upload-images/sourcing-kit/enable/
  md: https://developers.cloudflare.com/images/upload-images/sourcing-kit/enable/index.md
---

Enabling Sourcing Kit will set it up with the necessary information to start importing images from your Amazon S3 account.

## Create your first import job

1. In the Cloudflare dashboard, go to the **Sourcing Kit** page.

   [Go to **Sourcing kit**](https://dash.cloudflare.com/?to=/:account/images/sourcing-kit)

2. Select **Import images** to create an import job.

3. In **Source name** give your source an appropriate name.

4. In **Amazon S3 bucket information** enter the S3's bucket name where your images are stored.

5. In **Required credentials**, enter your Amazon S3 credentials. This is required to connect Cloudflare Images to your source and import your images. Refer to [Credentials](https://developers.cloudflare.com/images/upload-images/sourcing-kit/credentials/) to learn more about how to set up credentials.

6. Select **Next**.

7. In **Basic rules** define the Amazon S3 path to import your images from, and the path you want to copy your images to in your Cloudflare Images account. This is optional, and you can leave these fields blank.

8. On the same page, in **Overwrite images**, you need to choose what happens when the files in your source change. The recommended action is to copy the new images and overwrite the old ones on your Cloudflare Images account. You can also choose to skip the import, and keep what you already have on your Cloudflare Images account.

9. Select **Next**.

10. Review and confirm the information regarding the import job you created. Select **Import images** to start importing images from your source.

Your import job is now created. You can review the job status on the Sourcing Kit main page. It will show you information such as how many objects it found, how many images were imported, and any errors that might have occurred.

Note

Sourcing Kit will warn you when you are about to reach the limit for your plan space quota. When you exhaust the space available in your plan, the importing jobs will be aborted. If you see this warning on Sourcing Kit’s main page, select **View plan** to change your plan’s limits.

## Define a new source

1. In the Cloudflare dashboard, go to the **Source Kit** page.

   [Go to **Sourcing kit**](https://dash.cloudflare.com/?to=/:account/images/sourcing-kit)

2. Select **Import images** > **Define a new source**.

Repeat steps 4-11 in [Create your first import job](#create-your-first-import-job) to finish setting up your new source.

## Define additional import jobs

You can have many import jobs from the same or different sources. If you select an existing source to create a new import job, you will not need to enter your credentials again.

1. In the Cloudflare dashboard, go to the **Sourcing Kit** page.

   [Go to **Sourcing kit**](https://dash.cloudflare.com/?to=/:account/images/sourcing-kit)

2. Select **Import images**.

3. Choose from one of the sources already configured.

Repeat steps 8-11 in [Create your first import job](#create-your-first-import-job) to finish setting up your new import job.

## Next steps

Refer to [Edit source details](https://developers.cloudflare.com/images/upload-images/sourcing-kit/edit/) to learn more about editing details for import jobs you have already created, or to learn how to abort running import jobs.
