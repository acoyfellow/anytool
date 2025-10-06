---
title: Cloudflare Workers KV · Cloudflare Workers KV docs
description: Workers KV is a data storage that allows you to store and retrieve
  data globally. With Workers KV, you can build dynamic and performant APIs and
  websites that support high read volumes with low latency.
lastUpdated: 2025-07-02T08:12:56.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/kv/
  md: https://developers.cloudflare.com/kv/index.md
---

Create a global, low-latency, key-value data storage.

Available on Free and Paid plans

Workers KV is a data storage that allows you to store and retrieve data globally. With Workers KV, you can build dynamic and performant APIs and websites that support high read volumes with low latency.

For example, you can use Workers KV for:

* Caching API responses.
* Storing user configurations / preferences.
* Storing user authentication details.

Access your Workers KV namespace from Cloudflare Workers using [Workers Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) or from your external application using the REST API:

* Workers Binding API

  * index.ts

    ```ts
    export default {
      async fetch(request, env, ctx): Promise<Response> {
        // write a key-value pair
        await env.KV.put('KEY', 'VALUE');


        // read a key-value pair
        const value = await env.KV.get('KEY');


        // list all key-value pairs
        const allKeys = await env.KV.list();


        // delete a key-value pair
        await env.KV.delete('KEY');


        // return a Workers response
        return new Response(
          JSON.stringify({
            value: value,
            allKeys: allKeys,
          }),
        );
      },


    } satisfies ExportedHandler<{ KV: KVNamespace }>;
    ```

  * wrangler.jsonc

    ```json
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "<ENTER_WORKER_NAME>",
      "main": "src/index.ts",
      "compatibility_date": "2025-02-04",
      "observability": {
        "enabled": true
      },


      "kv_namespaces": [
        {
          "binding": "KV",
          "id": "<YOUR_BINDING_ID>"
        }
      ]
    }
    ```

  See the full [Workers KV binding API reference](https://developers.cloudflare.com/kv/api/read-key-value-pairs/).

* REST API

  * cURL

    ```plaintext
    curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/$KEY_NAME \
        -X PUT \
        -H 'Content-Type: multipart/form-data' \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
        -d '{
          "value": "Some Value"
        }'


    curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/$KEY_NAME \
        -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
        -H "X-Auth-Key: $CLOUDFLARE_API_KEY"
    ```

  * TypeScript

    ```ts
    const client = new Cloudflare({
      apiEmail: process.env['CLOUDFLARE_EMAIL'], // This is the default and can be omitted
      apiKey: process.env['CLOUDFLARE_API_KEY'], // This is the default and can be omitted
    });


    const value = await client.kv.namespaces.values.update('<KV_NAMESPACE_ID>', 'KEY', {
      account_id: '<ACCOUNT_ID>',
      value: 'VALUE',
    });


    const value = await client.kv.namespaces.values.get('<KV_NAMESPACE_ID>', 'KEY', {
      account_id: '<ACCOUNT_ID>',
    });


    const value = await client.kv.namespaces.values.delete('<KV_NAMESPACE_ID>', 'KEY', {
      account_id: '<ACCOUNT_ID>',
    });


    // Automatically fetches more pages as needed.
    for await (const namespace of client.kv.namespaces.list({ account_id: '<ACCOUNT_ID>' })) {
      console.log(namespace.id);
    }
    ```

  See the full Workers KV [REST API and SDK reference](https://developers.cloudflare.com/api/resources/kv/) for details on using REST API from external applications, with pre-generated SDK's for external TypeScript, Python, or Go applications.

* index.ts

  ```ts
  export default {
    async fetch(request, env, ctx): Promise<Response> {
      // write a key-value pair
      await env.KV.put('KEY', 'VALUE');


      // read a key-value pair
      const value = await env.KV.get('KEY');


      // list all key-value pairs
      const allKeys = await env.KV.list();


      // delete a key-value pair
      await env.KV.delete('KEY');


      // return a Workers response
      return new Response(
        JSON.stringify({
          value: value,
          allKeys: allKeys,
        }),
      );
    },


  } satisfies ExportedHandler<{ KV: KVNamespace }>;
  ```

* wrangler.jsonc

  ```json
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "<ENTER_WORKER_NAME>",
    "main": "src/index.ts",
    "compatibility_date": "2025-02-04",
    "observability": {
      "enabled": true
    },


    "kv_namespaces": [
      {
        "binding": "KV",
        "id": "<YOUR_BINDING_ID>"
      }
    ]
  }
  ```

* cURL

  ```plaintext
  curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/$KEY_NAME \
      -X PUT \
      -H 'Content-Type: multipart/form-data' \
      -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
      -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
      -d '{
        "value": "Some Value"
      }'


  curl https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/$KEY_NAME \
      -H "X-Auth-Email: $CLOUDFLARE_EMAIL" \
      -H "X-Auth-Key: $CLOUDFLARE_API_KEY"
  ```

* TypeScript

  ```ts
  const client = new Cloudflare({
    apiEmail: process.env['CLOUDFLARE_EMAIL'], // This is the default and can be omitted
    apiKey: process.env['CLOUDFLARE_API_KEY'], // This is the default and can be omitted
  });


  const value = await client.kv.namespaces.values.update('<KV_NAMESPACE_ID>', 'KEY', {
    account_id: '<ACCOUNT_ID>',
    value: 'VALUE',
  });


  const value = await client.kv.namespaces.values.get('<KV_NAMESPACE_ID>', 'KEY', {
    account_id: '<ACCOUNT_ID>',
  });


  const value = await client.kv.namespaces.values.delete('<KV_NAMESPACE_ID>', 'KEY', {
    account_id: '<ACCOUNT_ID>',
  });


  // Automatically fetches more pages as needed.
  for await (const namespace of client.kv.namespaces.list({ account_id: '<ACCOUNT_ID>' })) {
    console.log(namespace.id);
  }
  ```

[Get started](https://developers.cloudflare.com/kv/get-started/)

***

## Features

### Key-value storage

Learn how Workers KV stores and retrieves data.

[Use Key-value storage](https://developers.cloudflare.com/kv/get-started/)

### Wrangler

The Workers command-line interface, Wrangler, allows you to [create](https://developers.cloudflare.com/workers/wrangler/commands/#init), [test](https://developers.cloudflare.com/workers/wrangler/commands/#dev), and [deploy](https://developers.cloudflare.com/workers/wrangler/commands/#publish) your Workers projects.

[Use Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Bindings

Bindings allow your Workers to interact with resources on the Cloudflare developer platform, including [R2](https://developers.cloudflare.com/r2/), [Durable Objects](https://developers.cloudflare.com/durable-objects/), and [D1](https://developers.cloudflare.com/d1/).

[Use Bindings](https://developers.cloudflare.com/kv/concepts/kv-bindings/)

***

## Related products

**[R2](https://developers.cloudflare.com/r2/)**

Cloudflare R2 Storage allows developers to store large amounts of unstructured data without the costly egress bandwidth fees associated with typical cloud storage services.

**[Durable Objects](https://developers.cloudflare.com/durable-objects/)**

Cloudflare Durable Objects allows developers to access scalable compute and permanent, consistent storage.

**[D1](https://developers.cloudflare.com/d1/)**

Built on SQLite, D1 is Cloudflare’s first queryable relational database. Create an entire database by importing data or defining your tables and writing your queries within a Worker or through the API.

***

### More resources

[Limits](https://developers.cloudflare.com/kv/platform/limits/)

Learn about KV limits.

[Pricing](https://developers.cloudflare.com/kv/platform/pricing/)

Learn about KV pricing.

[Discord](https://discord.com/channels/595317990191398933/893253103695065128)

Ask questions, show off what you are building, and discuss the platform with other developers.

[Twitter](https://x.com/cloudflaredev)

Learn about product announcements, new tutorials, and what is new in Cloudflare Developer Platform.
