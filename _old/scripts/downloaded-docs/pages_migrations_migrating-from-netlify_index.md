---
title: Migrating from Netlify to Pages · Cloudflare Pages docs
description: In this tutorial, you will learn how to migrate your Netlify
  application to Cloudflare Pages.
lastUpdated: 2025-09-17T11:00:27.000Z
chatbotDeprioritize: true
tags: JavaScript
source_url:
  html: https://developers.cloudflare.com/pages/migrations/migrating-from-netlify/
  md: https://developers.cloudflare.com/pages/migrations/migrating-from-netlify/index.md
---

In this tutorial, you will learn how to migrate your Netlify application to Cloudflare Pages.

## Finding your build command and build directory

To move your application to Cloudflare Pages, find your build command and build directory. Cloudflare Pages will use this information to build and deploy your application.

In your Netlify Dashboard, find the project that you want to deploy. It should be configured to deploy from a GitHub repository.

![Selecting a site in the Netlify Dashboard](https://developers.cloudflare.com/_astro/netlify-deploy-1.By04eemW_1Vp1dR.webp)

Inside of your site dashboard, select **Site Settings**, and then **Build & Deploy**.

![Selecting Site Settings in site dashboard](https://developers.cloudflare.com/_astro/netlify-deploy-2.DmmuPQSt_8gv3b.webp) ![Selecting Build and Deploy in sidebar](https://developers.cloudflare.com/_astro/netlify-deploy-3.BKXJ0OTu_1etMse.webp)

In the **Build & Deploy** tab, find the **Build settings** panel, which will have the **Build command** and **Publish directory** fields. Save these for deploying to Cloudflare Pages. In the below image, **Build command** is `yarn build`, and **Publish directory** is `build/`.

![Finding the Build command and Publish directory fields](https://developers.cloudflare.com/_astro/netlify-deploy-4.DDil9MXJ_1TVELz.webp)

## Migrating redirects and headers

If your site includes a `_redirects` file in your publish directory, you can use the same file in Cloudflare Pages and your redirects will execute successfully. If your redirects are in your `netlify.toml` file, you will need to add them to the `_redirects` folder. Cloudflare Pages currently offers limited [supports for advanced redirects](https://developers.cloudflare.com/pages/configuration/redirects/). In the case where you have over 2000 static and/or 100 dynamic redirects rules, it is recommended to use [Bulk Redirects](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-dashboard/).

Your header files can also be moved into a `_headers` folder in your publish directory. It is important to note that custom headers defined in the `_headers` file are not currently applied to responses from functions, even if the function route matches the URL pattern. To learn more about how to [handle headers, refer to Headers](https://developers.cloudflare.com/pages/configuration/headers/).

Note

Redirects execute before headers. In the case of a request matching rules in both files, the redirect will take precedence.

## Forms

In your form component, remove the `data-netlify = "true"` attribute or the Netlify attribute from the `<form>` tag. You can now put your form logic as a Pages Function and collect the entries to a database or an Airtable. Refer to the [handling form submissions with Pages Functions](https://developers.cloudflare.com/pages/tutorials/forms/) tutorial for more information.

## Serverless functions

Netlify functions and Pages Functions share the same filesystem convention using a `functions` directory in the base of your project to handle your serverless functions. However, the syntax and how the functions are deployed differs. Pages Functions run on Cloudflare Workers, which by default operate on the Cloudflare global network, and do not require any additional code or configuration for deployment.

Cloudflare Pages Functions also provides middleware that can handle any logic you need to run before and/or after your function route handler.

### Functions syntax

Netlify functions export an async event handler that accepts an event and a context as arguments. In the case of Pages Functions, you will have to export a single `onRequest` function that accepts a `context` object. The `context` object contains all the information for the request such as `request`, `env`, `params`, and returns a new Response. Learn more about [writing your first function](https://developers.cloudflare.com/pages/functions/get-started/)

Hello World with Netlify functions:

```js
exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};
```

Hello World with Pages Functions:

```js
export async function onRequestPost(request) {
  return new Response(`Hello world`);
}
```

## Other Netlify configurations

Your `netlify.toml` file might have other configurations that are supported by Pages, such as, preview deployment, specifying publish directory, and plugins. You can delete the file after migrating your configurations.

## Access management

You can migrate your access management to [Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/) which allows you to manage user authentication for your applications, event logging and requests.

## Creating a new Pages project

Once you have found your build directory and build command, you can move your project to Cloudflare Pages.

The [Get started guide](https://developers.cloudflare.com/pages/get-started/) will instruct you how to add your GitHub project to Cloudflare Pages.

If you choose to use a custom domain for your Pages, you can set it to the same custom domain as your currently deployed Netlify application. To assign a custom domain to your Pages project, refer to [Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Cleaning up your old application and assigning the domain

In the Cloudflare dashboard, go to the **DNS Records** page.

[Go to **Records**](https://dash.cloudflare.com/?to=/:account/:zone/dns/records)

Review that you have updated the CNAME record for your domain from Netlify to Cloudflare Pages. With your DNS record updated, requests will go to your Pages application.

In **DNS**, your record's **Content** should be your `<SUBDOMAIN>.pages.dev` subdomain.

With the above steps completed, you have successfully migrated your Netlify project to Cloudflare Pages.
