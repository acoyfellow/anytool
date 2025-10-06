import { generateObject } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { CF_WORKERS_CONTEXT, getWorkingPackagesList, getIncompatiblePackagesList } from './packages'
import type { OutputType } from './types'

export interface GenerateCodeResult {
  code: string
  example: string
  outputType: OutputType
  outputDescription: string
}

export async function generateCode(prompt: string, apiKey: string): Promise<GenerateCodeResult> {
  const openai = createOpenAI({ apiKey })

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      typescript: z.string().describe("Complete Cloudflare Worker code"),
      example: z.string().describe("ONLY the parameter value for ?q=VALUE - NOT a full URL"),
      outputType: z.enum(['text', 'json', 'html', 'image', 'svg', 'csv', 'xml']),
      outputDescription: z.string().describe("Brief description of output")
    }),
    prompt: `Create a Cloudflare Worker that implements: ${prompt}

${CF_WORKERS_CONTEXT}

WORKING PACKAGE EXAMPLES:
${getWorkingPackagesList()}

INCOMPATIBLE PACKAGES (DO NOT USE):
${getIncompatiblePackagesList()}

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

REQUIREMENTS:
- ONLY import packages you ACTUALLY USE
- Use KNOWN WORKING packages when possible
- Write PLAIN JAVASCRIPT (no TypeScript annotations)
- Static imports only at top
- Always include try/catch
- Accept input via ?q=INPUT
- Return new Response() with proper Content-Type
- For async: make fetch async and await all promises
- NEVER return [object Promise] - always await

OUTPUT TYPE GUIDELINES:
- 'text': Plain text (Content-Type: 'text/plain')
- 'json': JSON objects (Content-Type: 'application/json')
- 'html': HTML content (Content-Type: 'text/html')
- 'svg': SVG markup (Content-Type: 'image/svg+xml')
- 'image': Base64 data or data URLs
- 'csv': CSV data (Content-Type: 'text/csv')
- 'xml': XML data (Content-Type: 'application/xml')`
  })

  return {
    code: result.object.typescript,
    example: result.object.example,
    outputType: result.object.outputType,
    outputDescription: result.object.outputDescription
  }
}


