import type { CachedTool } from './types'

export interface CacheAdapter {
  get(hash: string): Promise<CachedTool | null>
  set(hash: string, tool: Omit<CachedTool, 'hash'>): Promise<void>
  delete(hash: string): Promise<void>
}

// R2 implementation
export class R2Cache implements CacheAdapter {
  constructor(private r2: any) {}

  async get(hash: string): Promise<CachedTool | null> {
    try {
      const object = await this.r2.get(`tools/${hash}.json`)
      if (!object) return null
      return await object.json() as CachedTool
    } catch {
      return null
    }
  }

  async set(hash: string, tool: Omit<CachedTool, 'hash'>): Promise<void> {
    const data: CachedTool = { hash, ...tool }
    await this.r2.put(`tools/${hash}.json`, JSON.stringify(data), {
      httpMetadata: { contentType: 'application/json' }
    })
  }

  async delete(hash: string): Promise<void> {
    await this.r2.delete(`tools/${hash}.json`)
  }
}

// In-memory implementation for testing or non-CF environments
export class MemoryCache implements CacheAdapter {
  private cache = new Map<string, CachedTool>()

  async get(hash: string): Promise<CachedTool | null> {
    return this.cache.get(hash) || null
  }

  async set(hash: string, tool: Omit<CachedTool, 'hash'>): Promise<void> {
    this.cache.set(hash, { hash, ...tool })
  }

  async delete(hash: string): Promise<void> {
    this.cache.delete(hash)
  }
}


