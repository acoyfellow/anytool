import { DocumentationSource, ProjectContext } from '../core/types';
import { Logger } from '../utils/logger';

/**
 * SmartPromptBuilder - Constructs intelligent prompts with live context
 *
 * This component builds prompts that include:
 * - Live Cloudflare Workers documentation
 * - Real-time package compatibility information
 * - Project-specific context and constraints
 * - Intelligent examples and templates
 */
export class SmartPromptBuilder {
  constructor(
    private config: {
      templates?: Record<string, string>;
      projectContext?: ProjectContext;
      logger: Logger;
    }
  ) {}

  /**
   * Build an intelligent prompt with live documentation and context
   */
  async buildPrompt(params: {
    userPrompt: string;
    documentation: DocumentationSource[];
    userContext?: string;
    outputHints?: {
      preferredType?: string;
      contentType?: string;
    };
  }): Promise<string> {
    this.config.logger.debug('Building intelligent prompt', {
      userPromptLength: params.userPrompt.length,
      documentationSources: params.documentation.length,
      hasUserContext: !!params.userContext,
      hasOutputHints: !!params.outputHints
    });

    const sections = [
      this.buildTaskSection(params.userPrompt, params.userContext),
      this.buildEnvironmentSection(params.documentation),
      this.buildPackageGuidanceSection(),
      this.buildCodeFormatSection(),
      this.buildValidationSection(),
      this.buildProjectContextSection(),
      this.buildExamplesSection(params.userPrompt),
      this.buildOutputHintsSection(params.outputHints)
    ];

    const prompt = sections.filter(Boolean).join('\n\n');

    this.config.logger.debug('Prompt built successfully', {
      totalLength: prompt.length,
      sections: sections.length
    });

    return prompt;
  }

  private buildTaskSection(userPrompt: string, userContext?: string): string {
    let section = `TASK: Create a Cloudflare Worker that implements: ${userPrompt}`;

    if (userContext) {
      section += `\n\nUSER CONTEXT: ${userContext}`;
    }

    if (this.config.projectContext) {
      section += `\n\nPROJECT CONTEXT:`;
      section += `\n- Project: ${this.config.projectContext.name}`;
      section += `\n- Domain: ${this.config.projectContext.domain}`;
      if (this.config.projectContext.constraints.length > 0) {
        section += `\n- Constraints: ${this.config.projectContext.constraints.join(', ')}`;
      }
      if (this.config.projectContext.customInstructions) {
        section += `\n- Instructions: ${this.config.projectContext.customInstructions}`;
      }
    }

    return section;
  }

  private buildEnvironmentSection(documentation: DocumentationSource[]): string {
    let section = `CLOUDFLARE WORKERS ENVIRONMENT:\n`;

    // Core environment info
    section += `
RUNTIME ENVIRONMENT:
- V8 JavaScript engine with Web APIs
- No Node.js APIs (fs, path, os, process, etc.)
- ESM modules only (import/export syntax)
- Memory limit: 128MB per request
- CPU time limit: 50ms (can be extended with Unbound plan)
- Maximum response size: 100MB

AVAILABLE WEB APIS:
- fetch() - HTTP requests (primary network API)
- crypto.subtle - Web Crypto API for encryption/hashing
- TextEncoder/TextDecoder - Text encoding/decoding
- URL, URLSearchParams - URL manipulation
- JSON - JSON parsing/stringification
- Math, Date, RegExp - Standard JavaScript objects
- ArrayBuffer, Uint8Array, etc. - Binary data handling
- Promise, async/await - Asynchronous operations
- WebSocket API - Real-time communication
- Headers, Request, Response - HTTP primitives

NOT AVAILABLE:
- Node.js APIs (fs, path, os, process.env, Buffer, etc.)
- DOM APIs (document, window, canvas, etc.)
- Raw TCP/UDP sockets
- File system access
- Child processes
- Native modules/bindings
- require() (use import instead)
`;

    // Add live documentation if available
    if (documentation.length > 0) {
      section += `\nLIVE DOCUMENTATION CONTEXT:\n`;
      for (const doc of documentation.slice(0, 3)) { // Top 3 most relevant
        section += `\nFrom ${doc.title}:\n${doc.content.substring(0, 1000)}...\n`;
      }
    }

    return section;
  }

