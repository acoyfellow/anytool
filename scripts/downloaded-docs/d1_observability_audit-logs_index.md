---
title: Audit Logs · Cloudflare D1 docs
description: Audit logs provide a comprehensive summary of changes made within
  your Cloudflare account, including those made to D1 databases. This
  functionality is available on all plan types, free of charge, and is always
  enabled.
lastUpdated: 2025-09-03T16:40:54.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/d1/observability/audit-logs/
  md: https://developers.cloudflare.com/d1/observability/audit-logs/index.md
---

[Audit logs](https://developers.cloudflare.com/fundamentals/account/account-security/review-audit-logs/) provide a comprehensive summary of changes made within your Cloudflare account, including those made to D1 databases. This functionality is available on all plan types, free of charge, and is always enabled.

## Viewing audit logs

To view audit logs for your D1 databases, go to the **Audit Logs** page.

[Go to **Audit logs**](https://dash.cloudflare.com/?to=/:account/audit-log)

For more information on how to access and use audit logs, refer to [Review audit logs](https://developers.cloudflare.com/fundamentals/account/account-security/review-audit-logs/).

## Logged operations

The following configuration actions are logged:

| Operation | Description |
| - | - |
| CreateDatabase | Creation of a new database. |
| DeleteDatabase | Deletion of an existing database. |
| [TimeTravel](https://developers.cloudflare.com/d1/reference/time-travel) | Restoration of a past database version. |

## Example log entry

Below is an example of an audit log entry showing the creation of a new database:

```json
{
  "action": { "info": "CreateDatabase", "result": true, "type": "create" },
  "actor": {
    "email": "<ACTOR_EMAIL>",
    "id": "b1ab1021a61b1b12612a51b128baa172",
    "ip": "1b11:a1b2:12b1:12a::11a:1b",
    "type": "user"
  },
  "id": "a123b12a-ab11-1212-ab1a-a1aa11a11abb",
  "interface": "API",
  "metadata": {},
  "newValue": "",
  "newValueJson": { "database_name": "my-db" },
  "oldValue": "",
  "oldValueJson": {},
  "owner": { "id": "211b1a74121aa32a19121a88a712aa12" },
  "resource": {
    "id": "11a21122-1a11-12bb-11ab-1aa2aa1ab12a",
    "type": "d1.database"
  },
  "when": "2024-08-09T04:53:55.752Z"
}
```
