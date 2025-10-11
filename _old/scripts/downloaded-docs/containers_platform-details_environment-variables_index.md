---
title: Environment Variables · Cloudflare Containers docs
description: "The container runtime automatically sets the following variables:"
lastUpdated: 2025-09-22T15:52:17.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/containers/platform-details/environment-variables/
  md: https://developers.cloudflare.com/containers/platform-details/environment-variables/index.md
---

## Runtime environment variables

The container runtime automatically sets the following variables:

* `CLOUDFLARE_APPLICATION_ID` - the ID of the Containers application
* `CLOUDFLARE_COUNTRY_A2` - the [ISO 3166-1 Alpha 2 code](https://www.iso.org/obp/ui/#search/code/) of a country the container is placed in
* `CLOUDFLARE_LOCATION` - a name of a location the container is placed in
* `CLOUDFLARE_REGION` - a region name
* `CLOUDFLARE_DURABLE_OBJECT_ID` - the ID of the Durable Object instance that the container is bound to. You can use this to identify particular container instances on the dashboard.

## User-defined environment variables

You can set environment variables when defining a Container in your Worker, or when starting a container instance.

For example:

```javascript
class MyContainer extends Container {
  defaultPort = 4000;
  envVars = {
    MY_CUSTOM_VAR: "value",
    ANOTHER_VAR: "another_value",
  };
}
```

More details about defining environment variables and secrets can be found in [this example](https://developers.cloudflare.com/containers/examples/env-vars-and-secrets).
