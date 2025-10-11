---
title: Edit Email Workers · Cloudflare Email Routing docs
description: Adding or editing Email Workers is straightforward. You can rename,
  delete or edit Email Workers, as well as change the routes bound to a specific
  Email Worker.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/email-routing/email-workers/edit-email-workers/
  md: https://developers.cloudflare.com/email-routing/email-workers/edit-email-workers/index.md
---

Adding or editing Email Workers is straightforward. You can rename, delete or edit Email Workers, as well as change the routes bound to a specific Email Worker.

## Add an Email worker

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.

2. Go to **Email** > **Email Routing** > **Email Workers**.

3. Select **Create**.

1) (Optional) Enter a descriptive Email Worker name in **Create a worker name**.

2) In **Select a starter**, select the starter template that best suits your needs. You can also start from scratch and build your own Email Worker with **Create my own**. After choosing your template, select **Create**.

3) Now, configure your code on the left side of the screen. For example, if you are creating an Email Worker from the Allowlist template:

   1. In `const allow = ["friend@example.com", "coworker@example.com"];` replace the email examples with the addresses you want to allow emails from.
   2. In `await message.forward("inbox@corp");` replace the email address example with the address where emails should be forwarded to.

4) (Optional) You can test your logic on the right side of the screen. In the **From** field, enter either an email address from your approved senders list or one that is not on the approved list. When you select **Trigger email event** you should see a message telling you if the email address is allowed or rejected.

5) Select **Save and deploy** to save your Email Worker when you are finished.

6) Select the arrow next to the name of your Email Worker to go back to the main screen.

7) Find the Email Worker you have just created, and select **Create route**. This binds the Email Worker to a route (or email address) you can share. All emails received in this route will be forwarded to and processed by the Email Worker.

Note

You have to create a new route to use with the Email Worker you created. You can have more than one route bound to the same Email Worker.

1. Select **Save** to finish setting up your Email Worker.

You have successfully created your Email Worker. In the Email Worker’s card, select the **route** field to expand it and check the routes associated with the Worker.

## Edit an Email Worker

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.

2. Go to **Email** > **Email Routing** > **Email Workers**.

3. Find the Email Worker you want to rename, and select the three-dot button next to it.

4. Select **Code editor**.

5. Make the appropriate changes to your code.

6. Select **Save and deploy** when you are finished editing.

## Rename Email Worker

When you rename an Email Worker, you will lose the route that was previously bound to it. You will need to configure the route again after renaming the Email Worker.

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.

2. Go to **Email** > **Email Routing** > **Email workers**.

3. Find the Email Worker you want to rename, and select the three-dot button next to it.

4. From the drop-down menu, select **Manage Worker**.

5. Select **Manage Service** > **Rename service**, and fill in the new Email Worker’s name.

6. Select **Continue** > **Move**.

7. Acknowledge the warning and select **Finish**.

8. Now, go back to **Email** > **Email Routing**.

9. In **Routes** find the custom address you previously had associated with your Email Worker, and select **Edit**.

10. In the **Destination** drop-down menu, select your renamed Email Worker.

11. Select **Save**.

## Edit route

The following steps show how to change a route associated with an Email Worker.

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.

2. Go to **Email** > **Email Routing** > **Email workers**.

3. Find the Email Worker you want to change the associated route, and select **route** on its card.

4. Select **Edit** to make the required changes.

5. Select **Save** to finish.

## Delete an Email Worker

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.

2. Go to **Email** > **Email Routing** > **Email workers**.

3. Find the Email Worker you want to delete, and select the three-dot button next to it.

4. From the drop-down menu, select **Manage Worker**.

5. Select **Manage Service** > **Delete**.

6. Type the name of the Email Worker to confirm you want to delete it, and select **Delete**.
