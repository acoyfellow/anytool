// Core API contract - use this in any project

export type OutputType = 'text' | 'json' | 'html' | 'image' | 'svg' | 'csv' | 'xml'

export interface ToolRequest {
  prompt: string
  input?: string
  forceRegenerate?: boolean
}

export interface ToolResponse {
  output: string
  outputType: OutputType
  contentType: string
  outputDescription: string
  toolHash: string
  packages: string[]
  cached: boolean
  generatedCode?: string
}

export interface ToolError {
  error: string
  details?: {
    hash?: string
    packages?: string[]
    stack?: string
  }
}

export interface CachedTool {
  hash: string
  bundledCode: string
  createdAt: number
  packages: string[]
  outputType: OutputType
  outputDescription: string
}

export interface CompilerRequest {
  code: string
}

export interface CompilerResponse {
  mainCode: string
  packages: string[]
}

export interface PackageInfo {
  works: boolean
  usage?: string
  example?: string
  description?: string
  reason?: string
  alternative?: string
}

export type KnownPackages = Record<string, PackageInfo>


