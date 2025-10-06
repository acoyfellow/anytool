import { Hono } from "hono"
import { DurableObject, WorkerEntrypoint } from "cloudflare:workers"
import type { Cloudflare } from "cloudflare:workers"
import { Anytool } from './anytool'
import { R2Cache } from './cache'
import { WorkerLoaderExecutor } from './executor'
import type { ToolRequest } from './types'

// Outbound proxy for monitoring
export class OutboundProxy extends WorkerEntrypoint<Cloudflare.Env> {
  async fetch(request: Request): Promise<Response> {
    const toolId = (this.ctx.props as any)?.toolId || 'unknown'
    const url = new URL(request.url)
    console.log(`[${toolId}] Outbound fetch: ${url.hostname}${url.pathname}`)
    return fetch(request)
  }
}

// History Durable Object
export class HistoryStore extends DurableObject<Cloudflare.Env> {
  async add(prompt: string): Promise<void> {
    if (prompt?.trim()) {
      const history = await this.list()
      const updated = [prompt, ...history.filter(p => p !== prompt)].slice(0, 50)
      await this.ctx.storage.put('prompts', updated)
    }
  }

  async list(): Promise<string[]> {
    return (await this.ctx.storage.get<string[]>('prompts')) || []
  }

  async clear(): Promise<void> {
    await this.ctx.storage.delete('prompts')
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/add') {
      const { prompt } = await request.json() as { prompt: string }
      await this.add(prompt)
      return new Response('OK')
    }
    if (request.method === 'GET' && url.pathname === '/list') {
      return Response.json(await this.list())
    }
    if (request.method === 'DELETE' && url.pathname === '/clear') {
      await this.clear()
      return new Response('OK')
    }
    return new Response('Not found', { status: 404 })
  }
}

// BunCompiler Durable Object
export class BunCompiler extends DurableObject<Cloudflare.Env> {
  container: globalThis.Container

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env)
    this.container = ctx.container!
    void this.ctx.blockConcurrencyWhile(async () => {
      if (!this.container.running) {
        this.container.start()
      }
    })
  }

  async fetch(req: Request): Promise<Response> {
    try {
      return await this.container.getTcpPort(3000).fetch(req.url.replace('https:', 'http:'), req)
    } catch (err: any) {
      return new Response(`${this.ctx.id.toString()}: ${err.message}`, { status: 500 })
    }
  }
}

const app = new Hono<{ Bindings: Cloudflare.Env }>()

// Main API endpoint
app.post("/api/tool", async (c) => {
  const request = await c.req.json() as ToolRequest

  // Store in history
  if (c.env.HISTORY_DO && request.prompt) {
    const historyId = c.env.HISTORY_DO.idFromName('history')
    const historyStub = c.env.HISTORY_DO.get(historyId)
    await historyStub.fetch('http://history/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: request.prompt })
    })
  }

  // Get compiler URL
  const isDev = (c.env as any).ENVIRONMENT === 'development'
  const compilerUrl = isDev
    ? 'http://localhost:3000/compile'
    : await (async () => {
        if (!c.env.BUN_COMPILER_DO) throw new Error('BUN_COMPILER_DO not available')
        const container = c.env.BUN_COMPILER_DO.getByName("compiler")
        const compilerResponse = await container.fetch('http://container/compile', { method: 'HEAD' })
        return 'http://container/compile'
      })()

  // Setup anytool
  const cache = new R2Cache(c.env.TOOL_CACHE)
  const outboundProxy = (c.env as any).OUTBOUND_PROXY?.({ props: { toolId: 'unknown' } })
  const executor = new WorkerLoaderExecutor(c.env.LOADER, outboundProxy)

  const anytool = new Anytool({
    openaiApiKey: c.env.OPENAI_API_KEY,
    compilerUrl,
    cache,
    executor
  })

  const result = await anytool.generate(request)

  if ('error' in result) {
    return Response.json(result, { status: 500 })
  }

  return Response.json(result)
})

// Cache management
app.delete("/api/cache/:hash?", async (c) => {
  const hash = c.req.param('hash')
  const cache = new R2Cache(c.env.TOOL_CACHE)

  if (hash) {
    await cache.delete(hash)
    return Response.json({ message: `Cache cleared for ${hash}` })
  } else {
    const list = await c.env.TOOL_CACHE.list({ prefix: 'tools/' })
    for (const object of list.objects) {
      await c.env.TOOL_CACHE.delete(object.key)
    }
    return Response.json({ message: `Cleared all cache (${list.objects.length} items)` })
  }
})

// History endpoints
app.delete("/api/clear-history", async (c) => {
  if (c.env.HISTORY_DO) {
    const historyId = c.env.HISTORY_DO.idFromName('history')
    const historyStub = c.env.HISTORY_DO.get(historyId)
    await historyStub.fetch('http://history/clear', { method: 'DELETE' })
  }
  return Response.json({ message: "History cleared" })
})

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    const exportsProxy = (ctx as any).exports?.OutboundProxy
    if (exportsProxy) {
      (env as any).OUTBOUND_PROXY = exportsProxy
    }
    return app.fetch(request, env, ctx)
  }
}


