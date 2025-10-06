---
title: Troubleshooting SPF records · Cloudflare Email Routing docs
description: "Having multiple sender policy framework (SPF) records on your
  account is not allowed, and will prevent Email Routing from working properly.
  If your account has multiple SPF records, follow these steps to solve the
  issue:"
lastUpdated: 2024-08-13T19:56:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/email-routing/troubleshooting/email-routing-spf-records/
  md: https://developers.cloudflare.com/email-routing/troubleshooting/email-routing-spf-records/index.md
---

Having multiple [sender policy framework (SPF) records](https://www.cloudflare.com/learning/dns/dns-records/dns-spf-record/) on your account is not allowed, and will prevent Email Routing from working properly. If your account has multiple SPF records, follow these steps to solve the issue:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.
2. Go to **Email** > **Email Routing**. Email Routing will warn you that you have multiple SPF records.
3. Under **View DNS records**, select **Fix records**.
4. Delete the incorrect SPF record.

You should now have your SPF records correctly configured. If you are unsure of which SPF record to delete:

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account and domain.
2. Go to **Email** > **Email Routing**. Email Routing will warn you that you have multiple SPF records.
3. Under **View DNS records**, select **Fix records**.
4. Delete all SPF records.
5. Select **Add records and enable**.
