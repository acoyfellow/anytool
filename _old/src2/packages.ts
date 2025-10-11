import type { KnownPackages } from './types'

export const KNOWN_PACKAGES: KnownPackages = {
  'uuid': {
    works: true,
    usage: 'import { v4 as uuidv4 } from "uuid"',
    example: 'const id = uuidv4();',
    description: 'Generate UUIDs'
  },
  'lodash': {
    works: true,
    usage: 'import _ from "lodash"',
    example: 'const result = _.uniq([1,2,2,3]);',
    description: 'Utility functions'
  },
  'date-fns': {
    works: true,
    usage: 'import { format, addDays } from "date-fns"',
    example: 'const formatted = format(new Date(), "yyyy-MM-dd");',
    description: 'Date manipulation'
  },
  'crypto-js': {
    works: true,
    usage: 'import CryptoJS from "crypto-js"',
    example: 'const hash = CryptoJS.SHA256("text").toString();',
    description: 'Cryptographic functions'
  },
  'marked': {
    works: true,
    usage: 'import { marked } from "marked"',
    example: 'const html = marked("# Hello");',
    description: 'Markdown to HTML'
  },
  'zxcvbn': {
    works: true,
    usage: 'import zxcvbn from "zxcvbn"',
    example: 'const result = zxcvbn("password");',
    description: 'Password strength checking'
  },
  '@faker-js/faker': {
    works: true,
    usage: 'import { faker } from "@faker-js/faker"',
    example: 'const name = faker.person.fullName();',
    description: 'Generate fake data'
  },
  'qrcode-generator': {
    works: true,
    usage: 'import qrcode from "qrcode-generator"',
    example: 'const qr = qrcode(0, "M"); qr.addData("text"); qr.make(); const svg = qr.createSvgTag();',
    description: 'QR code generation (SVG/ASCII only)'
  },
  'qrcode': {
    works: false,
    reason: 'Requires canvas/DOM APIs',
    alternative: 'Use qrcode-generator instead'
  },
  'jsonwebtoken': {
    works: false,
    reason: 'Uses Node.js process object',
    alternative: 'Use jose or pure JS JWT libraries'
  },
  'ajv': {
    works: false,
    reason: 'Uses eval/Function constructors blocked by CSP',
    alternative: 'Use zod for schema validation'
  },
  'sentiment': {
    works: false,
    reason: 'Package API usage issues in Workers',
    alternative: 'Use vader-sentiment or simple sentiment rules'
  },
  'faker': {
    works: false,
    reason: 'Old package name',
    alternative: 'Use @faker-js/faker instead'
  }
}

export const CF_WORKERS_CONTEXT = `
CLOUDFLARE WORKERS RUNTIME ENVIRONMENT:

AVAILABLE APIS:
- fetch() - HTTP requests (primary network API)
- crypto.subtle - Web Crypto API
- TextEncoder/TextDecoder
- URL, URLSearchParams
- JSON, Math, Date, RegExp
- ArrayBuffer, Uint8Array, etc.
- Promise, async/await

NOT AVAILABLE (will cause errors):
- Node.js APIs (fs, path, os, process.env, Buffer, etc.)
- DOM APIs (document, window, canvas, etc.)
- Raw TCP/UDP sockets
- File system access

RUNTIME LIMITS:
- Memory: 128MB per request
- CPU: 50ms execution time
- Response size: 100MB max
- Network: Only via fetch()
`

export function checkPackageCompatibility(packages: string[]) {
  const compatible: string[] = []
  const incompatible: string[] = []
  const warnings: string[] = []

  for (const pkg of packages) {
    const known = KNOWN_PACKAGES[pkg]
    if (known) {
      if (known.works) {
        compatible.push(pkg)
      } else {
        incompatible.push(pkg)
        warnings.push(`Package '${pkg}' is incompatible: ${known.reason}${known.alternative ? `. Alternative: ${known.alternative}` : ''}`)
      }
    } else {
      compatible.push(pkg)
      warnings.push(`Package '${pkg}' compatibility unknown - proceeding with caution`)
    }
  }

  return { compatible, incompatible, warnings }
}

export function getWorkingPackagesList(): string {
  return Object.entries(KNOWN_PACKAGES)
    .filter(([_, info]) => info.works)
    .map(([name, info]) => `- ${name}: ${info.description}\n  Usage: ${info.usage}\n  Example: ${info.example}`)
    .join('\n')
}

export function getIncompatiblePackagesList(): string {
  return Object.entries(KNOWN_PACKAGES)
    .filter(([_, info]) => !info.works)
    .map(([name, info]) => `- ${name}: ${info.reason}`)
    .join('\n')
}


