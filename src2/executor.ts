export interface ExecutorAdapter {
  execute(bundledCode: string, input: string, hash: string): Promise<{
    output: string
    contentType: string
  }>
}

// Cloudflare Worker Loaders implementation
export class WorkerLoaderExecutor implements ExecutorAdapter {
  constructor(
    private loader: any,
    private outboundProxy?: any
  ) {}

  async execute(bundledCode: string, input: string, hash: string) {
    const isolateId = `tool:${hash}`

    const workerConfig: any = {
      compatibilityDate: "2025-09-27",
      mainModule: "tool.js",
      modules: {
        "tool.js": bundledCode
      }
    }

    if (this.outboundProxy) {
      workerConfig.globalOutbound = this.outboundProxy
    }

    const worker = this.loader.get(isolateId, async () => workerConfig)
    const endpoint = worker.getEntrypoint()
    const url = new URL(`http://tool/?q=${encodeURIComponent(input)}`)
    const response = await endpoint.fetch(url.toString())
    const output = await response.text()
    const contentType = response.headers.get("content-type") || "text/plain"

    return { output, contentType }
  }
}