  private buildPackageGuidanceSection(): string {
    return `PACKAGE SELECTION & VERIFICATION:

BEFORE using ANY npm package, you MUST verify compatibility:

1. CHECK FOR NODEJS_COMPAT SUPPORT:
   - Look for "browser" field in package.json
   - Check for "sideEffects": false
   - Verify "type": "module" for ESM
   - Look for keywords: "browser", "edge", "workers"

2. AVOID PACKAGES THAT:
   - Import Node.js modules (fs, path, os, process, child_process, etc.)
   - Use native dependencies or bindings
   - Require DOM APIs (canvas, document, window)
   - Use eval() or Function constructors
   - Have large bundle sizes (>1MB)

3. PREFER PACKAGES THAT:
   - Explicitly support browsers/edge environments
   - Are pure JavaScript with no native dependencies
   - Have small bundle sizes
   - Use modern ESM syntax
   - Are actively maintained

4. RECOMMENDED COMPATIBLE PACKAGES:
   - uuid - UUID generation
   - lodash - Utility functions (tree-shakeable)
   - date-fns - Date manipulation
   - crypto-js - Cryptographic functions
   - marked - Markdown parsing
   - zxcvbn - Password strength checking
   - @faker-js/faker - Fake data generation
   - jose - JWT handling (Workers-compatible)
   - zod - Schema validation
   - slugify - URL slug generation
   - bcryptjs - Password hashing
   - chroma-js - Color manipulation

5. PACKAGE ALTERNATIVES:
   - Instead of 'jsonwebtoken' → use 'jose'
   - Instead of 'node-fetch' → use built-in fetch()
   - Instead of 'axios' → use built-in fetch()
   - Instead of 'fs' operations → use fetch() for remote files
   - Instead of 'sharp' → use Web APIs or browser-compatible alternatives
   - Instead of 'faker' → use '@faker-js/faker'

VERIFICATION PROCESS:
When you choose a package, verify it by:
1. Checking its NPM page for browser/Workers support
2. Looking at dependencies for Node.js modules
3. Reading documentation for environment requirements
4. Checking bundle size and compatibility notes`;
  }

  private buildCodeFormatSection(): string {
    return `EXACT CODE FORMAT REQUIRED:

You must generate code in this EXACT format:

\`\`\`javascript
import { specificFunction } from 'package-name';

export default {
  fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const input = url.searchParams.get('q') || 'default-value';

      // Your implementation here
      const result = processInput(input);

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
\`\`\`

CRITICAL REQUIREMENTS:
- Use EXACT format above (simple object literal export)
- NEVER use TypeScript syntax - plain JavaScript only
- Static imports only at top of file (no dynamic imports)
- Always include try/catch for proper error handling
- Accept input via URL query parameter ?q=INPUT
- Provide sensible defaults for empty input
- Return new Response() with proper Content-Type headers
- For async operations: make fetch function async and await all promises
- NEVER return [object Promise] - always await before returning
- ONLY import packages you ACTUALLY USE - unused imports cause compilation errors`;
  }

  private buildValidationSection(): string {
    return `OUTPUT TYPE GUIDELINES & VALIDATION:

Choose the appropriate output type and content-type:

- 'json': JSON objects/arrays → Content-Type: 'application/json'
- 'html': HTML content → Content-Type: 'text/html'
- 'svg': SVG markup → Content-Type: 'image/svg+xml'
- 'text': Plain text, strings → Content-Type: 'text/plain'
- 'csv': CSV data → Content-Type: 'text/csv'
- 'xml': XML data → Content-Type: 'application/xml'

VALIDATION RULES:
- SVG output must start with '<svg' and use 'image/svg+xml'
- JSON output must be valid JSON and use 'application/json'
- HTML output must be valid HTML and use 'text/html'
- Data URLs (data:image/...) should use 'text/plain' content-type
- Never mix content types (e.g., SVG content with PNG content-type)

Your generated code will be automatically validated by:
1. Package compatibility checking
2. Compilation testing with Bun
3. Runtime execution testing
4. Content-type consistency validation
If validation fails, generation will be retried with feedback.`;
  }

