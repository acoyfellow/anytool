/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { html } from "hono/html";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { DurableObject, DurableObjectState, ExecutionContext, WorkerEntrypoint } from "cloudflare:workers";
import type { Cloudflare } from "cloudflare:workers";
import { examples } from "../shared/examples";

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

// Cloudflare Workers Environment Context
const CF_WORKERS_CONTEXT = `
CLOUDFLARE WORKERS RUNTIME ENVIRONMENT:

AVAILABLE APIS:
- fetch() - HTTP requests (primary network API)
- crypto.subtle - Web Crypto API for encryption/hashing
- TextEncoder/TextDecoder - Text encoding/decoding
- URL, URLSearchParams - URL manipulation
- JSON - JSON parsing/stringification
- Math, Date, RegExp - Standard JavaScript objects
- ArrayBuffer, Uint8Array, etc. - Binary data handling

CONSTRAINTS:
- Memory: 128MB per request, CPU: 50ms limit
- Available: fetch(), crypto.subtle, TextEncoder/TextDecoder, URL, JSON, etc.
- NOT available: Node.js APIs (fs, path, http, etc.), DOM APIs, Canvas
`;

// Known Working Packages Database
const KNOWN_PACKAGES = {
  // ✅ Confirmed Working
  'uuid': {
    works: true,
    usage: 'import { v4 as uuidv4 } from "uuid"',
    example: 'const id = uuidv4();',
    description: 'Generate UUIDs'
  },
  'lodash': {
    works: true,
    usage: 'import _ from "lodash"',
    example: 'const result = _.uniq([1,2,2,3]);',
    description: 'Utility functions'
  },
  'date-fns': {
    works: true,
    usage: 'import { format, addDays } from "date-fns"',
    example: 'const formatted = format(new Date(), "yyyy-MM-dd");',
    description: 'Date manipulation'
  },
  'crypto-js': {
    works: true,
    usage: 'import CryptoJS from "crypto-js"',
    example: 'const hash = CryptoJS.SHA256("text").toString();',
    description: 'Cryptographic functions'
  },
  'marked': {
    works: true,
    usage: 'import { marked } from "marked"',
    example: 'const html = marked("# Hello");',
    description: 'Markdown to HTML'
  },
  'zxcvbn': {
    works: true,
    usage: 'import zxcvbn from "zxcvbn"',
    example: 'const result = zxcvbn("password");',
    description: 'Password strength checking'
  },
  '@faker-js/faker': {
    works: true,
    usage: 'import { faker } from "@faker-js/faker"',
    example: 'const name = faker.person.fullName();',
    description: 'Generate fake data for testing'
  },
  'qrcode-generator': {
    works: true,
    usage: 'import qrcode from "qrcode-generator"',
    example: 'const qr = qrcode(0, "M"); qr.addData("text"); qr.make(); const svg = qr.createSvgTag();',
    description: 'QR code generation (SVG/ASCII only)'
  },

  // ❌ Known Incompatible
  'qrcode': {
    works: false,
    reason: 'Requires canvas/DOM APIs not available in Workers',
    alternative: 'Use qrcode-generator instead'
  },
  'jsonwebtoken': {
    works: false,
    reason: 'Uses Node.js process object not available in Workers',
    alternative: 'Use jose or pure JS JWT libraries'
  },
  'ajv': {
    works: false,
    reason: 'Uses eval/Function constructors blocked by CSP in Workers',
    alternative: 'Use zod for schema validation'
  },
  'sentiment': {
    works: false,
    reason: 'Package API usage issues in Workers environment',
    alternative: 'Use vader-sentiment or implement simple sentiment rules'
  },
  'faker': {
    works: false,
    reason: 'Old package name, use @faker-js/faker instead',
    alternative: 'Use @faker-js/faker package'
  },
  'node-fetch': {
    works: false,
    reason: 'Not needed in Workers, use built-in fetch() instead',
    alternative: 'Use built-in fetch() function available in Workers'
  },
  'sharp': {
    works: false,
    reason: 'Native image processing library, requires Node.js',
    alternative: 'Use Web APIs or pure JS alternatives'
  },
  'puppeteer': {
    works: false,
    reason: 'Browser automation, requires full browser',
    alternative: 'Use fetch() for web scraping'
  },
  'fs-extra': {
    works: false,
    reason: 'File system operations not available',
    alternative: 'Use fetch() for remote data or in-memory operations'
  },
  'express': {
    works: false,
    reason: 'Node.js web framework, use Hono instead',
    alternative: 'Workers use different request/response model'
  }
};

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use(
  "*",
  jsxRenderer(
    ({ children }) => html`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Anytool</title>
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

  let hash: string | undefined;

  try {
    const { prompt, input = "", forceRegenerate = false } = await c.req.json();

    if (!prompt?.trim()) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    // 1. Hash prompt for caching
    hash = await hashPrompt(prompt);
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

    console.log("Relevant docs:", relevantDocs);

    // Build smart prompt with live documentation
    let smartPrompt = `Create a Cloudflare Worker that implements: ${prompt}

${relevantDocs}

${CF_WORKERS_CONTEXT}

WORKING PACKAGE EXAMPLES:
${Object.entries(KNOWN_PACKAGES)
  .filter(([_, info]) => (info as any).works)
  .map(([name, info]) => `- ${name}: ${(info as any).description}\n  Usage: ${(info as any).usage}\n  Example: ${(info as any).example}`)
  .join('\n')}

INCOMPATIBLE PACKAGES (DO NOT USE):
${Object.entries(KNOWN_PACKAGES)
  .filter(([_, info]) => !(info as any).works)
  .map(([name, info]) => `- ${name}: ${(info as any).reason}`)
  .join('\n')}

EXACT CODE FORMAT REQUIRED:
import { something } from 'package-name';

export default {
  fetch(req, env, ctx) {
    try {
      const input = new URL(req.url).searchParams.get('q') || 'default';
      // your implementation here
      return new Response('result', {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response('Error: ' + error.message, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
}

IMPLEMENTATION REQUIREMENTS:
- Must follow EXACT format above (simple object literal export)
- ONLY import packages you ACTUALLY USE - unused imports cause compilation errors
- Use KNOWN WORKING packages from the list above when possible
- If you need a package not in the list, prefer pure JavaScript alternatives
- Write PLAIN JAVASCRIPT (no TypeScript annotations)
- Static imports only at top of file (no dynamic imports, no require())
- Always include try/catch for proper error handling
- Accept input via URL query parameter ?q=INPUT
- Provide sensible defaults for empty input
- Return new Response() with proper Content-Type headers
- For async operations: make fetch function async and await all promises
- NEVER return [object Promise] - always await before returning

OUTPUT TYPE GUIDELINES:
- 'text': Plain text, strings, data URLs (use Content-Type: 'text/plain')
- 'json': JSON objects/arrays (use Content-Type: 'application/json')
- 'html': HTML content (use Content-Type: 'text/html')
- 'svg': SVG markup (use Content-Type: 'image/svg+xml')
- 'image': Base64 data or data URLs for images
- 'csv': CSV data (use Content-Type: 'text/csv')
- 'xml': XML data (use Content-Type: 'application/xml')

Your generated code will be automatically validated by:
1. Package compatibility checking
2. Compilation testing
3. Runtime execution testing
If validation fails, generation will be retried with feedback.

WORKING EXAMPLES:

// Simple sync example:
import { v4 as uuidv4 } from 'uuid';

export default {
  fetch(req, env, ctx) {
    try {
      const uuid = uuidv4();
      return new Response(JSON.stringify({ uuid }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response('Error', { status: 500 });
    }
  }
}

// QR code example with worker-compatible package:
import qrcode from 'qrcode-generator';

export default {
  fetch(req, env, ctx) {
    try {
      const input = new URL(req.url).searchParams.get('q') || 'Hello World';
      const qr = qrcode(0, 'M');
      qr.addData(input);
      qr.make();
      const svgString = qr.createSvgTag(4, 0);
      return new Response(svgString, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    } catch (error) {
      return new Response('Error generating QR code', { status: 500 });
    }
  }
}`;

    // Generate with AI (with retry on failure)
    const openai = createOpenAI({ apiKey: c.env.OPENAI_API_KEY });
    let result: any;
    let compiled: any;
    let retryCount = 0;
    const maxRetries = 0;

    while (retryCount <= maxRetries) {
      try {
        // Generate tool code
        result = await generateObject({
          model: openai("gpt-5-mini"),
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

    // Clear cache for failed tool so it regenerates on next try
    if (c.env.TOOL_CACHE && hash) {
      try {
        await c.env.TOOL_CACHE.delete(`tools/${hash}.json`);
        console.log(`Cleared cache for failed tool: ${hash.substring(0, 8)}`);
      } catch (cacheError) {
        console.warn("Failed to clear cache:", cacheError);
      }
    }

    return Response.json({
      error: `Tool failed: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
});

// Health check
app.get("/health", async (c) => {
  try {
    const compilerDO = c.env.COMPILER_DO.get(c.env.COMPILER_DO.idFromName('compiler'));
    const response = await compilerDO.fetch('http://localhost/_health');

    console.log("Container response status:", response.status);
    console.log("Container response headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("Container response text:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("Container response is not JSON:", responseText);
      result = { rawResponse: responseText };
    }

    return Response.json({
      status: "healthy",
      service: "anytool",
      version: "0.0.1",
      containerPing: result,
      containerStatus: response.status
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json({
      status: "unhealthy",
      service: "anytool",
      version: "0.0.1",
      error: error.message
    }, { status: 500 });
  }
});

// Frontend
app.get("/", async (c) => {
  return c.render(
    <div className="bg-gray-900 text-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Anytool</h1>
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
            {examples.map((example) => (
              <button onclick={`setPrompt('${example}')`} className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                {example}
              </button>
            ))}

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
    const compilerDO = env.COMPILER_DO.get(env.COMPILER_DO.idFromName('compiler'));
    response = await compilerDO.fetch('http://localhost/compile', {
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

// History management routes
app.get("/recent", async (c) => {
  let recent: string[] = [];
  if (c.env.HISTORY_DO) {
    const historyId = c.env.HISTORY_DO.idFromName('history');
    const historyStub = c.env.HISTORY_DO.get(historyId);
    const response = await historyStub.fetch('http://history/list');
    recent = await response.json();
  }

  return c.render(
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Recent Prompts</h1>
          <div className="flex gap-3">
            <button onclick="clearAll()" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
              Clear All
            </button>
            <a href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
              Back to Tool
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-gray-400">No prompts yet. Create some tools first!</p>
          ) : (
            recent.map((prompt, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-lg">
                <button
                  onclick={`loadPrompt('${prompt.replace(/'/g, "\\'")}', event)`}
                  className="w-full text-left text-gray-100 hover:text-blue-400 transition-colors"
                >
                  {prompt}
                </button>
              </div>
            ))
          )}
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          function clearAll() {
            if (confirm('Clear all history?')) {
              fetch('/api/clear-history', { method: 'DELETE' })
                .then(() => location.reload())
                .catch(err => alert('Error: ' + err.message));
            }
          }

          function loadPrompt(prompt, event) {
            event.preventDefault();
            sessionStorage.setItem('loadPrompt', prompt);
            window.location.href = '/';
          }
        `}} />
      </div>
    </div>
  );
});

app.delete("/api/clear-history", async (c) => {
  if (c.env.HISTORY_DO) {
    const historyId = c.env.HISTORY_DO.idFromName('history');
    const historyStub = c.env.HISTORY_DO.get(historyId);
    await historyStub.fetch('http://history/clear', { method: 'DELETE' });
  }
  return Response.json({ message: "History cleared" });
});

// Compiler Durable Object with Container
export class Compiler extends DurableObject<Cloudflare.Env> {
  container: globalThis.Container;

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    this.container = ctx.container!;
    void this.ctx.blockConcurrencyWhile(async () => {
      if (!this.container.running) this.container.start();
    });
  }

  async fetch(req: Request) {
    try {
      return await this.container.getTcpPort(8080).fetch(req.url.replace('https:', 'http:'), req);
    } catch (err) {
      return new Response(`${this.ctx.id.toString()}: ${err.message}`, { status: 500 });
    }
  }
}

// HistoryStore Durable Object
export class HistoryStore extends DurableObject<Cloudflare.Env> {
  async add(prompt: string): Promise<void> {
    if (prompt?.trim()) {
      const history = await this.list();
      // Remove duplicates and add to front
      const updated = [prompt, ...history.filter(p => p !== prompt)].slice(0, 50);
      await this.ctx.storage.put('prompts', updated);
    }
  }

  async list(): Promise<string[]> {
    return (await this.ctx.storage.get<string[]>('prompts')) || [];
  }

  async clear(): Promise<void> {
    await this.ctx.storage.delete('prompts');
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === 'POST' && url.pathname === '/add') {
      const { prompt } = await request.json() as { prompt: string };
      await this.add(prompt);
      return new Response('OK');
    }

    if (method === 'GET' && url.pathname === '/list') {
      const history = await this.list();
      return Response.json(history);
    }

    if (method === 'DELETE' && url.pathname === '/clear') {
      await this.clear();
      return new Response('OK');
    }

    return new Response('Not found', { status: 404 });
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