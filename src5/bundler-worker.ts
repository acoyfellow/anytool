export default class BundlerWorker {
  async transformImports(code: string) {
    const packages = new Set<string>()

    // Parse imports properly using simple string parsing
    const lines = code.split('\n')
    const transformedLines = lines.map(line => {
      const trimmed = line.trim()

      // Handle import statements
      if (trimmed.startsWith('import ')) {
        const fromIndex = trimmed.indexOf(' from ')
        if (fromIndex !== -1) {
          const importPart = trimmed.substring(0, fromIndex)
          const fromPart = trimmed.substring(fromIndex + 6).trim()

          // Extract the quoted module name
          const quote = fromPart[0]
          if (quote === '"' || quote === "'") {
            const endQuote = fromPart.indexOf(quote, 1)
            if (endQuote !== -1) {
              const moduleName = fromPart.substring(1, endQuote)

              // Skip relative imports and URLs
              if (!moduleName.startsWith('./') &&
                  !moduleName.startsWith('../') &&
                  !moduleName.startsWith('http') &&
                  !moduleName.startsWith('/')) {

                // Track package
                const cleanPackageName = moduleName.split('/')[0].startsWith('@')
                  ? moduleName.split('/').slice(0, 2).join('/')
                  : moduleName.split('/')[0]
                packages.add(cleanPackageName)

                // Transform to CDN URL
                const cdnUrl = `https://esm.sh/${moduleName}`
                const newFromPart = `${quote}${cdnUrl}${quote}${fromPart.substring(endQuote + 1)}`
                return `${importPart} from ${newFromPart}`
              }
            }
          }
        }
      }

      return line
    })

    return {
      transformedCode: transformedLines.join('\n'),
      packages: Array.from(packages)
    }
  }
}