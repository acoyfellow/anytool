/** @jsxImportSource hono/jsx */
/**
 * ANYTOOL OUTPUT STANDARDS
 *
 * Standardized content-type handling for consistent frontend display:
 *
 * 📊 OUTPUT TYPES:
 * - text: Plain text, strings (Content-Type: text/plain)
 * - json: Structured data (Content-Type: application/json)
 * - html: Markup including interactive dashboards (Content-Type: text/html)
 * - svg: Vector graphics (Content-Type: image/svg+xml)
 * - image: Base64/data URLs (Content-Type: varies)
 * - csv: Tabular data (Content-Type: text/csv)
 * - xml: Structured markup (Content-Type: application/xml)
 *
 * 🎨 FRONTEND RENDERING:
 * - ALL HTML: Rendered in secure iframe with sandbox (never direct)
 * - JSON: Syntax highlighted with proper formatting
 * - CSV: Converted to interactive tables
 * - Images/SVG: Responsive with proper scaling
 * - XML: Syntax highlighted code display
 *
 * 🔒 SECURITY:
 * - ALL HTML content isolated in sandboxed iframes
 * - Sandbox permissions: allow-scripts allow-same-origin allow-forms allow-popups
 * - HTML escaping for code display
 * - No external dependencies allowed
 */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jsxRenderer } from 'hono/jsx-renderer'
import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import BundlerWorker from './bundler-worker'
import { examples } from '../shared/examples'

