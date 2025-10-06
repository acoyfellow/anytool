---
title: GraphQL Analytics API · Cloudflare Stream docs
description: Stream provides analytics about both live video and video uploaded
  to Stream, via the GraphQL API described below, as well as on the Stream
  Analytics page of the Cloudflare dashboard.
lastUpdated: 2025-09-09T16:21:39.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/stream/getting-analytics/fetching-bulk-analytics/
  md: https://developers.cloudflare.com/stream/getting-analytics/fetching-bulk-analytics/index.md
---

Stream provides analytics about both live video and video uploaded to Stream, via the GraphQL API described below, as well as on the Stream **Analytics** page of the Cloudflare dashboard.

[Go to **Analytics**](https://dash.cloudflare.com/?to=/:account/stream/analytics)

The Stream Analytics API uses the Cloudflare GraphQL Analytics API, which can be used across many Cloudflare products. For more about GraphQL, rate limits, filters, and sorting, refer to the [Cloudflare GraphQL Analytics API docs](https://developers.cloudflare.com/analytics/graphql-api).

## Getting started

1. In the Cloudflare dashboard, go to the **Account API tokens** page.

   [Go to **Account API tokens**](https://dash.cloudflare.com/?to=/:account/api-tokens)

2. Generate an API token with the **Account Analytics** permission.

3. Use a GraphQL client of your choice to make your first query. [Postman](https://www.postman.com/) has a built-in GraphQL client which can help you run your first query and introspect the GraphQL schema to understand what is possible.

Refer to the sections below for available metrics, dimensions, fields, and example queries.

## Server side analytics

Stream collects data about the number of minutes of video delivered to viewers for all live and on-demand videos played via HLS or DASH, regardless of whether or not you use the [Stream Player](https://developers.cloudflare.com/stream/viewing-videos/using-the-stream-player/).

### Filters and Dimensions

| Field | Description |
| - | - |
| `date` | Date |
| `datetime` | DateTime |
| `uid` | UID of the video |
| `clientCountryName` | ISO 3166 alpha2 country code from the client who viewed the video |
| `creator` | The [Creator ID](https://developers.cloudflare.com/stream/manage-video-library/creator-id/) associated with individual videos, if present |

Some filters, like `date`, can be used with operators, such as `gt` (greater than) and `lt` (less than), as shown in the example query below. For more advanced filtering options, refer to [filtering](https://developers.cloudflare.com/analytics/graphql-api/features/filtering/).

### Metrics

| Node | Field | Description |
| - | - | - |
| `streamMinutesViewedAdaptiveGroups` | `minutesViewed` | Minutes of video delivered |

### Example

#### Get minutes viewed by country

```graphql
query StreamGetMinutesExample($accountTag: string!, $start: Date, $end: Date) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      streamMinutesViewedAdaptiveGroups(
        filter: { date_geq: $start, date_lt: $end }
        orderBy: [sum_minutesViewed_DESC]
        limit: 100
      ) {
        sum {
          minutesViewed
        }
        dimensions {
          uid
          clientCountryName
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAygFwmAhgWwOJgQWQJYB2ICYAzgKIAe6ADgDZgAUAJCgMZsD2IBCAKigDmALhikkhQQEIANDGbiUEBKIAiKEnOZgCAEzUawAShgBvAFAwYANzxgA7pDOWrMdlx4JSjAGZ46JBCipm4c3LwCIvLu4fxCMAC+JhauruLI6PhEJKQAanaOugCCuig0CHjWYBgQ3DTeLqlWfgGQwTClJAD6gmDAogoISghynWBdAQM6uomNTZwQupAAQlCiANqkIGhdaITEZPkOYLpdquRwAMIAunOpdHh7KjAAjAAMb3cwyV9WW2jOJpNPbZQ4FE6-WZAqy6R46Uh4TgEUiA6FWEB4XSQqxsB46BCXWLQABy6DAkISX0pqWpswSQA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQBnRMAJ0SxACYAGbgKwBaAIy8h-BiACm8ACZc+g0eN4BmEAF8gA)

```json
{
  "data": {
    "viewer": {
      "accounts": [
        {
          "streamMinutesViewedAdaptiveGroups": [
            {
              "dimensions": {
                "clientCountryName": "US",
                "uid": "73c514082b154945a753d0011e9d7525"
              },
              "sum": {
                "minutesViewed": 2234
              }
            },
            {
              "dimensions": {
                "clientCountryName": "CN",
                "uid": "73c514082b154945a753d0011e9d7525"
              },
              "sum": {
                "minutesViewed": 700
              }
            },
            {
              "dimensions": {
                "clientCountryName": "IN",
                "uid": "73c514082b154945a753d0011e9d7525"
              },
              "sum": {
                "minutesViewed": 553
              }
            }
          ]
        }
      ]
    }
  },
  "errors": null
}
```

## Pagination

GraphQL API supports seek pagination: using filters, you can specify the last video UID so the response only includes data for videos after the last video UID.

The query below will return data for 2 videos that follow video UID `5646153f8dea17f44d542a42e76cfd`:

```graphql
query StreamPaginationExample(
  $accountTag: string!
  $start: Date
  $end: Date
  $uId: string
) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      videoPlaybackEventsAdaptiveGroups(
        filter: { date_geq: $start, date_lt: $end, uid_gt: $uId }
        orderBy: [uid_ASC]
        limit: 2
      ) {
        count
        sum {
          timeViewedMinutes
        }
        dimensions {
          uid
        }
      }
    }
  }
}
```

[Run in GraphQL API Explorer](https://graphql.cloudflare.com/explorer?query=I4VwpgTgngBAygFwmAhgWwAooOYEsB2KCuA9vgKIAe6ADgDZgAUAUDDACQoDGXJI+CACo4AXDADOSAtgCErDpJQQEYgCJEw89mHwATNRq0gAkvolT82ZgEoYAb3kA3XGADuke-Lbde-BOMYAM1w6BEgxOxgfPgFhbDFOHhihHBgAX1sHNmyYZ10wEgw6FCgAI24Aa3JHHX8AQV0UGmIagHEIPhoArxyYYNDw+xhGsIB9bDBgBMVlABphjVHQhJ1deZBcXXGVDhNddJ6ckgh8iAAhKDEAbQ2turgAYQBdQ+y6XDRcHYAmV8zXti+AQAiQgNCeXq9YhoMAANRc7l0AFkCCAwuIQWkQboPjpxKR8OIIZDsrdMa8sTlKQc0kA\&variables=N4IghgxhD2CuB2AXAKmA5iAXCAggYTwHkBVAOWQH0BJAERABoQBnRMAJ0SxACYAGbgKwBaAIy8h-BiACm8ACZc+g0eN4BmKbCoLsAgGwAWPSIFqAZgA450sCIDsZgwbkCD3MG+l29EMwoC+QA)

Here are the steps to implementing pagination:

1. Call the first query without uid\_gt filter to get the first set of videos
2. Grab the last video UID from the response from the first query
3. Call next query by specifying uid\_gt property and set it to the last video UID. This will return the next set of videos

For more on pagination, refer to the [Cloudflare GraphQL Analytics API docs](https://developers.cloudflare.com/analytics/graphql-api/features/pagination/).

## Limitations

* The maximum query interval in a single query is 31 days
* The maximum data retention period is 90 days
