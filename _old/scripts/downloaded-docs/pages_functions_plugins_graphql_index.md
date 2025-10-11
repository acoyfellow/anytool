---
title: GraphQL · Cloudflare Pages docs
description: The GraphQL Pages Plugin creates a GraphQL server which can respond
  to application/json and application/graphql POST requests. It responds with
  the GraphQL Playground for GET requests.
lastUpdated: 2025-09-15T21:45:20.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/pages/functions/plugins/graphql/
  md: https://developers.cloudflare.com/pages/functions/plugins/graphql/index.md
---

The GraphQL Pages Plugin creates a GraphQL server which can respond to `application/json` and `application/graphql` `POST` requests. It responds with [the GraphQL Playground](https://github.com/graphql/graphql-playground) for `GET` requests.

## Installation

* npm

  ```sh
  npm i @cloudflare/pages-plugin-graphql
  ```

* yarn

  ```sh
  yarn add @cloudflare/pages-plugin-graphql
  ```

* pnpm

  ```sh
  pnpm add @cloudflare/pages-plugin-graphql
  ```

## Usage

```typescript
import graphQLPlugin from "@cloudflare/pages-plugin-graphql";
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return "Hello, world!";
        },
      },
    },
  }),
});


export const onRequest: PagesFunction = graphQLPlugin({
  schema,
  graphql,
});
```

This Plugin only exposes a single route, so wherever it is mounted is wherever it will be available. In the above example, because it is mounted in `functions/graphql.ts`, the server will be available on `/graphql` of your Pages project.