  private buildProjectContextSection(): string {
    if (!this.config.projectContext) return '';

    let section = `PROJECT-SPECIFIC CONTEXT:\n`;

    if (this.config.projectContext.preferredPackages?.length) {
      section += `\nPREFERRED PACKAGES: ${this.config.projectContext.preferredPackages.join(', ')}`;
    }

    if (this.config.projectContext.forbiddenPackages?.length) {
      section += `\nFORBIDDEN PACKAGES: ${this.config.projectContext.forbiddenPackages.join(', ')}`;
    }

    return section;
  }

  private buildExamplesSection(userPrompt: string): string {
    const examples = this.selectRelevantExamples(userPrompt);

    if (examples.length === 0) {
      return this.getBasicExamples();
    }

    let section = `RELEVANT EXAMPLES:\n`;
    for (const example of examples) {
      section += `\n${example}\n`;
    }

    return section;
  }

  private selectRelevantExamples(userPrompt: string): string[] {
    const lowerPrompt = userPrompt.toLowerCase();
    const examples: Array<{ keywords: string[]; example: string }> = [
      {
        keywords: ['uuid', 'id', 'identifier', 'guid'],
        example: `// UUID Generator Example:
import { v4 as uuidv4 } from 'uuid';

export default {
  fetch(request, env, ctx) {
    try {
      const uuid = uuidv4();
      return new Response(JSON.stringify({ uuid }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}`
      },
      {
        keywords: ['qr', 'code', 'qrcode', 'barcode'],
        example: `// QR Code Generator Example (SVG):
import qrcode from 'qrcode-generator';

export default {
  fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const input = url.searchParams.get('q') || 'Hello World';

      const qr = qrcode(0, 'M');
      qr.addData(input);
      qr.make();
      const svgString = qr.createSvgTag(4, 0);

      return new Response(svgString, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    } catch (error) {
      return new Response('Error generating QR code', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
}`
      },
      {
        keywords: ['markdown', 'md', 'html', 'convert'],
        example: `// Markdown to HTML Converter:
import { marked } from 'marked';

export default {
  fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const markdown = url.searchParams.get('q') || '# Hello World';

      const html = marked(markdown);

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    } catch (error) {
      return new Response(\`<p>Error: \${error.message}</p>\`, {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }
}`
      }
    ];

    return examples
      .filter(ex => ex.keywords.some(keyword => lowerPrompt.includes(keyword)))
      .map(ex => ex.example)
      .slice(0, 2); // Max 2 examples to avoid context bloat
  }

  private getBasicExamples(): string {
    return `BASIC EXAMPLES:

// Simple JSON API:
export default {
  fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const input = url.searchParams.get('q') || 'world';

      return new Response(JSON.stringify({
        message: \`Hello \${input}\`
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

// Async API call example:
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || 'javascript';

      const response = await fetch(\`https://api.example.com/search?q=\${encodeURIComponent(query)}\`);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}`;
  }

  private buildOutputHintsSection(outputHints?: { preferredType?: string; contentType?: string }): string {
    if (!outputHints?.preferredType && !outputHints?.contentType) return '';

    let section = `OUTPUT REQUIREMENTS:\n`;

    if (outputHints.preferredType) {
      section += `- Preferred output type: ${outputHints.preferredType}\n`;
    }

    if (outputHints.contentType) {
      section += `- Required content-type: ${outputHints.contentType}\n`;
    }

    return section;
  }
}