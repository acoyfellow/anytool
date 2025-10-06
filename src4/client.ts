/**
 * Simple client for dogfooding anytool in inbox.dog
 */

export interface AnytoolResponse {
  output: string;
  contentType: string;
  outputType: string;
  outputDescription: string;
  toolHash: string;
  packages: string[];
  cached: boolean;
  generatedCode?: string;
}

export interface AnytoolError {
  error: string;
}

export class AnytoolClient {
  constructor(
    private config: {
      endpoint: string;
      apiKey: string;
    }
  ) {}

  async generate(params: {
    prompt: string;
    input?: string;
    forceRegenerate?: boolean;
  }): Promise<AnytoolResponse> {
    const response = await fetch(`${this.config.endpoint}/api/tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as AnytoolError).error || `HTTP ${response.status}`);
    }

    return data as AnytoolResponse;
  }

  async health(): Promise<{ status: string; service: string; version: string }> {
    const response = await fetch(`${this.config.endpoint}/health`);
    return await response.json();
  }

  async clearCache(): Promise<{ message: string }> {
    const response = await fetch(`${this.config.endpoint}/api/cache`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': this.config.apiKey
      }
    });

    return await response.json();
  }
}

// Helper functions for inbox.dog
export async function parseEmailIntent(anytool: AnytoolClient, subject: string) {
  const result = await anytool.generate({
    prompt: 'Extract intent and priority from email subject, return JSON with {intent, priority, category}',
    input: subject
  });

  try {
    return JSON.parse(result.output);
  } catch {
    return { intent: 'unknown', priority: 'normal', category: 'other' };
  }
}

export async function summarizeEmail(anytool: AnytoolClient, body: string) {
  const result = await anytool.generate({
    prompt: 'Summarize email content in one sentence',
    input: body
  });

  return result.output;
}

export async function extractContacts(anytool: AnytoolClient, signature: string) {
  const result = await anytool.generate({
    prompt: 'Extract contact information (email, phone, name) from email signature, return JSON',
    input: signature
  });

  try {
    return JSON.parse(result.output);
  } catch {
    return { contacts: [] };
  }
}

export async function generateQRCode(anytool: AnytoolClient, url: string) {
  const result = await anytool.generate({
    prompt: 'Generate QR code SVG for URL',
    input: url
  });

  return result.output; // SVG string
}