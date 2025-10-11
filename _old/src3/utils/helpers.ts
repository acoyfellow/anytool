/**
 * Utility functions for AnyTool Core
 */

/**
 * Generate a hash for a prompt (for caching)
 */
export async function hashPrompt(prompt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(prompt.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Delay execution for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delayMs = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
      await delay(delayMs);
    }
  }

  throw lastError!;
}

/**
 * Extract package names from import statements
 */
export function extractPackageNames(code: string): string[] {
  const importRegex = /from\s+['\"`]([^'\"`\s]+)['\"`]/g;
  const packages: string[] = [];
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const packageName = match[1];
    // Skip relative imports and built-in modules
    if (!packageName.startsWith('./') && !packageName.startsWith('../') && !packageName.startsWith('http')) {
      // Handle scoped packages (e.g., @faker-js/faker)
      const normalizedName = packageName.startsWith('@')
        ? packageName.split('/').slice(0, 2).join('/')
        : packageName.split('/')[0];

      if (!packages.includes(normalizedName)) {
        packages.push(normalizedName);
      }
    }
  }

  return packages;
}

/**
 * Validate that a string is valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Sanitize a string for safe logging (remove sensitive data)
 */
export function sanitizeForLogging(str: string): string {
  // Remove potential API keys, tokens, etc.
  return str
    .replace(/sk-[a-zA-Z0-9]{48,}/g, 'sk-***REDACTED***')
    .replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer ***REDACTED***')
    .replace(/password["\s]*[:=]["\s]*[^,}\s]+/gi, 'password: "***REDACTED***"');
}

/**
 * Calculate confidence score based on multiple factors
 */
export function calculateConfidence(factors: {
  [key: string]: { score: number; weight: number };
}): number {
  let totalScore = 0;
  let totalWeight = 0;

  for (const factor of Object.values(factors)) {
    totalScore += factor.score * factor.weight;
    totalWeight += factor.weight;
  }

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]!);
    } else {
      result[key] = source[key]!;
    }
  }

  return result;
}

/**
 * Parse content type header
 */
export function parseContentType(contentType: string): {
  type: string;
  subtype: string;
  parameters: Record<string, string>;
} {
  const [mainType, ...params] = contentType.split(';');
  const [type, subtype] = mainType.trim().split('/');

  const parameters: Record<string, string> = {};
  for (const param of params) {
    const [key, value] = param.trim().split('=');
    if (key && value) {
      parameters[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  }

  return {
    type: type?.trim() || '',
    subtype: subtype?.trim() || '',
    parameters
  };
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}