---
title: Hono · Cloudflare Pages docs
description: Hono is a small, simple, and ultrafast web framework for Cloudflare
  Pages and Workers, Deno, and Bun. Learn more about the creation of Hono by
  watching an interview with its creator, Yusuke Wada.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
tags: Hono
source_url:
  html: https://developers.cloudflare.com/pages/framework-guides/deploy-a-hono-site/
  md: https://developers.cloudflare.com/pages/framework-guides/deploy-a-hono-site/index.md
---

[Hono](https://honojs.dev/) is a small, simple, and ultrafast web framework for Cloudflare Pages and Workers, Deno, and Bun. Learn more about the creation of Hono by [watching an interview](#creator-interview) with its creator, [Yusuke Wada](https://yusu.ke/).

In this guide, you will create a new Hono application and deploy it using Cloudflare Pages.

## Create a new project

Use the [`create-cloudflare`](https://www.npmjs.com/package/create-cloudflare) CLI (C3) to create a new project. C3 will create a new project directory, initiate Hono's official setup tool, and provide the option to deploy instantly.

To use `create-cloudflare` to create a new Hono project, run the following command:

* npm

  ```sh
  npm create cloudflare@latest -- my-hono-app --framework=hono --platform=pages
  ```

* yarn

  ```sh
  yarn create cloudflare my-hono-app --framework=hono --platform=pages
  ```

* pnpm

  ```sh
  pnpm create cloudflare@latest my-hono-app --framework=hono --platform=pages
  ```

In your new Hono project, you will find a `public/static` directory for your static files, and a `src/index.ts` file which is the entrypoint for your server-side code.

## Run in local dev

Develop your app locally by running:

* npm

  ```sh
  npm run dev
  ```

* yarn

  ```sh
  yarn run dev
  ```

* pnpm

  ```sh
  pnpm run dev
  ```

You should be able to review your generated web application at `http://localhost:8788`.

## Before you continue

All of the framework guides assume you already have a fundamental understanding of [Git](https://git-scm.com/). If you are new to Git, refer to this [summarized Git handbook](https://guides.github.com/introduction/git-handbook/) on how to set up Git on your local machine.

If you clone with SSH, you must [generate SSH keys](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) on each computer you use to push or pull from GitHub.

Refer to the [GitHub documentation](https://guides.github.com/introduction/git-handbook/) and [Git documentation](https://git-scm.com/book/en/v2) for more information.

## Create a GitHub repository

Create a new GitHub repository by visiting [repo.new](https://repo.new). After creating a new repository, go to your newly created project directory to prepare and push your local application to GitHub by running the following commands in your terminal:

```sh
git init
git remote add origin https://github.com/<your-gh-username>/<repository-name>
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## Deploy with Cloudflare Pages

### Deploy via the `create-cloudflare` CLI (C3)

If you use [`create-cloudflare`(C3)](https://www.npmjs.com/package/create-cloudflare) to create your new Hono project, C3 will install all dependencies needed for your project and prompt you to deploy your project via the CLI. If you deploy, your site will be live and you will be provided with a deployment URL.

### Deploy via the Cloudflare dashboard

To deploy your site to Pages:

1. In the Cloudflare dashboard, go to the **Workers & Pages** page.

   [Go to **Workers & Pages**](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. Select **Create application**.

3. Select the **Pages** tab.

4. Select **Import an existing Git repository**.

5. Select the new GitHub repository that you created and then select **Begin setup**.

6. In the **Set up builds and deployments** section, provide the following information:

| Configuration option | Value |
| - | - |
| Production branch | `main` |
| Build command | `npm run build` |
| Build directory | `dist` |

After configuring your site, you can begin your first deploy. You should see Cloudflare Pages installing `my-hono-app`, your project dependencies, and building your site before deploying it.

Note

For the complete guide to deploying your first site to Cloudflare Pages, refer to the [Get started guide](https://developers.cloudflare.com/pages/get-started/).

After deploying your site, you will receive a unique subdomain for your project on `*.pages.dev`. Every time you commit new code to your Hono site, Cloudflare Pages will automatically rebuild your project and deploy it. You will also get access to [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) on new pull requests, so you can preview how changes look to your site before deploying them to production.

## Related resources

### Tutorials

For more tutorials involving Hono and Cloudflare Pages, refer to the following resources:

[Build a Staff Directory Application](https://developers.cloudflare.com/d1/tutorials/build-a-staff-directory-app/)

[Build a staff directory using D1. Users access employee info; admins add new employees within the app.](https://developers.cloudflare.com/d1/tutorials/build-a-staff-directory-app/)

### Demo apps

For demo applications using Hono and Cloudflare Pages, refer to the following resources:

* [Hackathon Helper:](https://github.com/craigsdennis/hackathon-helper-workers-ai) A series of starters for Hackathons. Get building quicker! Python, Streamlit, Workers, and Pages starters for all your AI needs!
* [NBA Finals Polling and Predictor:](https://github.com/elizabethsiegle/nbafinals-cloudflare-ai-hono-durable-objects) This stateful polling application uses Cloudflare Workers AI, Cloudflare Pages, Cloudflare Durable Objects, and Hono to keep track of users' votes for different basketball teams and generates personal predictions for the series.
* [Whatever-ify:](https://github.com/craigsdennis/whatever-ify-workers-ai) Turn yourself into...whatever. Take a photo, get a description, generate a scene and character, then generate an image based on that calendar.
* [Staff Directory demo:](https://github.com/lauragift21/staff-directory) Built using the powerful combination of HonoX for backend logic, Cloudflare Pages for fast and secure hosting, and Cloudflare D1 for seamless database management.
* [Vanilla JavaScript Chat Application using Cloudflare Workers AI:](https://github.com/craigsdennis/vanilla-chat-workers-ai) A web based chat interface built on Cloudflare Pages that allows for exploring Text Generation models on Cloudflare Workers AI. Design is built using tailwind.

### Creator Interview
