---
title: x402 · Cloudflare Agents docs
description: x402 is an open payment standard that enables services to charge
  for access to their APIs and content directly over HTTP. It is built around
  the HTTP 402 Payment Required status code and allows clients to
  programmatically pay for resources without accounts, sessions, or credential
  management.
lastUpdated: 2025-09-23T12:10:35.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/agents/x402/
  md: https://developers.cloudflare.com/agents/x402/index.md
---

## What is x402?

[x402](https://www.x402.org/) is an open payment standard that enables services to charge for access to their APIs and content directly over HTTP. It is built around the HTTP 402 Payment Required status code and allows clients to programmatically pay for resources without accounts, sessions, or credential management.

## x402 Workers and Agents

You can create paywalled endpoints in your Workers and query any x402 server from your agent by wrapping the `fetch` with x402 and your account.

```ts
import { Hono } from "hono";
import { Agent, getAgentByName } from "agents";
import { wrapFetchWithPayment } from "x402-fetch";
import { paymentMiddleware } from "x402-hono";


// This allows us to derive an account from just the private key
import { privateKeyToAccount } from "viem/accounts";


// The code below creates an Agent that can fetch the protected route and automatically pay.
// The agent's account must not be empty! You can get test credits
// for base-sepolia here: https://faucet.circle.com/
export class PayAgent extends Agent<Env> {
  fetchWithPay!: ReturnType<typeof wrapFetchWithPayment>;


  onStart() {
    // We derive the account from which the agent will pay
    const privateKey = process.env.CLIENT_TEST_PK as `0x${string}`;
    const account = privateKeyToAccount(privateKey);
    console.log("Agent will pay from this address:", account.address);
    this.fetchWithPay = wrapFetchWithPayment(fetch, account);
  }


  async onRequest(req: Request) {
    const url = new URL(req.url);
    console.log("Trying to fetch paid API");


    // Use the x402 compatible fetch (fetchWithPay) to access the paid endpoint
    // Note: this could be any paid endpoint, on any server
    const paidUrl = new URL("/protected-route", url.origin).toString();
    return this.fetchWithPay(paidUrl, {});
  }
}


const app = new Hono<{ Bindings: Env }>();


// Configure the middleware.
// Only gate the `protected-route` endpoint, everything else we keep free.
app.use(
  paymentMiddleware(
    process.env.SERVER_ADDRESS as `0x${string}`, // our server's public address
    {
      "/protected-route": {
        price: "$0.10",
        network: "base-sepolia",
        config: {
          description: "Access to premium content",
        },
      },
    },
    { url: "https://x402.org/facilitator" }, // Payment facilitator URL
    // To learn more about facilitators https://x402.gitbook.io/x402/core-concepts/facilitator
  ),
);


// Our paid endpoint will return some premium content.
app.get("/protected-route", (c) => {
  return c.json({
    message: "This content is behind a paywall. Thanks for paying!",
  });
});


// The agent will fetch our own protected route and automatically pay.
app.get("/agent", async (c) => {
  const agent = await getAgentByName(c.env.PAY_AGENT, "1234");
  return agent.fetch(c.req.raw);
});


export default app;
```

Check out the [complete example](https://github.com/cloudflare/agents/tree/main/examples/x402).

## MCP servers with paid tools

x402 supercharges your MCP servers so they can include paid tools.

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { withX402, type X402Config } from "agents/x402";


const X402_CONFIG: X402Config = {
  network: "base",
  recipient: env.MCP_ADDRESS,
  facilitator: { url: "https://x402.org/facilitator" }, // Payment facilitator URL
  // To learn more about facilitators https://x402.gitbook.io/x402/core-concepts/facilitator
};


export class PaidMCP extends McpAgent<Env> {
  server = withX402(
    new McpServer({ name: "PaidMCP", version: "1.0.0" }),
    X402_CONFIG,
  ); // That's it!


  async init() {
    // Paid tool
    this.server.paidTool(
      "square",
      "Squares a number",
      0.01, // USD
      { number: z.number() },
      {},
      async ({ number }) => {
        return { content: [{ type: "text", text: String(number ** 2) }] };
      },
    );


    // Free tool
    this.server.tool(
      "echo",
      "Echo a message",
      { message: z.string() },
      async ({ message }) => {
        return { content: [{ type: "text", text: message }] };
      },
    );
  }
}
```

We also include an MCP client that you can use from anywhere (not just your Agents!) to pay for these tools.

```ts
import { Agent } from "agents";
import { withX402Client } from "agents/x402";
import { privateKeyToAccount } from "viem/accounts";


export class MyAgent extends Agent {
  // Your Agent definitions...


  onStart() {
    const { id } = await this.mcp.connect(`${env.WORKER_URL}/mcp`);
    const account = privateKeyToAccount(this.env.MY_PRIVATE_KEY);


    this.x402Client = withX402Client(this.mcp.mcpConnections[id].client, {
      network: "base-sepolia",
      account,
    });
  }


  onPaymentRequired(paymentRequirements): Promise<boolean> {
    // Your human-in-the-loop confirmation flow...
  }


  async onToolCall(toolName: string, toolArgs: unknown) {
    // The first parameter becomes the confirmation callback.
    // We can set it to `null` if we want the agent to pay automatically.
    return await this.x402Client.callTool(this.onPaymentRequired, {
      name: toolName,
      arguments: toolArgs,
    });
  }
}
```

Check out the [complete example](https://github.com/cloudflare/agents/tree/main/examples/x402-mcp).
