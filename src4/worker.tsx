/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { html } from "hono/html";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { DurableObject, DurableObjectState, ExecutionContext, WorkerEntrypoint } from "cloudflare:workers";
import type { R2Bucket, Cloudflare } from "cloudflare:workers";

// Lightweight proxy to intercept fetch calls from dynamic workers
export class OutboundProxy extends WorkerEntrypoint<Cloudflare.Env> {
  async fetch(request: Request): Promise<Response> {
    const toolId = (this.ctx.props as any)?.toolId || 'unknown';
    const url = new URL(request.url);

    // Log the request (optional)
    console.log(`[${toolId}] Outbound fetch: ${url.hostname}${url.pathname}`);

    // Forward to actual fetch
    return fetch(request);
  }
}

// Simple, pragmatic tool generation for dogfooding in inbox.dog
// No auth complexity - just one hardcoded API key for now
const DOGFOOD_API_KEY = "anytool-internal-dogfood-key-2024";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use(
  "*",
  jsxRenderer(
    ({ children }) => html`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Anytool v4</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            * { font-family: ui-monospace, monospace; }
          </style>
        </head>
        <body>
          ${children}
        </body>
      </html>`
  )
);

// Simple hash function
async function hashPrompt(prompt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(prompt.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get relevant docs from R2 AI Search
async function getRelevantDocs(prompt: string, ai: any): Promise<string> {
  if (!ai) {
    return "No AI Search available - using basic CF Workers context";
  }

  try {
    // Query AI Search for relevant Cloudflare docs from R2 bucket
    const searchResults = await ai.autorag("anytool").search({
      query: prompt,
      max_num_results: 5
    });

    let context = "RELEVANT CLOUDFLARE WORKERS DOCUMENTATION:\n\n";

    for (const result of searchResults.data || []) {
      // Extract content from the search result
      if (result.content) {
        context += `${result.title || 'Documentation'}:\n${result.content}\n\n`;
      }
    }

    return context.length > 50 ? context : "No relevant documentation found - using basic context";
  } catch (error) {
    console.error("AI Search failed:", error);
    return "AI Search unavailable - proceeding with basic context";
  }
}

// Main tool generation endpoint
app.post("/api/tool", async (c) => {
  // Simple API key check for dogfooding
  const apiKey = c.req.header('x-api-key') || c.req.header('authorization')?.replace('Bearer ', '');
  if (!apiKey || apiKey !== DOGFOOD_API_KEY) {
    return Response.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  try {
    const { prompt, input = "", forceRegenerate = false } = await c.req.json();

    if (!prompt?.trim()) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    // 1. Hash prompt for caching
    const hash = await hashPrompt(prompt);
    console.log(`Tool request: ${hash.substring(0, 8)} - ${prompt}`);

    // 2. Check cache (unless forcing regeneration)
    if (!forceRegenerate && c.env.TOOL_CACHE) {
      const cached = await c.env.TOOL_CACHE.get(`tools/${hash}.json`);
      if (cached) {
        const tool = await cached.json() as any;
        console.log("Cache hit, executing cached tool");

        // Execute cached tool
        const outboundProxy = (c.env as any).OUTBOUND_PROXY
          ? (c.env as any).OUTBOUND_PROXY({ props: { toolId: hash.substring(0, 8) } })
          : undefined;
        const result = await executeTool(tool.bundledCode, input, hash, c.env, outboundProxy);

        return Response.json({
          output: result.output,
          contentType: result.contentType,
          outputType: tool.outputType,
          outputDescription: tool.outputDescription,
          toolHash: hash,
          packages: tool.packages,
          cached: true,
          generatedCode: tool.bundledCode
        });
      }
    }

    // 3. Generate new tool
    console.log("Cache miss - generating new tool");

    // Get relevant documentation from R2 AI Search
    const relevantDocs = await getRelevantDocs(prompt, c.env.AI);

    // Build smart prompt with live documentation
    let smartPrompt = `Create a Cloudflare Worker that implements: ${prompt}

${relevantDocs}

CLOUDFLARE WORKERS ENVIRONMENT:
- V8 JavaScript engine with Web APIs
- No Node.js APIs (fs, path, os, process, etc.)
- ESM modules only (import/export syntax)
- Memory: 128MB per request, CPU: 50ms limit
- Available: fetch(), crypto.subtle, TextEncoder/TextDecoder, URL, JSON, etc.

⚠️ CRITICAL: PREFER BUILT-IN WEB APIs OVER EXTERNAL PACKAGES ⚠️

BUILT-IN APIs AVAILABLE (USE THESE FIRST):
- crypto.randomUUID() - Generate UUIDs (NO package needed)
- crypto.subtle - Cryptographic operations (SHA, HMAC, etc.)
- fetch() - HTTP requests (NO package needed)
- TextEncoder/TextDecoder - Text encoding
- URL, URLSearchParams - URL manipulation
- Date, Math, JSON - Standard objects
- btoa(), atob() - Base64 encoding/decoding

EXTERNAL PACKAGES (AVOID UNLESS ABSOLUTELY NECESSARY):
Currently external packages are not properly bundled.
Use built-in APIs whenever possible instead.

EXACT CODE FORMAT (NO EXTERNAL PACKAGES):

export default {
  fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const input = url.searchParams.get('q') || 'default';

      // Use BUILT-IN APIs only:
      // - crypto.randomUUID() for UUIDs
      // - fetch() for HTTP requests
      // - crypto.subtle for cryptography
      // - Date, Math, JSON for common operations

      const result = processInput(input);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

REQUIREMENTS:
- Plain JavaScript only (no TypeScript)
- NO external package imports - use built-in Web APIs only
- Always include try/catch
- Input via ?q=VALUE query parameter
- Return Response with proper Content-Type
- For async operations: make fetch function async and await all promises
- Use crypto.randomUUID() for UUIDs, fetch() for HTTP, crypto.subtle for cryptography`;

    // Generate with AI (with retry on failure)
    const openai = createOpenAI({ apiKey: c.env.OPENAI_API_KEY });
    let result: any;
    let compiled: any;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        // Generate tool code
        result = await generateObject({
          model: openai("gpt-4o-mini"),
          schema: z.object({
            typescript: z.string().describe("Complete Cloudflare Worker code"),
            example: z.string().describe("Example input value (just the value, not full URL)"),
            outputType: z.enum(['text', 'json', 'html', 'image', 'svg', 'csv', 'xml']),
            outputDescription: z.string().describe("What the output contains")
          }),
          prompt: retryCount === 0 ? smartPrompt : `${smartPrompt}

PREVIOUS ATTEMPT ${retryCount} FAILED. Please fix the issues and generate working code.
Common issues to avoid:
- Use correct ES6 import syntax (import { v4 } from 'uuid' NOT import { uuid } from 'uuid')
- Check package exports carefully
- Avoid Node.js-only packages
- Test your imports against Cloudflare Workers compatibility`
        });

        // 4. Compile the code
        compiled = await compileTool(result.object.typescript, c.env);

        // 5. Light validation - just check if code compiles
        console.log("Tool compiled successfully, caching without runtime validation");
        break; // Success! Exit retry loop

      } catch (error) {
        retryCount++;
        console.log(`Tool generation attempt ${retryCount} failed: ${error.message}`);

        if (retryCount > maxRetries) {
          throw new Error(`Tool generation failed after ${maxRetries} retries. Last error: ${error.message}`);
        }

        // Add error context to prompt for next retry
        smartPrompt += `

PREVIOUS ERROR TO FIX:
${error.message}

Please analyze this error and generate corrected code.`;
      }
    }

    // 6. Cache the working tool
    const toolData = {
      hash,
      bundledCode: compiled.bundledCode,
      createdAt: Date.now(),
      packages: compiled.packages,
      outputType: result.object.outputType,
      outputDescription: result.object.outputDescription
    };

    if (c.env.TOOL_CACHE) {
      await c.env.TOOL_CACHE.put(`tools/${hash}.json`, JSON.stringify(toolData));
    }

    // 7. Execute with actual input
    const outboundProxy = (c.env as any).OUTBOUND_PROXY
      ? (c.env as any).OUTBOUND_PROXY({ props: { toolId: hash.substring(0, 8) } })
      : undefined;
    const finalResult = await executeTool(compiled.bundledCode, input, hash, c.env, outboundProxy);

    return Response.json({
      output: finalResult.output,
      contentType: finalResult.contentType,
      outputType: result.object.outputType,
      outputDescription: result.object.outputDescription,
      toolHash: hash,
      packages: compiled.packages,
      cached: false,
      generatedCode: compiled.bundledCode
    });

  } catch (error) {
    console.error("Tool execution error:", error);
    return Response.json({
      error: `Tool failed: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
});

// Health check
app.get("/health", async (c) => {
  const container = c.env.COMPILER_DO.getByName('compiler');
  const response = await container.fetch('http://container/ping');
  const result = await response.json();
  console.log("container ping", result);
  return Response.json({
    status: "healthy",
    service: "anytool",
    version: "0.0.1",
    containerPing: result
  });
});

// Frontend
app.get("/", async (c) => {
  return c.render(
    <div className="bg-gray-900 text-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Anytool v4</h1>
          <p className="text-gray-400">AI-powered tool generation with search</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">What do you want to build?</label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
              placeholder="Create a UUID generator using the uuid package"
            />
          </div>

          <div className="flex gap-3">
            <input
              id="input"
              type="text"
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
              placeholder="Test input (optional)"
            />
            <button
              id="run"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium"
              onclick="runTool()"
            >
              Run
            </button>
          </div>

          <div className="flex gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" id="force" />
              <span>Force regenerate</span>
            </label>
          </div>
        </div>

        <div id="output" className="bg-gray-800 p-6 rounded-lg hidden">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Output</h3>
            <div id="meta" className="text-sm text-gray-400"></div>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <pre id="result" className="whitespace-pre-wrap"></pre>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Quick Examples</h3>
          <div className="grid gap-2">
            <button onclick="setPrompt('Create a UUID generator')" className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Create a UUID generator
            </button>
            <button onclick="setPrompt('Generate a QR code as SVG')" className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Generate a QR code as SVG
            </button>
            <button onclick="setPrompt('Create a password strength checker')" className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Create a password strength checker
            </button>
            <button onclick="setPrompt('Convert markdown to HTML')" className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              Convert markdown to HTML
            </button>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          function setPrompt(text) {
            document.getElementById('prompt').value = text;
          }

          async function runTool() {
            const prompt = document.getElementById('prompt').value.trim();
            const input = document.getElementById('input').value.trim();
            const force = document.getElementById('force').checked;
            const button = document.getElementById('run');
            const output = document.getElementById('output');
            const result = document.getElementById('result');
            const meta = document.getElementById('meta');

            if (!prompt) {
              alert('Enter a prompt');
              return;
            }

            button.disabled = true;
            button.textContent = 'Running...';
            output.classList.add('hidden');

            try {
              const response = await fetch('/api/tool', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': '${DOGFOOD_API_KEY}'
                },
                body: JSON.stringify({ prompt, input, forceRegenerate: force })
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Request failed');
              }

              // Display output based on type
              if (data.outputType === 'image' && data.output.startsWith('data:image/')) {
                result.innerHTML = '<img src="' + data.output + '" style="max-width: 100%; height: auto;" />';
              } else if (data.outputType === 'svg' || data.output.includes('<svg')) {
                result.innerHTML = data.output;
              } else if (data.outputType === 'html') {
                result.innerHTML = data.output;
              } else if (data.outputType === 'json') {
                try {
                  const formatted = JSON.stringify(JSON.parse(data.output), null, 2);
                  result.textContent = formatted;
                } catch {
                  result.textContent = data.output;
                }
              } else {
                result.textContent = data.output;
              }

              meta.textContent = data.outputType + ' • ' + (data.cached ? 'cached' : 'generated') + ' • ' + data.packages.length + ' packages • ' + data.toolHash;
              output.classList.remove('hidden');

            } catch (error) {
              result.textContent = 'Error: ' + error.message;
              meta.textContent = 'error';
              output.classList.remove('hidden');
            } finally {
              button.disabled = false;
              button.textContent = 'Run';
            }
          }

          // Enter to run
          document.getElementById('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') runTool();
          });
        `}} />
      </div>
    </div>
  );
});

// Compile tool using container
async function compileTool(
  code: string, 
  env: Cloudflare.Env
): Promise<{ 
  bundledCode: string;
  packages: string[] 
}> {
  // Detect development mode properly - if no ENVIRONMENT var, assume production
  const isDev = (env as any).ENVIRONMENT === 'development' || false;
  console.log("isDev", isDev, "ENVIRONMENT:", (env as any).ENVIRONMENT);
  const useLocalhost = isDev;
  console.log("useLocalhost", useLocalhost);

  let response: Response;

  if (useLocalhost) {
    console.log("Using localhost compilation...");
    try {
      response = await fetch('http://localhost:3000/compile', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    if (!env.COMPILER_DO) {
      throw new Error('COMPILER_DO container binding not available');
    }
    console.log("Using container for compilation...", typeof env.COMPILER_DO);
    const container = env.COMPILER_DO.getByName('compiler');
    response = await container.fetch('http://container/compile', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    if(!response.ok) {
      throw new Error(`Compilation failed: ${response.status} - ${await response.text()}`);
    }
    console.log("Container response status:", response.status);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Compilation failed: ${response.status} - ${errorText}`);
  }

  const result = await response.json() as any;
  return {
    bundledCode: result.mainCode,
    packages: result.packages || []
  };
}

// Execute tool using Worker Loaders
async function executeTool(
  bundledCode: string,
  input: string,
  hash: string,
  env: Cloudflare.Env,
  outboundProxy: any
): Promise<{ output: string; contentType: string }> {
  if (!env.LOADER) {
    throw new Error('Worker Loaders not available');
  }

  console.log("Starting executeTool with hash:", hash.substring(0, 8));
  console.log("Code length:", bundledCode.length);
  console.log("Input:", input);

  const isolateId = `tool:${hash}`;

  const workerCode: any = {
    compatibilityDate: "2025-09-27",
    mainModule: "tool.js",
    modules: { "tool.js": bundledCode }
  };

  // Only set globalOutbound if proxy is available
  if (outboundProxy) {
    console.log("Setting globalOutbound proxy");
    workerCode.globalOutbound = outboundProxy;
  }

  console.log("Creating worker with isolateId:", isolateId);
  const worker = env.LOADER.get(isolateId, async () => workerCode);

  console.log("Getting entrypoint");
  const endpoint = worker.getEntrypoint();

  const url = new URL(`http://tool/?q=${encodeURIComponent(input)}`);
  console.log("Fetching from worker:", url.toString());

  try {
    const response = await endpoint.fetch(url.toString());
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    const output = await response.text();
    console.log("Response output length:", output.length);
    console.log("Response output preview:", output.substring(0, 200));

    return {
      output,
      contentType: response.headers.get("content-type") || "text/plain"
    };
  } catch (error) {
    console.error("Worker execution error:", error);
    throw error;
  }
}

// Clear cache endpoint (for development)
app.delete("/api/cache", async (c) => {
  const apiKey = c.req.header('x-api-key');
  if (apiKey !== DOGFOOD_API_KEY) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!c.env.TOOL_CACHE) {
      return Response.json({ message: "No cache configured" });
    }

    const list = await c.env.TOOL_CACHE.list({ prefix: 'tools/' });
    for (const object of list.objects) {
      await c.env.TOOL_CACHE.delete(object.key);
    }

    console.log(`Cleared ${list.objects.length} cached tools`);
    return Response.json({ message: `Cleared ${list.objects.length} tools from cache` });
  } catch (error) {
    console.error("Cache clear error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Compiler Durable Object (same as before)
export class Compiler extends DurableObject<Cloudflare.Env> {
  container: globalThis.Container;

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    this.container = ctx.container!;
    void this.ctx.blockConcurrencyWhile(async () => {
      if (!this.container.running) {
        await this.container.start();
      }
    });
  }

  async fetch(req: Request): Promise<Response> {
    try {
      const url = req.url.replace('https:', 'http:');
      return await this.container.getTcpPort(3000).fetch(url, req);
    } catch (err: any) {
      return new Response(`${this.ctx.id.toString()}: ${err.message}`, { status: 500 });
    }
  }
}

// HistoryStore Durable Object (placeholder for now)
export class HistoryStore extends DurableObject<Cloudflare.Env> {
  async fetch(req: Request): Promise<Response> {
    return new Response("HistoryStore not implemented yet", { status: 200 });
  }
}

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    // Capture exports and attach to env for access in handlers
    const exportsProxy = (ctx as any).exports?.OutboundProxy;
    if (exportsProxy) {
      (env as any).OUTBOUND_PROXY = exportsProxy;
    }
    return app.fetch(request, env, ctx);
  }
};