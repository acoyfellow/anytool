import type { CompilerResponse } from './types'

export async function compileTool(
  code: string,
  compilerUrl: string
): Promise<CompilerResponse> {
  const response = await fetch(compilerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })

  if (!response.ok) {
    const errorText = await response.text()
    try {
      const error = JSON.parse(errorText)
      throw new Error(error.error || `Compilation failed: ${response.status}`)
    } catch {
      throw new Error(`Compilation failed: ${response.status} - ${errorText}`)
    }
  }

  const result = await response.json()
  return {
    mainCode: result.mainCode,
    packages: result.packages || []
  }
}


