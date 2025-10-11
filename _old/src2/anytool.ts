// Core anytool logic - platform agnostic

import { hashPrompt } from './hash'
import { generateCode } from './generator'
import { compileTool } from './compiler'
import { checkPackageCompatibility } from './packages'
import type { ToolRequest, ToolResponse, ToolError, CachedTool } from './types'
import type { CacheAdapter } from './cache'
import type { ExecutorAdapter } from './executor'

export interface AnytoolConfig {
  openaiApiKey: string
  compilerUrl: string
  cache: CacheAdapter
  executor: ExecutorAdapter
}

export class Anytool {
  constructor(private config: AnytoolConfig) {}

  async generate(request: ToolRequest): Promise<ToolResponse | ToolError> {
    let hash = "(null)"
    let tool: CachedTool | null = null

    try {
      const { prompt, input = "", forceRegenerate = false } = request

      if (!prompt?.trim()) {
        return { error: "Missing prompt" }
      }

      // Hash prompt
      hash = await hashPrompt(prompt)
      console.log(`Tool request: ${hash.substring(0, 8)}`)

      // Check cache
      tool = forceRegenerate ? null : await this.config.cache.get(hash)

      if (forceRegenerate && tool) {
        await this.config.cache.delete(hash)
        tool = null
      }

      if (!tool) {
        console.log("Cache miss - generating tool")

        // Generate code
        const generated = await generateCode(prompt, this.config.openaiApiKey)

        // Check package compatibility
        const packages = generated.code.match(/from\s+['\"`]([^'\"`\s]+)['\"`]/g)?.map(match =>
          match.match(/from\s+['\"`]([^'\"`\s]+)['\"`]/)?.[1]
        ).filter(Boolean) || []

        const packageCheck = checkPackageCompatibility(packages)

        if (packageCheck.warnings.length > 0) {
          console.warn("Package warnings:", packageCheck.warnings)
        }

        if (packageCheck.incompatible.length > 0) {
          throw new Error(`Incompatible packages: ${packageCheck.incompatible.join(', ')}. ${packageCheck.warnings.join(' ')}`)
        }

        // Compile code
        const compiled = await compileTool(generated.code, this.config.compilerUrl)

        // Validate by executing with test input
        const validationResult = await this.config.executor.execute(
          compiled.mainCode,
          generated.example || "test",
          `${hash}-validation`
        )

        if (!validationResult.output || validationResult.output.trim().length === 0) {
          throw new Error('Generated code produces empty output')
        }

        // Cache validated tool
        tool = {
          hash,
          bundledCode: compiled.mainCode,
          createdAt: Date.now(),
          packages: compiled.packages,
          outputType: generated.outputType,
          outputDescription: generated.outputDescription
        }

        await this.config.cache.set(hash, tool)
        console.log(`Cached tool: ${hash.substring(0, 8)} with ${tool.packages.length} packages`)
      } else {
        console.log("Cache hit - using cached tool")
      }

      // Execute tool
      const result = await this.config.executor.execute(tool.bundledCode, input, hash)

      return {
        output: result.output,
        contentType: result.contentType,
        outputType: tool.outputType,
        outputDescription: tool.outputDescription,
        toolHash: hash.substring(0, 8),
        packages: tool.packages,
        cached: !!tool,
        generatedCode: tool.bundledCode
      }

    } catch (error) {
      console.error("Tool execution error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {
        error: `Tool failed: ${errorMessage}`,
        details: {
          hash: hash?.substring(0, 8),
          packages: tool?.packages || [],
          stack: error instanceof Error ? error.stack : undefined
        }
      }
    }
  }
}


