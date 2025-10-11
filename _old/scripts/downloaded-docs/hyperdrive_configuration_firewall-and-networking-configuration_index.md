---
title: Firewall and networking configuration · Cloudflare Hyperdrive docs
description: Hyperdrive uses the Cloudflare IP address ranges to connect to your
  database. If you decide to restrict the IP addresses that can access your
  database with firewall rules, the IP address ranges listed in this reference
  need to be allow-listed in your database's firewall and networking
  configurations.
lastUpdated: 2025-03-07T16:07:28.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/hyperdrive/configuration/firewall-and-networking-configuration/
  md: https://developers.cloudflare.com/hyperdrive/configuration/firewall-and-networking-configuration/index.md
---

Hyperdrive uses the [Cloudflare IP address ranges](https://www.cloudflare.com/ips/) to connect to your database. If you decide to restrict the IP addresses that can access your database with firewall rules, the IP address ranges listed in this reference need to be allow-listed in your database's firewall and networking configurations.

You can connect to your database from Hyperdrive using any of the 3 following networking configurations:

1. Configure your database to allow inbound connectivity from the public Internet (all IP address ranges).
2. Configure your database to allow inbound connectivity from the public Internet, with only the IP address ranges used by Hyperdrive allow-listed in an IP access control list (ACL).
3. Configure your database to allow inbound connectivity from a private network, and run a Cloudflare Tunnel instance in your private network to enable Hyperdrive to connect from the Cloudflare network to your private network. Refer to [documentation on connecting to a private database using Tunnel](https://developers.cloudflare.com/hyperdrive/configuration/connect-to-private-database/).
