// Client SDK for consuming anytool API from any frontend

import type { ToolRequest, ToolResponse, ToolError } from './types'

export interface AnytoolClientConfig {
  endpoint: string
  apiKey?: string
}

export class AnytoolClient {
  constructor(private config: AnytoolClientConfig) {}

  async generate(request: ToolRequest): Promise<ToolResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(`${this.config.endpoint}/api/tool`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error((data as ToolError).error || 'Request failed')
    }

    return data as ToolResponse
  }

  async clearCache(hash?: string): Promise<void> {
    const url = hash 
      ? `${this.config.endpoint}/api/cache/${hash}`
      : `${this.config.endpoint}/api/cache`

    const headers: Record<string, string> = {}
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    await fetch(url, {
      method: 'DELETE',
      headers
    })
  }
}


