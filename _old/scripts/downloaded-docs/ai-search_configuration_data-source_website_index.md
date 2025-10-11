---
title: Website · Cloudflare AI Search docs
description: The Website data source allows you to connect a domain you own so
  its pages can be crawled, stored, and indexed.
lastUpdated: 2025-09-24T17:03:07.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/ai-search/configuration/data-source/website/
  md: https://developers.cloudflare.com/ai-search/configuration/data-source/website/index.md
---

The Website data source allows you to connect a domain you own so its pages can be crawled, stored, and indexed.

Note

You can only crawl domains that you have onboarded onto the same Cloudflare account.

Refer to [Onboard a domain](https://developers.cloudflare.com/fundamentals/manage-domains/add-site/) for more information on adding a domain to your Cloudflare account.

Bot protection may block crawling

If you use Cloudflare products that control or restrict bot traffic such as [Bot Management](https://developers.cloudflare.com/bots/), [Web Application Firewall (WAF)](https://developers.cloudflare.com/waf/), or [Turnstile](https://developers.cloudflare.com/turnstile/), the same rules will apply to the AI Search (AutoRAG) crawler. Make sure to configure an exception or an allow-list for the AutoRAG crawler in your settings.

## How website crawling works

When you connect a domain, the crawler looks for your website’s sitemap to determine which pages to visit:

1. The crawler first checks the `robots.txt` for listed sitemaps. If it exists, it reads all sitemaps existing inside.
2. If no `robots.txt` is found, the crawler first checks for a sitemap at `/sitemap.xml`.
3. If no sitemap is available, the domain cannot be crawled.

Pages are visited, according to the `<priority>` attribute set on the sitemaps, if this field is defined.

## How to set WAF rules to allowlist the crawler

If you have Security rules configured to block bot activity, you can add a rule to allowlist the crawler bot.

1. In the Cloudflare dashboard, go to the **Security rules** page of your account and domain.

   [Go to **Security rules**](https://dash.cloudflare.com/?to=/:account/:zone/security/security-rules)

2. To create a new empty rule, select **Create rule** > **Custom rules**.

3. Enter a descriptive name for the rule in **Rule name**, such as `Allow AI Search`.

4. Under **When incoming requests match**, use the **Field** drop-down list to choose *Bot Detection ID*. For **Operator**, select *equals*. For **Value**, enter `122933950`.

5. Under **Then take action**, in the **Choose action** dropdown, choose *Skip*.

6. Under **Place at**, select the order of the rule in the **Select order** dropdown to be *First*. Setting the order as *First* allows this rule to be applied before subsequent rules.

7. To save and deploy your rule, select **Deploy**.

## Parsing options

You can choose how pages are parsed during crawling:

* **Static sites**: Downloads the raw HTML for each page.
* **Rendered sites**: Loads pages with a headless browser and downloads the fully rendered version, including dynamic JavaScript content. Note that the [Browser Rendering](https://developers.cloudflare.com/browser-rendering/platform/pricing/) limits and billing apply.

## Storage

During setup, AI Search creates a dedicated R2 bucket in your account to store the pages that have been crawled and downloaded as HTML files. This bucket is automatically managed and is used only for content discovered by the crawler. Any files or objects that you add directly to this bucket will not be indexed.

Note

We recommend not to modify the bucket as it may distrupt the indexing flow and cause content to not be updated properly.

## Sync and updates

During scheduled or manual [sync jobs](https://developers.cloudflare.com/ai-search/configuration/indexing/), the crawler will check for changes to the `<lastmod>` attribute in your sitemap. If it has been changed to a date occuring after the last sync date, then the page will be crawled, the updated version is stored in the R2 bucket, and automatically reindexed so that your search results always reflect the latest content.

If the `<lastmod>` attribute is not defined, then AI Search will automatically crawl each link defined in the sitemap once a day.

## Limits

The regular AI Search [limits](https://developers.cloudflare.com/ai-search/platform/limits-pricing/) apply when using the Website data source.

The crawler will download and index pages only up to the maximum object limit supported for an AI Search instance, and it processes the first set of pages it visits until that limit is reached. In addition, any files that are downloaded but exceed the file size limit will not be indexed.
