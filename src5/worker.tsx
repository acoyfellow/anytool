/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jsxRenderer } from 'hono/jsx-renderer'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import BundlerWorker from './bundler-worker'
import { examples } from '../shared/examples'

const DOGFOOD_API_KEY = "anytool-internal-dogfood-key-2024"

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:3000', 'https://anytool.coy', 'https://anytool.vercel.app'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  credentials: true,
}))

app.use(jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <title>Anytool Worker Loader</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}))

app.get('/', (c) => {
  return c.render(
    <div className="bg-gray-900 text-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Anytool v5</h1>
          <p className="text-gray-400">Worker Loader Import Transformation</p>
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

        <script dangerouslySetInnerHTML={{__html: `
          async function runTool() {
            const prompt = document.getElementById('prompt').value.trim();
            const input = document.getElementById('input').value.trim();
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
                body: JSON.stringify({ prompt, input })
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

              meta.textContent = data.outputType + ' • worker-loader • ' + data.packages.length + ' packages';
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

          function setPrompt(text) {
            document.getElementById('prompt').value = text;
          }

          document.getElementById('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') runTool();
          });
        `}} />

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
      </div>
    </div>
  )
})

app.post('/api/tool', async (c) => {
  const apiKey = c.req.header('x-api-key') || c.req.header('authorization')?.replace('Bearer ', '');
  if (!apiKey || apiKey !== DOGFOOD_API_KEY) {
    return c.json({ error: "Invalid or missing API key" }, 401);
  }

  try {
    const { prompt, input = "" } = await c.req.json();

    if (!prompt?.trim()) {
      return c.json({ error: "Missing prompt" }, 400);
    }

    // Generate tool code using AI
    const openai = createOpenAI({ apiKey: c.env.OPENAI_API_KEY });

    const { object: tool } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        code: z.string(),
        outputType: z.enum(['text', 'json', 'html', 'svg', 'image']),
        outputDescription: z.string()
      }),
      prompt: `Create a Cloudflare Worker that implements: ${prompt}

IMPORTANT: Generate completely self-contained code with NO imports. Implement functionality inline.

For common functionality, use these implementations:
- UUID: crypto.randomUUID() (built into Workers)
- Random: Math.random(), crypto.getRandomValues()
- Base64: btoa(), atob()
- Hashing: crypto.subtle.digest()
- JSON: JSON.parse(), JSON.stringify()
- Text: TextEncoder, TextDecoder
- URLs: new URL(), URLSearchParams

REQUIRED FORMAT:
export default {
  fetch(req, env, ctx) {
    const input = new URL(req.url).searchParams.get('q') || '${input}';
    // implementation here - NO IMPORTS
    return new Response(result, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}`
    });

    // AI already generates CDN URLs, no transformation needed
    console.log('Generated code:', tool.code);

    // Spawn new Worker with Worker Loader
    const workerId = `tool-${Date.now()}`;
    console.log('Code being sent to Worker Loader:', JSON.stringify(tool.code));

    const worker = c.env.LOADER.get(workerId, async () => {
      console.log('Inside Worker Loader callback, code:', JSON.stringify(tool.code));

      // Fetch from unpkg which provides the actual built files
      const uuidResponse = await fetch('https://unpkg.com/uuid@9/dist/esm-browser/index.js');
      const uuidCode = await uuidResponse.text();

      return {
        compatibilityDate: "2025-10-01",
        mainModule: "tool.js",
        modules: {
          "tool.js": tool.code.replace('https://esm.sh/uuid', './uuid.js'),
          "uuid.js": uuidCode
        }
      };
    });

    // Execute the tool in the spawned worker
    const testUrl = new URL(`http://localhost/?q=${encodeURIComponent(input)}`);
    const testReq = new Request(testUrl);

    // Use getEntrypoint to access the worker's fetch handler
    const entrypoint = worker.getEntrypoint();
    const response = await entrypoint.fetch(testReq);
    const output = await response.text();

    return c.json({
      output,
      outputType: tool.outputType,
      outputDescription: tool.outputDescription,
      packages: ['uuid'], // hardcode for now since AI handles CDN URLs
      generatedCode: tool.code
    });

  } catch (error) {
    console.error('Tool generation error:', error);
    return c.json({
      error: error.message || 'Tool generation failed'
    }, 500);
  }
})

app.post('/compile', async (c) => {
  try {
    const { code } = await c.req.json()

    if (!code) {
      return c.json({ error: 'No code provided' }, 400)
    }

    // Use worker loader to transform imports
    const bundler = new BundlerWorker()
    const result = await bundler.transformImports(code)

    return c.json({
      mainCode: result.transformedCode,
      additionalModules: {},
      packages: result.packages
    })

  } catch (error) {
    console.error('Compilation error:', error)
    return c.json({
      error: error.message || 'Compilation failed'
    }, 500)
  }
})

export default app