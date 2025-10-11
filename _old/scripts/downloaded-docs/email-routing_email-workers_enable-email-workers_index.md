---
title: Enable Email Workers · Cloudflare Email Routing docs
description: Follow these steps to enable and add your first Email Worker. If
  you have never used Cloudflare Workers before, Cloudflare will create a
  subdomain for you, and assign you to the Workers free pricing plan.
lastUpdated: 2025-08-20T21:45:15.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/email-routing/email-workers/enable-email-workers/
  md: https://developers.cloudflare.com/email-routing/email-workers/enable-email-workers/index.md
---

Follow these steps to enable and add your first Email Worker. If you have never used Cloudflare Workers before, Cloudflare will create a subdomain for you, and assign you to the Workers [free pricing plan](https://developers.cloudflare.com/workers/platform/pricing/).

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.

2. Go to **Email** > **Email Routing** > **Email Workers**.

3. Select **Get started**.

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
