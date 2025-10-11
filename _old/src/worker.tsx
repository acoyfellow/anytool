import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { html } from "hono/html";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";
import type { R2Bucket, Cloudflare } from "cloudflare:workers";
import { marked } from 'marked';

const examples = [
  "Make a UUID generator using the uuid package",
  "Create a markdown to HTML converter using marked",
  "Build a QR code generator that outputs SVG using qrcode-generator package",
  "Make a JWT token decoder that validates claims using jsonwebtoken",
  "Build a password strength meter using zxcvbn that scores passwords",
  "Create a fake person generator using faker.js with name, email, address",
  "Build a live Bitcoin price API to fetch from CoinGecko",
  "Make a URL slug generator using slugify package",
  "Create a password hash checker using bcryptjs",
  "Build a color palette generator using chroma-js for harmonious colors",
  "Make a JSON validator and formatter using ajv schema validation",
  "Create a text sentiment analyzer using sentiment analysis package"
];

// README content (you can replace this with the actual content)
const readmeContent = `# Anytool: Dynamic Tool Generation Pattern

## The Problem

AI applications typically bundle dozens of predefined tools, each consuming context window space. A password checker, QR code generator, CSV parser, and data validator all sit in memory whether used or not. Teams spend weeks implementing and maintaining each tool.

## The Pattern

Generate tools on-demand from natural language descriptions. Compile them once, cache the result, and execute them as needed.

**Traditional Approach:**
- Build 50+ individual tools (UUID generator, QR code maker, password checker, etc.)
- Maintain each tool separately
- All tools consume context window space
- Each tool has fixed functionality

**Dynamic Generation Approach:**
- Build one tool generation endpoint
- AI describes what it needs: "Create a QR code generator that returns SVG"
- Tool is generated, compiled, cached, and executed
- Same prompt = cached response (~50-100ms)
- Tools only exist when needed

## How It Works

### Content Type Detection
The system generates code that returns appropriate content types:

- "Create a QR code generator" → Returns SVG with proper headers
- "Build a password checker" → Returns JSON with strength analysis
- "Make an image resizer" → Returns base64 PNG data
- "Create a CSV parser" → Returns formatted HTML table

### Response Pipeline
For each request:
1. Detects output type from the AI-generated tool (image, json, html, svg, csv, etc.)
2. Sets proper headers in the generated Worker
3. Renders appropriately in the UI (images display, JSON formats, CSV becomes tables)
4. Caches compiled tools so repeat requests are fast

## Quick Start

\`\`\`bash
# Install dependencies
bun install

# Start development server
bun dev

# Visit http://localhost:8787
\`\`\`

## Example Prompts to Try

### **Text & Data Tools**
- "Make a UUID generator using the uuid package"
- "Create a password strength meter using zxcvbn"
- "Build a JWT token decoder that validates claims"
- "Create a markdown to HTML converter using marked"

### **Visual Tools**
- "Create a QR code generator that returns SVG"
- "Build a QR code generator that outputs PNG images"
- "Make a simple chart generator that returns SVG"

### **Data Processing**
- "Create a CSV parser that returns formatted HTML tables"
- "Build a JSON validator and formatter"
- "Make a URL shortener with analytics"`;

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
          <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚙️</text></svg>">

          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
          <style>
            *{
              font-family: "Google Sans Code", monospace;
            }
            .prose h1 {
              font-size: 1.5rem;
              font-weight: bold;
              margin-top: 1.5rem;
              margin-bottom: 1rem;
              color: #ffffff;
            }
            .prose h2 {
              font-size: 1.25rem;
              font-weight: bold;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              color: #60a5fa;
            }
            .prose h3 {
              font-size: 1.125rem;
              font-weight: bold;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              color: #93c5fd;
            }
            .prose p {
              margin-bottom: 0.75rem;
              color: #d1d5db;
            }
            .prose pre {
              background-color: #111827;
              padding: 0.75rem;
              border-radius: 0.375rem;
              overflow-x: auto;
              color: #d1d5db;
            }
            .prose code {
              background-color: #374151;
              padding: 0.125rem 0.25rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
              color: #d1d5db;
            }
            .prose strong {
              color: #ffffff;
              font-weight: bold;
            }
            .prose table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #4b5563;
              margin-top: 1rem;
              margin-bottom: 1rem;
            }
            .prose th, .prose td {
              border: 1px solid #4b5563;
              padding: 0.5rem;
            }
            .prose th {
              background-color: #1f2937;
              font-weight: bold;
              color: #ffffff;
            }
            .prose td {
              color: #d1d5db;
            }
            .prose ul {
              margin-left: 1rem;
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
            }
            .prose li {
              color: #d1d5db;
              margin-bottom: 0.25rem;
            }
            .prose blockquote {
              border-left: 4px solid #4b5563;
              padding-left: 1rem;
              margin: 1rem 0;
              color: #9ca3af;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          ${children}
        </body>
      </html>`
  )
);

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
- Promise, async/await - Asynchronous operations

NOT AVAILABLE (will cause errors):
- Node.js APIs (fs, path, os, process.env, Buffer, etc.)
- DOM APIs (document, window, canvas, etc.)
- Raw TCP/UDP sockets
- File system access
- Child processes
- Native modules/bindings

RUNTIME LIMITS:
- Memory: 128MB per request
- CPU: 50ms execution time
- Response size: 100MB max
- Network: Only via fetch(), no raw sockets

PACKAGE COMPATIBILITY:
- Must be pure JavaScript (no native dependencies)
- Cannot rely on Node.js APIs or DOM
- Should work in V8 isolate environment
- ESM imports only (import/export syntax)
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

// Simple hash function
async function hashPrompt(prompt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(prompt.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Tool interface
interface CachedTool {
  hash: string;
  bundledCode: string;
  createdAt: number;
  packages: string[];
  outputType: string;
  outputDescription: string;
}

// Simple R2 cache
class ToolCache {
  constructor(private r2: R2Bucket) { }

  async get(hash: string): Promise<CachedTool | null> {
    try {
      const object = await this.r2.get(`tools/${hash}.json`);
      if (!object) return null;
      return await object.json() as CachedTool;
    } catch {
      return null;
    }
  }

  async set(hash: string, tool: Omit<CachedTool, 'hash'>): Promise<void> {
    const data: CachedTool = { hash, ...tool };
    await this.r2.put(`tools/${hash}.json`, JSON.stringify(data), {
      httpMetadata: { contentType: 'application/json' }
    });
  }
}

// Compilation via container
async function compileTool(code: string, env: Cloudflare.Env): Promise<{ bundledCode: string; packages: string[] }> {
  console.log("Starting compilation...");

  let response;
  
  // Check environment to determine compilation method
  const isDev = (env as any).ENVIRONMENT === 'development';
  
  if (isDev) {
    console.log("Development mode: using localhost for compilation...");
    response = await fetch('http://localhost:3000/compile', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
  } else {
    console.log("Production mode: using container for compilation...");
    if (!env.BUN_COMPILER_DO) {
      throw new Error('BUN_COMPILER_DO binding not available in production');
    }
    const container = env.BUN_COMPILER_DO.getByName("compiler");
    response = await container.fetch('http://container/compile', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Compilation failed:", response.status, errorText);
    try {
      const error = JSON.parse(errorText);
      throw new Error(error.error || `Compilation failed: ${response.status}`);
    } catch (jsonError) {
      throw new Error(`Compilation failed: ${response.status} - ${errorText}`);
    }
  }

  const responseText = await response.text();
  console.log("Compilation response:", responseText.substring(0, 200));

  try {
    const result = JSON.parse(responseText);
    return {
      bundledCode: result.mainCode,
      packages: result.packages || []
    };
  } catch (jsonError) {
    console.error("Failed to parse compilation response as JSON:", responseText.substring(0, 200));
    throw new Error(`Invalid JSON response from compiler: ${responseText.substring(0, 100)}`);
  }
}

// Code Validation Pipeline
async function validateGeneratedCode(
  code: string,
  testInput: string,
  hash: string,
  env: Cloudflare.Env
): Promise<{ valid: boolean; error?: string; result?: any }> {
  try {
    console.log(`Validating generated code for hash: ${hash.substring(0, 8)}`);

    // Step 1: Test compilation
    const compiled = await compileTool(code, env);

    // Step 2: Test execution with sample input
    const result = await executeTool(compiled.bundledCode, testInput, `${hash}-validation`, env, undefined);

    // Step 3: Check if result looks valid (not an error message)
    if (result.output.toLowerCase().includes('error') && result.contentType.includes('text')) {
      throw new Error(`Generated code produces error output: ${result.output}`);
    }

    // Step 4: Basic output validation
    if (!result.output || result.output.trim().length === 0) {
      throw new Error('Generated code produces empty output');
    }

    // Step 5: Content type validation
    // Check for obvious content-type mismatches
    if (result.output.startsWith('<svg')) {
      // SVG content should have SVG content type
      if (!result.contentType.includes('image/svg') && !result.contentType.includes('text/plain')) {
        throw new Error(`SVG output detected but content-type is '${result.contentType}', expected 'image/svg+xml'`);
      }
    } else if (result.output.startsWith('data:image/png')) {
      // PNG data URL should have appropriate content type
      if (!result.contentType.includes('image/png') && !result.contentType.includes('text/plain')) {
        throw new Error(`PNG data URL detected but content-type is '${result.contentType}', expected 'image/png' or 'text/plain'`);
      }
    } else if (result.output.startsWith('data:image/')) {
      // Other image data URLs should use text/plain or matching content type
      const dataUrlType = result.output.match(/^data:([^;]+)/)?.[1];
      if (dataUrlType && !result.contentType.includes(dataUrlType) && !result.contentType.includes('text/plain')) {
        throw new Error(`Data URL type '${dataUrlType}' doesn't match content-type '${result.contentType}'`);
      }
    } else if (result.output.startsWith('<html') || result.output.includes('</html>')) {
      // HTML content should have HTML content type
      if (!result.contentType.includes('text/html')) {
        throw new Error(`HTML output detected but content-type is '${result.contentType}', expected 'text/html'`);
      }
    } else if (result.output.startsWith('{') || result.output.startsWith('[')) {
      // JSON content should have JSON content type
      try {
        JSON.parse(result.output);
        if (!result.contentType.includes('application/json')) {
          throw new Error(`JSON output detected but content-type is '${result.contentType}', expected 'application/json'`);
        }
      } catch {
        // Not valid JSON, ignore
      }
    }

    console.log(`Code validation successful for hash: ${hash.substring(0, 8)}`);
    return { valid: true, result };

  } catch (error) {
    console.error(`Code validation failed for hash: ${hash.substring(0, 8)}:`, error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Package Compatibility Checker
function checkPackageCompatibility(packages: string[]): { compatible: string[]; incompatible: string[]; warnings: string[] } {
  const compatible: string[] = [];
  const incompatible: string[] = [];
  const warnings: string[] = [];

  for (const pkg of packages) {
    const known = KNOWN_PACKAGES[pkg];
    if (known) {
      if (known.works) {
        compatible.push(pkg);
      } else {
        incompatible.push(pkg);
        warnings.push(`Package '${pkg}' is incompatible: ${known.reason}${known.alternative ? `. Alternative: ${known.alternative}` : ''}`);
      }
    } else {
      // Unknown package - add warning but allow it
      compatible.push(pkg);
      warnings.push(`Package '${pkg}' compatibility unknown - proceeding with caution`);
    }
  }

  return { compatible, incompatible, warnings };
}

// Execute tool using Worker Loaders
async function executeTool(
  bundledCode: string, 
  input: string, 
  hash: string, 
  env: Cloudflare.Env,
  outboundProxy: any
): Promise<{ 
  output: string; 
  contentType: string;
}> {
  if (!env.LOADER) {
    throw new Error('Worker Loaders not available');
  }

  const isolateId = `tool:${hash}`;

  const workerCode: any = {
    compatibilityDate: "2025-09-27",
    mainModule: "tool.js",
    modules: {
      "tool.js": bundledCode
    }
  };
  
  // Only set globalOutbound if proxy is available
  if (outboundProxy) {
    workerCode.globalOutbound = outboundProxy;
  }

  const worker = env.LOADER.get(isolateId, async () => workerCode);

  const endpoint = worker.getEntrypoint();
  const url = new URL(`http://tool/?q=${encodeURIComponent(input)}`);
  const response = await endpoint.fetch(url.toString());
  const output = await response.text();
  const contentType = response.headers.get("content-type") || "text/plain";

  return { output, contentType };
}

// History Durable Object
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


// Main API endpoint: Generate and Execute
app.post("/api/tool", async (c) => {
  let hash = "(null)";
  let tool = null;
  try {
    const { prompt, input = "", forceRegenerate = false } = await c.req.json();

    if (!prompt?.trim()) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    // 1. Hash prompt and store in history
    hash = await hashPrompt(prompt);
    if (c.env.HISTORY_DO) {
      const historyId = c.env.HISTORY_DO.idFromName('history');
      const historyStub = c.env.HISTORY_DO.get(historyId);
      await historyStub.fetch('http://history/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
    }
    console.log(`Tool request: ${hash.substring(0, 8)}`);

    // 2. Check cache (unless forcing regeneration)
    const cache = new ToolCache(c.env.TOOL_CACHE);
    tool = forceRegenerate ? null : await cache.get(hash);

    if (forceRegenerate && tool) {
      console.log("Force regeneration - clearing cached tool");
      await c.env.TOOL_CACHE.delete(`tools/${hash}.json`);
      tool = null;
    }

    if (!tool) {
      console.log("Cache miss - generating tool");

      // 3. Generate code with AI
      if (!c.env.OPENAI_API_KEY) {
        return Response.json({ error: "OpenAI API key not configured" }, { status: 500 });
      }

      const openai = createOpenAI({ apiKey: c.env.OPENAI_API_KEY });

      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
          typescript: z.string().describe("Complete Cloudflare Worker code that implements the requested functionality"),
          example: z.string().describe("ONLY the parameter value that goes into ?q=VALUE - NOT a full URL. Example: 'usd' not 'https://example.com/?q=usd'"),
          outputType: z.enum(['text', 'json', 'html', 'image', 'svg', 'csv', 'xml']).describe("Expected output content type from this tool"),
          outputDescription: z.string().describe("Brief description of what the output contains (e.g., 'Base64-encoded PNG image', 'HTML with embedded QR code', 'JSON with UUID')")
        }),
        prompt: `Create a Cloudflare Worker that implements: ${prompt}

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
import qrcode from 'qr-code-generator';

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
}`
      });

      // 4. Check package compatibility
      const packageCheck = checkPackageCompatibility(
        result.object.typescript.match(/from\s+['\"`]([^'\"`\s]+)['\"`]/g)?.map(match =>
          match.match(/from\s+['\"`]([^'\"`\s]+)['\"`]/)?.[1]
        ).filter(Boolean) || []
      );

      if (packageCheck.warnings.length > 0) {
        console.warn("Package compatibility warnings:", packageCheck.warnings);
      }

      if (packageCheck.incompatible.length > 0) {
        throw new Error(`Incompatible packages detected: ${packageCheck.incompatible.join(', ')}. ${packageCheck.warnings.join(' ')}`);
      }

      // 5. Compile code
      const compiled = await compileTool(result.object.typescript, c.env);

      // 6. Validate generated code with test execution
      const validation = await validateGeneratedCode(
        result.object.typescript,
        result.object.example || "test",
        hash,
        c.env
      );

      if (!validation.valid) {
        console.error(`Generated code validation failed: ${validation.error}`);
        throw new Error(`Generated code validation failed: ${validation.error}`);
      }

      // 7. Cache validated tool
      tool = {
        hash,
        bundledCode: compiled.bundledCode,
        createdAt: Date.now(),
        packages: compiled.packages,
        outputType: result.object.outputType,
        outputDescription: result.object.outputDescription,
        validated: true,
        validationResult: validation.result
      };

      await cache.set(hash, tool);
      console.log(`Cached validated tool: ${hash.substring(0, 8)} with ${tool.packages.length} packages`);
    } else {
      console.log("Cache hit - using cached tool");
    }

    // 6. Execute tool
    console.log("Executing tool with hash:", hash.substring(0, 8));
    const outboundProxy = (c.env as any).OUTBOUND_PROXY 
      ? (c.env as any).OUTBOUND_PROXY({ props: { toolId: hash.substring(0, 8) } })
      : undefined; // undefined = inherit parent's network access
    const result = await executeTool(tool.bundledCode, input, hash, c.env, outboundProxy);
    console.log("Tool execution completed successfully");

    return Response.json({
      output: result.output,
      contentType: result.contentType,
      outputType: tool.outputType,
      outputDescription: tool.outputDescription,
      toolHash: hash.substring(0, 255),
      packages: tool.packages,
      cached: !!tool,
      generatedCode: tool.bundledCode
    });

  } catch (error) {
    console.error("Tool execution error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Detailed error:", {
      message: errorMessage,
      hash: hash?.substring(0, 8),
      hasCode: !!tool?.bundledCode,
      packages: tool?.packages || []
    });
    return Response.json({
      error: `Tool failed: ${errorMessage}`,
      details: {
        hash: hash?.substring(0, 8),
        packages: tool?.packages || [],
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
});

// History endpoints
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

// Serve the HTML interface
app.get("/", async (c) => {
  const _html = await marked(readmeContent, {
    breaks: true,
  });
  return c.render(
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold block">Anytool</h1>
        <p className="text-gray-400 block">Generate tools on-demand from natural language</p>
        <a href="https://github.com/acoyfellow/anytool" className="inline-block text-blue-400 hover:text-blue-300 underline">Github</a>
        
        <details className="mb-6 p-4 bg-gray-800 rounded-lg">
          <summary className="cursor-pointer text-blue-400 font-semibold hover:text-blue-300">
            Learn More
          </summary>
          <div
            className="mt-4 prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: _html
            }}
          />
        </details>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Describe your tool:</label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Create a tool that converts markdown to HTML using the marked package"
            />

            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <input
                  id="input"
                  type="text"
                  className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Test input (optional)"
                />
                <button
                  id="execute"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium"
                  onclick="executeTool()"
                >
                  »
                </button>
              </div>
              <div className="flex gap-2 text-sm flex-col md:flex-row">
                <label className="flex items-center gap-2">
                  <input type="checkbox" id="forceRegenerate" className="rounded" />
                  <span>Force regenerate (bypass cache)</span>
                </label>
                <a href="/recent" className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm">
                  History
                </a>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div id="output" className="bg-gray-800 p-6 rounded-lg hidden">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Output</h3>
              <div id="meta" className="text-sm text-gray-400 block"></div>
            </div>
            <div className="grid gap-4">
              <div className="bg-gray-900 p-4 rounded overflow-auto">
                <div className="text-xs text-gray-400 mb-2">Result:</div>
                <pre id="result" className="whitespace-pre-wrap"></pre>
              </div>
              <div id="generatedCodeSection" className="bg-gray-900 p-4 rounded overflow-auto hidden">
                <div className="text-xs text-gray-400 mb-2">Generated Worker Code:</div>
                <pre id="generatedCode" className="whitespace-pre-wrap text-green-400 text-xs max-h-60 overflow-auto"></pre>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Example Tools</h3>
            <div className="grid gap-2">
              {examples.map((prompt) => <button 
                onclick={`setPrompt('${prompt}')`} 
                className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                {prompt}
              </button>)}
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          function setPrompt(text) {
            document.getElementById('prompt').value = text;
          }

          function displayOutput(container, output, outputType) {
            container.innerHTML = ''; // Clear previous content

            switch(outputType) {
              case 'image':
                if (output.startsWith('data:image/') || output.startsWith('http')) {
                  const img = document.createElement('img');
                  img.src = output;
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                  container.appendChild(img);
                } else if (output.includes('<svg') || output.includes('<?xml')) {
                  // Handle SVG content returned as image
                  container.innerHTML = output;
                } else {
                  // Try to create data URL from base64
                  const img = document.createElement('img');
                  img.src = \`data:image/png;base64,\${output}\`;
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                  container.appendChild(img);
                }
                break;

              case 'html':
                container.innerHTML = output;
                break;

              case 'svg':
                container.innerHTML = output;
                break;

              case 'json':
                try {
                  const formatted = JSON.stringify(JSON.parse(output), null, 2);
                  container.textContent = formatted;
                } catch {
                  container.textContent = output;
                }
                break;

              case 'csv':
                // Create a simple table for CSV
                const lines = output.split('\\n').filter(line => line.trim());
                if (lines.length > 0) {
                  const table = document.createElement('table');
                  table.className = 'w-full border-collapse border border-gray-600';

                  lines.forEach((line, index) => {
                    const row = document.createElement('tr');
                    const cells = line.split(',');

                    cells.forEach(cell => {
                      const cellElement = document.createElement(index === 0 ? 'th' : 'td');
                      cellElement.className = 'border border-gray-600 px-2 py-1 text-left';
                      cellElement.textContent = cell.trim();
                      row.appendChild(cellElement);
                    });

                    table.appendChild(row);
                  });

                  container.appendChild(table);
                } else {
                  container.textContent = output;
                }
                break;

              case 'text':
              default:
                // Check if text output is actually a data URL (common for images returned as text)
                if (output.startsWith('data:image/')) {
                  const img = document.createElement('img');
                  img.src = output;
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                  container.appendChild(img);
                } else {
                  container.textContent = output;
                }
            }
          }

          async function executeTool() {
            const prompt = document.getElementById('prompt').value.trim();
            const input = document.getElementById('input').value.trim();
            const forceRegenerate = document.getElementById('forceRegenerate').checked;
            const button = document.getElementById('execute');
            const output = document.getElementById('output');
            const result = document.getElementById('result');
            const meta = document.getElementById('meta');
            const generatedCode = document.getElementById('generatedCode');
            const generatedCodeSection = document.getElementById('generatedCodeSection');

            if (!prompt) {
              alert('Please describe your tool');
              return;
            }

            // Update UI
            button.disabled = true;
            button.textContent = 'Executing...';
            output.classList.add('hidden');

            try {
              const response = await fetch('/api/tool', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, input, forceRegenerate })
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Request failed');
              }

              // Show results based on output type
              displayOutput(result, data.output, data.outputType);
              meta.textContent = \`\${data.outputType} • \${data.outputDescription} • \${data.packages.length} packages • \${data.cached ? 'cached' : 'compiled'} • \${data.toolHash}\`;

              // Show generated code if available
              if (data.generatedCode) {
                generatedCode.textContent = data.generatedCode;
                generatedCodeSection.classList.remove('hidden');
              } else {
                generatedCodeSection.classList.add('hidden');
              }

              output.classList.remove('hidden');

            } catch (error) {
              result.textContent = \`Error: \${error.message}\`;
              meta.textContent = 'error';
              generatedCodeSection.classList.add('hidden');
              output.classList.remove('hidden');
            } finally {
              button.disabled = false;
              button.textContent = '»';
            }
          }

          // Allow Enter to execute
          document.getElementById('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeTool();
          });

          // Load prompt from session storage (from history page)
          const loadPrompt = sessionStorage.getItem('loadPrompt');
          if (loadPrompt) {
            document.getElementById('prompt').value = loadPrompt;
            sessionStorage.removeItem('loadPrompt');
          }
        `}} />
      </div>
    </div>
  );
});

// Container ping for debugging
app.get("/ping-container", async (c) => {
  try {
    if (!c.env.BUN_COMPILER_DO) {
      return Response.json({ error: "BUN_COMPILER_DO not available" }, { status: 500 });
    }
    const container = c.env.BUN_COMPILER_DO.get(c.env.BUN_COMPILER_DO.idFromName('compiler'));
    const response = await container.fetch('http://container/ping');
    const result = await response.text();
    return new Response(result, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Container ping error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// NPM Search API
app.post("/api/npm-search", async (c) => {
  try {
    const { query } = await c.req.json();
    if (!query?.trim()) {
      return Response.json({ error: "Missing search query" }, { status: 400 });
    }

    const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`);
    if (!response.ok) {
      throw new Error(`NPM search failed: ${response.status}`);
    }

    const data = await response.json();
    const packages = data.objects.map(pkg => ({
      name: pkg.package.name,
      description: pkg.package.description,
      version: pkg.package.version,
      keywords: pkg.package.keywords || [],
      downloadCount: pkg.score.detail.popularity,
      quality: pkg.score.detail.quality,
      maintenance: pkg.score.detail.maintenance
    }));

    return Response.json({ packages });
  } catch (error) {
    console.error("NPM search error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Clear cache endpoint
app.delete("/api/cache/:hash?", async (c) => {
  try {
    const hash = c.req.param('hash');
    const cache = new ToolCache(c.env.TOOL_CACHE);

    if (hash) {
      // Clear specific tool
      await c.env.TOOL_CACHE.delete(`tools/${hash}.json`);
      console.log(`Cleared cache for hash: ${hash}`);
      return Response.json({ message: `Cache cleared for ${hash}` });
    } else {
      // Clear all cache
      const list = await c.env.TOOL_CACHE.list({ prefix: 'tools/' });
      for (const object of list.objects) {
        await c.env.TOOL_CACHE.delete(object.key);
      }
      console.log(`Cleared all cache (${list.objects.length} items)`);
      return Response.json({ message: `Cleared all cache (${list.objects.length} items)` });
    }
  } catch (error) {
    console.error("Cache clear error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// List cache endpoint
app.get("/api/cache", async (c) => {
  try {
    const list = await c.env.TOOL_CACHE.list({ prefix: 'tools/' });
    const items = [];

    for (const object of list.objects.slice(0, 50)) { // Limit to 50 items
      try {
        const cached = await c.env.TOOL_CACHE.get(object.key);
        if (cached) {
          const data = await cached.json() as any;
          items.push({
            hash: data.hash?.substring(0, 8) || 'unknown',
            packages: data.packages || [],
            createdAt: data.createdAt,
            size: object.size
          });
        }
      } catch (e) {
        // Skip invalid cache entries
      }
    }

    return Response.json({
      total: list.objects.length,
      items: items.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    console.error("Cache list error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// BunCompiler Durable Object with container
export class BunCompiler extends DurableObject<Cloudflare.Env> {
  container: globalThis.Container;

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    this.container = ctx.container!;
    void this.ctx.blockConcurrencyWhile(async () => {
      if (!this.container.running) {
        this.container.start();
      }
    });
  }

  async fetch(req: Request): Promise<Response> {
    try {
      return await this.container.getTcpPort(3000).fetch(req.url.replace('https:', 'http:'), req);
    } catch (err: any) {
      return new Response(`${this.ctx.id.toString()}: ${err.message}`, { status: 500 });
    }
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