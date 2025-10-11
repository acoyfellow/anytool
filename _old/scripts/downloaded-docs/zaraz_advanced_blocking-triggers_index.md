---
title: Blocking Triggers · Cloudflare Zaraz docs
description: Blocking Triggers are triggers that instead of being used to define
  when to start an action, are used to define when to not start an action. You
  may need to block one or more actions in a tool from firing when a specific
  condition arises. For these cases, you can set Blocking Triggers.
lastUpdated: 2024-09-24T17:04:21.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/zaraz/advanced/blocking-triggers/
  md: https://developers.cloudflare.com/zaraz/advanced/blocking-triggers/index.md
---

Blocking Triggers are triggers that instead of being used to define when to start an action, are used to define when to *not* start an action. You may need to block one or more actions in a tool from firing when a specific condition arises. For these cases, you can set Blocking Triggers.

Every tool action has Firing Triggers assigned to it. Blocking Triggers are optional and, if defined, will conditionally prevent the action from starting. When you add Blocking Triggers to an action, the action will not fire if any of its Blocking Triggers are true. If the tool has more than one action, other actions without these Blocking Triggers will still work.

To conditionally block all actions in a tool, you have to configure Blocking Triggers on every action that belongs to that tool. Note that when you use Blocking Triggers, Zaraz will still load on the page.

To use Blocking Triggers, start by [creating the trigger](https://developers.cloudflare.com/zaraz/custom-actions/create-trigger/) with the conditions you want to use to block an event. Then:

1. Go to [**Zaraz**](https://dash.cloudflare.com/?to=/:account/:zone/zaraz) > **Tools Configuration**.
2. Under **Third-party tools**, locate the tool with the action you want to block and select **Edit**.
3. In **Action Name**, select the action you want to block.
4. In **Blocking Triggers**, use the dropdown menu to add a trigger to block the action.
5. Select **Save**.

Note

Blocking Triggers are useful if you wish to block specific actions, or even specific tools from firing, while keeping others active. If you wish to turn off Zaraz entirely on specific pages/domains/subdomains, or load Zaraz depending on other factors such as cookies, we recommend [loading Zaraz selectively](https://developers.cloudflare.com/zaraz/advanced/load-selectively/).
