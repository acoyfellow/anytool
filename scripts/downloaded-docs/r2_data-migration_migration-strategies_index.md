---
title: Migration Strategies · Cloudflare R2 docs
description: You can use a combination of Super Slurper and Sippy to effectively
  migrate all objects with minimal downtime.
lastUpdated: 2025-05-15T13:16:23.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2/data-migration/migration-strategies/
  md: https://developers.cloudflare.com/r2/data-migration/migration-strategies/index.md
---

You can use a combination of Super Slurper and Sippy to effectively migrate all objects with minimal downtime.

### When the source bucket is actively being read from / written to

1. Enable Sippy and start using the R2 bucket in your application.

   * This copies objects from your previous bucket into the R2 bucket on demand when they are requested by the application.
   * New uploads will go to the R2 bucket.

2. Use Super Slurper to trigger a one-off migration to copy the remaining objects into the R2 bucket.
   * In the **Destination R2 bucket** > **Overwrite files?**, select "Skip existing".

### When the source bucket is not being read often

1. Use Super Slurper to copy all objects to the R2 bucket.
   * Note that Super Slurper may skip some objects if they are uploaded after it lists the objects to be copied.

2. Enable Sippy on your R2 bucket, then start using the R2 bucket in your application.

   * New uploads will go to the R2 bucket.
   * Objects which were uploaded while Super Slurper was copying the objects will be copied on-demand (by Sippy) when they are requested by the application.