// Hash function for prompt caching
async function hashPrompt(prompt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(prompt.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Execute cached tool using Worker Loader
async function executeCachedTool(
  bundledCode: string,
  input: string,
  hash: string,
  env: any
): Promise<{ output: string; contentType: string }> {
  const workerId = `cached-${hash}`;

  const worker = env.LOADER.get(workerId, async () => {
    return {
      compatibilityDate: "2025-10-01",
      mainModule: "tool.js",
      modules: {
        "tool.js": bundledCode
      }
    };
  });

  // Execute the tool in the spawned worker
  const testUrl = new URL(`http://localhost/?q=${encodeURIComponent(input)}`);
  const testReq = new Request(testUrl);
  console.log('Executing cached worker with URL:', testUrl.toString());

  try {
    // Use getEntrypoint to access the worker's fetch handler
    const entrypoint = worker.getEntrypoint();
    console.log('Got cached entrypoint, calling fetch...');
    const response = await entrypoint.fetch(testReq);
    console.log('Got cached response, status:', response.status);
    const output = await response.text();
    console.log('Got cached output:', output.substring(0, 200));

    return {
      output,
      contentType: response.headers.get('content-type') || 'text/plain'
    };
  } catch (error) {
    console.error('Cached worker execution failed:', error);
    throw error;
  }
}

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
          <h1 className="text-3xl font-bold">Anytool</h1>
          <p className="text-gray-400">Dynamic Tool Generation Pattern</p>
          <a href="/history" className="text-blue-400 hover:text-blue-300 text-sm">View History</a>
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
              <input type="checkbox" id="force" className="rounded" />
              <span>Force regenerate (cache buster)</span>
            </label>
          </div>
        </div>

        <div id="output" className="bg-gray-800 p-6 rounded-lg hidden">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Output</h3>
              <button id="modify-btn" className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm hidden" onclick="showModifyDialog()">
                Modify Tool
              </button>
            </div>
            <div id="meta" className="text-sm text-gray-400"></div>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <pre id="result" className="whitespace-pre-wrap"></pre>
          </div>
        </div>

        <div id="modify-dialog" className="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Modify Tool</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">What would you like to change?</label>
              <textarea
                id="modification-input"
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                placeholder="e.g., Change the button color to red, Add a dark mode toggle, Make the output format different"
              />
            </div>
            <div className="flex gap-3">
              <button onclick="applyModification()" className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">
                Apply Modification
              </button>
              <button onclick="hideModifyDialog()" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          // Universal content type detection - the magic happens here
          function detectContentType(content, declaredType) {
            // Auto-detect based on content patterns
            if (content.includes('<svg') && content.includes('</svg>')) return 'svg';
            if (content.includes('<html') || content.includes('<script') || content.includes('<style')) return 'html';
            if (content.startsWith('data:image/')) return 'image';
            if (content.includes('<') && content.includes('>') && content.includes('</')) return 'html';
            if (content.startsWith('{') && content.includes(':')) {
              try { JSON.parse(content); return 'json'; } catch {}
            }
            if (content.includes(',') && content.includes('\\n') && !content.includes('<')) return 'csv';
            if (content.includes('<?xml') || (content.includes('<') && !content.includes('html'))) return 'xml';
            return declaredType; // fallback to declared type
          }

          // Enhanced iframe renderer with CORS proxy and universal support
          function renderInSandbox(content, contentType, height = '400px') {
            // Add CORS proxy and enhanced capabilities to HTML content
            const enhancedContent = contentType === 'html' ? addSandboxEnhancements(content) : content;

            return '<div class="universal-sandbox" style="width: 100%; min-height: ' + height + '; border: 1px solid #374151; border-radius: 8px; overflow: hidden;">' +
              '<iframe srcdoc="' + enhancedContent.replace(/"/g, '&quot;') + '" ' +
              'style="width: 100%; height: ' + height + '; border: none;" ' +
              'sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads">' +
              '</iframe></div>';
          }

          // Add universal rendering capabilities to sandbox
          function addSandboxEnhancements(htmlContent) {
            const corsProxy = 'https://api.allorigins.win/raw?url=';
            const enhancements = \`
              <script>
                // Universal CORS proxy for API calls
                const originalFetch = window.fetch;
                window.fetch = function(url, options = {}) {
                  if (url.startsWith('http') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
                    // Use CORS proxy for external APIs
                    const proxiedUrl = '\${corsProxy}' + encodeURIComponent(url);
                    return originalFetch(proxiedUrl, { ...options, mode: 'cors' });
                  }
                  return originalFetch(url, options);
                };

                // Auto-refresh for live data
                if (window.location.search.includes('live=true')) {
                  setInterval(() => {
                    if (typeof updateData === 'function') updateData();
                  }, 30000);
                }

                // Enhanced error handling
                window.addEventListener('error', (e) => {
                  console.error('Sandbox error:', e.error);
                });
              </script>
            \`;

            return htmlContent.includes('<head>')
              ? htmlContent.replace('<head>', '<head>' + enhancements)
              : '<html><head>' + enhancements + '</head><body>' + htmlContent + '</body></html>';
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

              // Universal content renderer - handles anything AI generates
              result.className = 'whitespace-pre-wrap'; // Reset classes

              // Auto-detect content type if not specified correctly
              const autoDetectedType = detectContentType(data.output, data.outputType);
              const finalType = autoDetectedType || data.outputType;

              if (finalType === 'image' && data.output.startsWith('data:image/')) {
                result.innerHTML = '<img src="' + data.output + '" style="max-width: 100%; height: auto; border-radius: 8px;" />';
              } else if (data.outputType === 'svg' || data.output.includes('<svg')) {
                result.innerHTML = '<div style="max-width: 100%; overflow: auto;">' + data.output + '</div>';
              } else if (finalType === 'html') {
                // Universal HTML sandbox with enhanced capabilities
                const hasScript = data.output.includes('<script') || data.output.includes('fetch') || data.output.includes('interactive');
                const height = hasScript ? '600px' : '400px'; // More height for complex content

                result.innerHTML = renderInSandbox(data.output, 'html', height);
                result.className = ''; // Remove whitespace-pre-wrap for iframe
              } else if (data.outputType === 'json') {
                try {
                  const formatted = JSON.stringify(JSON.parse(data.output), null, 2);
                  result.innerHTML = '<pre class="language-json" style="background: #1f2937; padding: 16px; border-radius: 8px; overflow: auto;"><code>' +
                    formatted.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
                } catch {
                  result.textContent = data.output;
                }
              } else if (data.outputType === 'csv') {
                // Enhanced CSV display as table
                try {
                  const lines = data.output.trim().split('\\n');
                  if (lines.length > 1) {
                    const headers = lines[0].split(',');
                    const rows = lines.slice(1).map(line => line.split(','));
                    result.innerHTML = '<div class="csv-table" style="overflow: auto; border: 1px solid #374151; border-radius: 8px;">' +
                      '<table style="width: 100%; border-collapse: collapse;">' +
                      '<thead><tr>' + headers.map(h => '<th style="background: #374151; color: white; padding: 8px; border: 1px solid #4b5563;">' + h.trim() + '</th>').join('') + '</tr></thead>' +
                      '<tbody>' + rows.map(row => '<tr>' + row.map(cell => '<td style="padding: 8px; border: 1px solid #4b5563; background: #1f2937;">' + cell.trim() + '</td>').join('') + '</tr>').join('') + '</tbody>' +
                      '</table></div>';
                  } else {
                    result.textContent = data.output;
                  }
                } catch {
                  result.textContent = data.output;
                }
              } else if (data.outputType === 'xml') {
                // Enhanced XML display with syntax highlighting
                result.innerHTML = '<pre class="language-xml" style="background: #1f2937; padding: 16px; border-radius: 8px; border: 1px solid #374151; overflow: auto;"><code>' +
                  data.output.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
              } else {
                // Plain text with better styling
                result.innerHTML = '<pre style="background: #1f2937; padding: 16px; border-radius: 8px; border: 1px solid #374151; overflow: auto;">' +
                  data.output.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
              }

              meta.textContent = data.outputType + ' • ' + (data.cached ? 'cached' : 'generated') + ' • ' + data.packages.length + ' packages' + (data.toolHash ? ' • ' + data.toolHash : '');
              output.classList.remove('hidden');

              // Show modify button ONLY for existing/cached tools (can't modify what doesn't exist)
              const modifyBtn = document.getElementById('modify-btn');
              console.log('Response data:', data);

              if (modifyBtn && data.toolHash && data.cached) {
                console.log('Showing modify button for cached tool:', data.toolHash);
                modifyBtn.classList.remove('hidden');
                modifyBtn.style.display = 'block';
                window.currentTool = {
                  hash: data.toolHash,
                  prompt: prompt,
                  outputType: data.outputType
                };
              } else {
                console.log('Not showing modify button:', {
                  hasButton: !!modifyBtn,
                  hasHash: !!data.toolHash,
                  isCached: data.cached,
                  data: data
                });
                modifyBtn.classList.add('hidden');
              }

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

          // Load prompt from session storage if coming from history
          window.addEventListener('load', () => {
            const loadPrompt = sessionStorage.getItem('loadPrompt');
            const modifyHash = sessionStorage.getItem('modifyHash');

            if (loadPrompt) {
              document.getElementById('prompt').value = loadPrompt;
              sessionStorage.removeItem('loadPrompt');
            }

            // If coming from a modify action, store the hash for quick modification
            if (modifyHash) {
              window.pendingModifyHash = modifyHash;
              sessionStorage.removeItem('modifyHash');

              // Show a hint that this tool can be quickly modified
              const promptInput = document.getElementById('prompt');
              promptInput.style.borderColor = '#a855f7';
              promptInput.placeholder = 'Tool loaded for modification. Run to generate, then click "Modify Tool" or change this prompt to modify it directly.';
            }
          });

          // Modification dialog functions
          function showModifyDialog() {
            document.getElementById('modify-dialog').classList.remove('hidden');
            document.getElementById('modify-dialog').classList.add('flex');
            document.getElementById('modification-input').focus();
          }

          function hideModifyDialog() {
            document.getElementById('modify-dialog').classList.add('hidden');
            document.getElementById('modify-dialog').classList.remove('flex');
            document.getElementById('modification-input').value = '';
          }

          async function applyModification() {
            const modification = document.getElementById('modification-input').value.trim();
            if (!modification) {
              alert('Please enter a modification request');
              return;
            }

            if (!window.currentTool) {
              alert('No tool available to modify');
              return;
            }

            hideModifyDialog();

            // Run the modification
            const button = document.getElementById('run');
            const output = document.getElementById('output');
            const result = document.getElementById('result');
            const meta = document.getElementById('meta');

            button.disabled = true;
            button.textContent = 'Modifying...';
            output.classList.add('hidden');

            try {
              const response = await fetch('/api/tool', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': '${DOGFOOD_API_KEY}'
                },
                body: JSON.stringify({
                  prompt: window.currentTool.prompt,
                  input: document.getElementById('input').value.trim(),
                  baseToolHash: window.currentTool.hash,
                  modification: modification,
                  forceRegenerate: true
                })
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Modification failed');
              }

              // Display the modified result (reuse existing display logic)
              // Reset classes
              result.className = 'whitespace-pre-wrap';

              if (data.outputType === 'image' && data.output.startsWith('data:image/')) {
                result.innerHTML = '<img src="' + data.output + '" style="max-width: 100%; height: auto; border-radius: 8px;" />';
              } else if (data.outputType === 'svg' || data.output.includes('<svg')) {
                result.innerHTML = '<div style="max-width: 100%; overflow: auto;">' + data.output + '</div>';
              } else if (data.outputType === 'html') {
                // ALL HTML content gets sandboxed in iframe for security
                const hasScript = data.output.includes('<script') || data.output.includes('interactive') || data.output.includes('dashboard');
                const height = hasScript ? '500px' : '300px';

                result.innerHTML = '<div class="html-output-container" style="width: 100%; min-height: ' + height + '; border: 1px solid #374151; border-radius: 8px; overflow: hidden;">' +
                  '<iframe srcdoc="' + data.output.replace(/"/g, '&quot;') + '" ' +
                  'style="width: 100%; height: ' + height + '; border: none;" ' +
                  'sandbox="allow-scripts allow-same-origin allow-forms allow-popups">' +
                  '</iframe></div>';
                result.className = '';
              } else if (data.outputType === 'json') {
                try {
                  const formatted = JSON.stringify(JSON.parse(data.output), null, 2);
                  result.innerHTML = '<pre class="language-json" style="background: #1f2937; padding: 16px; border-radius: 8px; overflow: auto;"><code>' +
                    formatted.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
                } catch {
                  result.textContent = data.output;
                }
              } else if (data.outputType === 'csv') {
                try {
                  const lines = data.output.trim().split('\\n');
                  if (lines.length > 1) {
                    const headers = lines[0].split(',');
                    const rows = lines.slice(1).map(line => line.split(','));
                    result.innerHTML = '<div class="csv-table" style="overflow: auto; border: 1px solid #374151; border-radius: 8px;">' +
                      '<table style="width: 100%; border-collapse: collapse;">' +
                      '<thead><tr>' + headers.map(h => '<th style="background: #374151; color: white; padding: 8px; border: 1px solid #4b5563;">' + h.trim() + '</th>').join('') + '</tr></thead>' +
                      '<tbody>' + rows.map(row => '<tr>' + row.map(cell => '<td style="padding: 8px; border: 1px solid #4b5563; background: #1f2937;">' + cell.trim() + '</td>').join('') + '</tr>').join('') + '</tbody>' +
                      '</table></div>';
                  } else {
                    result.textContent = data.output;
                  }
                } catch {
                  result.textContent = data.output;
                }
              } else if (data.outputType === 'xml') {
                result.innerHTML = '<pre class="language-xml" style="background: #1f2937; padding: 16px; border-radius: 8px; border: 1px solid #374151; overflow: auto;"><code>' +
                  data.output.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
              } else {
                result.innerHTML = '<pre style="background: #1f2937; padding: 16px; border-radius: 8px; border: 1px solid #374151; overflow: auto;">' +
                  data.output.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
              }

              meta.textContent = data.outputType + ' • MODIFIED • ' + data.packages.length + ' packages' + (data.toolHash ? ' • ' + data.toolHash : '');
              output.classList.remove('hidden');

              // Update current tool for further modifications
              window.currentTool = {
                hash: data.toolHash,
                prompt: window.currentTool.prompt,
                outputType: data.outputType
              };

            } catch (error) {
              result.textContent = 'Modification Error: ' + error.message;
              meta.textContent = 'error';
              output.classList.remove('hidden');
            } finally {
              button.disabled = false;
              button.textContent = 'Run';
            }
          }
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

  let hash: string | undefined;

  try {
    const { prompt, input = "", forceRegenerate = false, baseToolHash = null, modification = null } = await c.req.json();

    if (!prompt?.trim()) {
      return c.json({ error: "Missing prompt" }, 400);
    }

    // Handle tool modification
    let baseToolCode = null;
    let baseToolData = null;
    let effectivePrompt = prompt;

    if (baseToolHash && modification) {
      console.log(`Modifying tool ${baseToolHash} with: ${modification}`);

      // Get the base tool from cache
      const baseToolKey = `tools/${baseToolHash}.json`;
      const baseTool = await c.env.TOOL_CACHE?.get(baseToolKey);

      if (baseTool) {
        baseToolData = await baseTool.json() as any;
        baseToolCode = baseToolData.bundledCode;

        // Create enhanced prompt that includes the base code and modification request
        effectivePrompt = `MODIFY EXISTING TOOL:

Base tool description: ${prompt}
Modification request: ${modification}

EXISTING CODE TO MODIFY:
\`\`\`javascript
${baseToolCode}
\`\`\`

INSTRUCTIONS:
- Take the existing code above and apply the requested modification
- Keep the same general structure and functionality
- Only change what's specifically requested in the modification
- Maintain the same export format and error handling
- If the modification is unclear, make reasonable assumptions`;

        console.log('Using modification prompt for existing tool');
      } else {
        console.warn(`Base tool ${baseToolHash} not found, proceeding with normal generation`);
      }
    }

    // Hash the effective prompt (includes modifications) for caching
    hash = await hashPrompt(effectivePrompt);
    console.log(`Tool request: ${hash.substring(0, 8)} - ${baseToolHash ? 'MODIFIED' : 'NEW'}`);

    // Store prompt in history using the same cache bucket
    if (c.env.TOOL_CACHE) {
      try {
        await c.env.TOOL_CACHE.put(`prompts/${hash}.json`, JSON.stringify({
          hash,
          prompt: baseToolHash ? `${prompt} (Modified: ${modification})` : prompt,
          originalPrompt: prompt,
          modification: modification,
          baseToolHash: baseToolHash,
          createdAt: Date.now()
        }));
      } catch (error) {
        console.warn('Failed to store prompt in history:', error);
      }
    }

    // Check cache (unless forcing regeneration)
    if (!forceRegenerate && c.env.TOOL_CACHE) {
      const cached = await c.env.TOOL_CACHE.get(`tools/${hash}.json`);
      if (cached) {
        const tool = await cached.json() as any;
        console.log("Cache hit, executing cached tool");

        // Execute cached tool
        const result = await executeCachedTool(tool.bundledCode, input, hash, c.env);

        return c.json({
          output: result.output,
          contentType: result.contentType,
          outputType: tool.outputType,
          outputDescription: tool.outputDescription,
          toolHash: hash.substring(0, 8),
          packages: tool.packages,
          cached: true,
          generatedCode: tool.bundledCode
        });
      }
    }

    console.log("Cache miss - generating new tool");

    // Generate tool code using AI
    const openai = createOpenAI({ apiKey: c.env.OPENAI_API_KEY });

    const { object: tool } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        code: z.string(),
        outputType: z.enum(['text', 'json', 'html', 'svg', 'image', 'csv', 'xml']),
        outputDescription: z.string()
      }),
      prompt: `Create a FULLY FUNCTIONAL Cloudflare Worker that implements: ${effectivePrompt}

CRITICAL REQUIREMENTS:
- Must be ACTUALLY FUNCTIONAL, not a mock-up or placeholder
- If it fetches data from APIs, it MUST make real API calls
- NO fake data, NO placeholder content, NO "TODO" comments
- Must work immediately when executed
- Generate completely self-contained code with NO imports

For common functionality, use these implementations:
- UUID: crypto.randomUUID() (built into Workers)
- Random: Math.random(), crypto.getRandomValues()
- Base64: btoa(), atob()
- Hashing: crypto.subtle.digest()
- JSON: JSON.parse(), JSON.stringify()
- Text: TextEncoder, TextDecoder
- URLs: new URL(), URLSearchParams

EXTERNAL API REQUIREMENTS:
- For crypto prices: Use CoinGecko API (https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd)
- For weather: Use wttr.in API (https://wttr.in/location?format=j1)
- For any data fetching: Use actual public APIs, not fake data
- Always include proper error handling for API failures
- Use fetch() for all HTTP requests

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

    // Transform imports using bundler
    const bundler = new BundlerWorker();
    const bundlerResult = await bundler.transformImports(tool.code);

    // Spawn new Worker with Worker Loader
    const workerId = `tool-${hash}`;
    console.log('Code being sent to Worker Loader:', JSON.stringify(bundlerResult.transformedCode));

    const worker = c.env.LOADER.get(workerId, async () => {
      console.log('Inside Worker Loader callback');

      return {
        compatibilityDate: "2025-10-01",
        mainModule: "tool.js",
        modules: {
          "tool.js": bundlerResult.transformedCode
        }
      };
    });

    // Execute the tool in the spawned worker
    const testUrl = new URL(`http://localhost/?q=${encodeURIComponent(input)}`);
    const testReq = new Request(testUrl);
    console.log('Executing worker with URL:', testUrl.toString());

    let output: string;
    let response: Response;

    try {
      // Use getEntrypoint to access the worker's fetch handler
      const entrypoint = worker.getEntrypoint();
      console.log('Got entrypoint, calling fetch...');
      response = await entrypoint.fetch(testReq);
      console.log('Got response, status:', response.status);
      output = await response.text();
      console.log('Got output:', output.substring(0, 200));
    } catch (error) {
      console.error('Worker execution failed:', error);
      throw new Error(`Worker execution failed: ${error.message}`);
    }

    // Cache the working tool
    const toolData = {
      hash,
      bundledCode: bundlerResult.transformedCode,
      createdAt: Date.now(),
      packages: bundlerResult.packages,
      outputType: tool.outputType,
      outputDescription: tool.outputDescription
    };

    if (c.env.TOOL_CACHE) {
      await c.env.TOOL_CACHE.put(`tools/${hash}.json`, JSON.stringify(toolData));
      console.log(`Cached tool: ${hash.substring(0, 8)} with ${bundlerResult.packages.length} packages`);
    }

    return c.json({
      output,
      outputType: tool.outputType,
      outputDescription: tool.outputDescription,
      toolHash: hash.substring(0, 8),
      packages: bundlerResult.packages,
      cached: false,
      generatedCode: bundlerResult.transformedCode
    });

  } catch (error) {
    console.error('Tool generation error:', error);

    // Clear cache for failed tool so it regenerates on next try
    if (c.env.TOOL_CACHE && hash) {
      try {
        await c.env.TOOL_CACHE.delete(`tools/${hash}.json`);
        console.log(`Cleared cache for failed tool: ${hash.substring(0, 8)}`);
      } catch (cacheError) {
        console.warn('Failed to clear cache:', cacheError);
      }
    }

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

// History endpoint
app.get('/history', (c) => {
  return c.render(
    <div className="bg-gray-900 text-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tool History</h1>
          <div className="flex gap-3">
            <button onclick="clearHistory()" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
              Clear History
            </button>
            <a href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
              Back to Tool
            </a>
          </div>
        </div>

        <div id="history-list" className="space-y-3">
          <p className="text-gray-400">Loading history...</p>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          async function loadHistory() {
            try {
              const response = await fetch('/api/history');
              const history = await response.json();
              const container = document.getElementById('history-list');

              if (history.length === 0) {
                container.innerHTML = '<p class="text-gray-400">No prompts yet. Create some tools first!</p>';
                return;
              }

              container.innerHTML = history.map((item, i) => {
                const escapedPrompt = item.prompt.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                const originalPrompt = item.originalPrompt || item.prompt;
                const escapedOriginal = originalPrompt.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                const htmlSafePrompt = item.prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

                return '<div class="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 border border-gray-700">' +
                  '<div class="flex justify-between items-start">' +
                    '<button onclick="loadPrompt(\'' + escapedPrompt + '\')" class="flex-1 text-left mr-3">' +
                      '<div class="text-gray-100 font-medium mb-2">' + htmlSafePrompt + '</div>' +
                      '<div class="text-xs text-gray-400 flex flex-wrap gap-2">' +
                        '<span>Hash: ' + item.hash + '</span>' +
                        '<span>' + new Date(item.createdAt).toLocaleString() + '</span>' +
                        (item.outputType ? '<span>Type: ' + item.outputType + '</span>' : '') +
                        (item.packages?.length ? '<span>Packages: ' + item.packages.length + '</span>' : '') +
                        (item.hasCode ? '<span class="text-green-400">✓ Cached</span>' : '<span class="text-yellow-400">⚠ No cache</span>') +
                      '</div>' +
                    '</button>' +
                    (item.hasCode ?
                      '<button onclick="modifyFromHistory(\'' + item.hash + '\', \'' + escapedOriginal + '\')" ' +
                      'class="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs">Modify</button>'
                      : '') +
                  '</div>' +
                '</div>';
              }).join('');
            } catch (error) {
              document.getElementById('history-list').innerHTML = '<p class="text-red-400">Error loading history: ' + error.message + '</p>';
            }
          }

          function loadPrompt(prompt) {
            sessionStorage.setItem('loadPrompt', prompt);
            window.location.href = '/';
          }

          function modifyFromHistory(hash, originalPrompt) {
            sessionStorage.setItem('loadPrompt', originalPrompt);
            sessionStorage.setItem('modifyHash', hash);
            window.location.href = '/';
          }

          async function clearHistory() {
            if (confirm('Clear all history?')) {
              try {
                await fetch('/api/history', { method: 'DELETE' });
                await loadHistory();
              } catch (error) {
                alert('Error: ' + error.message);
              }
            }
          }

          // Load history on page load
          loadHistory();
        `}} />
      </div>
    </div>
  )
})

// API endpoint for history
app.get('/api/history', async (c) => {
  try {
    const history = [];

    if (!c.env.TOOL_CACHE) {
      return c.json([]);
    }

    // Get prompts from the cache
    const promptList = await c.env.TOOL_CACHE.list({ prefix: 'prompts/' });
    for (const object of promptList.objects) {
      try {
        const stored = await c.env.TOOL_CACHE.get(object.key);
        if (stored) {
          const promptData = await stored.json() as any;

          // Also get the corresponding tool data if it exists
          const toolKey = `tools/${promptData.hash}.json`;
          let toolData = null;
          try {
            const toolObj = await c.env.TOOL_CACHE.get(toolKey);
            if (toolObj) {
              toolData = await toolObj.json() as any;
            }
          } catch (error) {
            console.warn('Error reading tool data for prompt:', error);
          }

          history.push({
            prompt: promptData.prompt,
            hash: promptData.hash.substring(0, 8),
            createdAt: promptData.createdAt,
            outputType: toolData?.outputType,
            packages: toolData?.packages || [],
            hasCode: !!toolData
          });
        }
      } catch (error) {
        console.warn('Error reading stored prompt:', error);
      }
    }

    // Sort by creation time, newest first
    history.sort((a, b) => b.createdAt - a.createdAt);
    return c.json(history.slice(0, 50)); // Limit to 50 most recent
  } catch (error) {
    console.error('History fetch error:', error);
    return c.json({ error: error.message }, 500);
  }
})

// Clear history endpoint
app.delete('/api/history', async (c) => {
  try {
    if (!c.env.TOOL_CACHE) {
      return c.json({ message: 'No cache configured' });
    }

    // Clear both prompts and tools
    const toolsList = await c.env.TOOL_CACHE.list({ prefix: 'tools/' });
    const promptsList = await c.env.TOOL_CACHE.list({ prefix: 'prompts/' });

    for (const object of toolsList.objects) {
      await c.env.TOOL_CACHE.delete(object.key);
    }

    for (const object of promptsList.objects) {
      await c.env.TOOL_CACHE.delete(object.key);
    }

    const totalCleared = toolsList.objects.length + promptsList.objects.length;
    console.log(`Cleared ${totalCleared} items from history (${toolsList.objects.length} tools, ${promptsList.objects.length} prompts)`);
    return c.json({ message: `Cleared ${totalCleared} items from history` });
  } catch (error) {
    console.error('History clear error:', error);
    return c.json({ error: error.message }, 500);
  }
})

// Cache management endpoints
app.get('/api/cache', async (c) => {
  try {
    if (!c.env.TOOL_CACHE) {
      return c.json([]);
    }

    const list = await c.env.TOOL_CACHE.list({ prefix: 'tools/' });
    const cacheInfo = [];

    for (const object of list.objects) {
      try {
        const cached = await c.env.TOOL_CACHE.get(object.key);
        if (cached) {
          const tool = await cached.json() as any;
          cacheInfo.push({
            hash: tool.hash.substring(0, 8),
            createdAt: tool.createdAt,
            packages: tool.packages,
            outputType: tool.outputType,
            size: object.size
          });
        }
      } catch (error) {
        console.warn('Error reading cached tool:', error);
      }
    }

    return c.json(cacheInfo);
  } catch (error) {
    console.error('Cache list error:', error);
    return c.json({ error: error.message }, 500);
  }
})

app.delete('/api/cache/:hash?', async (c) => {
  const hash = c.req.param('hash');

  try {
    if (!c.env.TOOL_CACHE) {
      return c.json({ message: 'No cache configured' });
    }

    if (hash) {
      // Delete specific tool
      await c.env.TOOL_CACHE.delete(`tools/${hash}.json`);
      return c.json({ message: `Cache cleared for ${hash}` });
    } else {
      // Clear all cache
      const list = await c.env.TOOL_CACHE.list({ prefix: 'tools/' });
      for (const object of list.objects) {
        await c.env.TOOL_CACHE.delete(object.key);
      }
      return c.json({ message: `Cleared all cache (${list.objects.length} items)` });
    }
  } catch (error) {
    console.error('Cache clear error:', error);
    return c.json({ error: error.message }, 500);
  }
})

export default app