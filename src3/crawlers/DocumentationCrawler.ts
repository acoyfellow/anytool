import { EventEmitter } from 'events';
import { DocumentationSource } from '../core/types';
import { Logger } from '../utils/logger';

/**
 * DocumentationCrawler - Fetches and processes live documentation
 *
 * This component fetches the latest Cloudflare Workers documentation
 * to ensure the AI has current information about:
 * - Available APIs and runtime features
 * - Package compatibility requirements
 * - Best practices and constraints
 * - New features and deprecations
 */
export class DocumentationCrawler extends EventEmitter {
  private cache = new Map<string, DocumentationSource>();
  private lastFetch = new Map<string, number>();

  constructor(
    private config: {
      urls: string[];
      logger: Logger;
      cacheTTL?: number;
      maxConcurrent?: number;
    }
  ) {
    super();
  }

  /**
   * Fetch documentation relevant to a specific prompt
   */
  async fetchRelevantDocs(prompt: string): Promise<DocumentationSource[]> {
    const relevantUrls = this.selectRelevantUrls(prompt);
    this.config.logger.debug('Fetching relevant documentation', {
      prompt: prompt.substring(0, 50),
      urls: relevantUrls.length
    });

    const docs = await Promise.all(
      relevantUrls.map(url => this.fetchDoc(url))
    );

    return docs
      .filter(doc => doc !== null)
      .map(doc => ({ ...doc!, relevanceScore: this.calculateRelevance(doc!.content, prompt) }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private selectRelevantUrls(prompt: string): string[] {
    const lowerPrompt = prompt.toLowerCase();
    const baseUrls = [...this.config.urls];

    // Add specific documentation based on prompt content
    const specificDocs = [
      {
        keywords: ['package', 'npm', 'import', 'module'],
        url: 'https://developers.cloudflare.com/workers/platform/nodejs-compatibility/'
      },
      {
        keywords: ['api', 'fetch', 'request', 'response', 'http'],
        url: 'https://developers.cloudflare.com/workers/runtime-apis/request/'
      },
      {
        keywords: ['storage', 'kv', 'durable', 'r2', 'database'],
        url: 'https://developers.cloudflare.com/workers/runtime-apis/kv/'
      },
      {
        keywords: ['crypto', 'encryption', 'hash', 'jwt', 'token'],
        url: 'https://developers.cloudflare.com/workers/runtime-apis/web-crypto/'
      },
      {
        keywords: ['websocket', 'socket', 'realtime', 'streaming'],
        url: 'https://developers.cloudflare.com/workers/runtime-apis/websockets/'
      },
      {
        keywords: ['url', 'routing', 'pathname', 'query'],
        url: 'https://developers.cloudflare.com/workers/runtime-apis/url/'
      },
      {
        keywords: ['environment', 'binding', 'variable', 'secret'],
        url: 'https://developers.cloudflare.com/workers/configuration/environment-variables/'
      }
    ];

    // Add URLs based on keyword matching
    for (const docInfo of specificDocs) {
      if (docInfo.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        if (!baseUrls.includes(docInfo.url)) {
          baseUrls.push(docInfo.url);
        }
      }
    }

    return baseUrls;
  }

  private async fetchDoc(url: string): Promise<DocumentationSource | null> {
    try {
      // Check cache first
      const cached = this.cache.get(url);
      const lastFetch = this.lastFetch.get(url) || 0;
      const cacheTTL = this.config.cacheTTL || 60 * 60 * 1000; // 1 hour default

      if (cached && Date.now() - lastFetch < cacheTTL) {
        this.config.logger.debug('Using cached documentation', { url });
        return cached;
      }

      this.config.logger.debug('Fetching fresh documentation', { url });

      const response = await fetch(url);
      if (!response.ok) {
        this.config.logger.warn('Failed to fetch documentation', { url, status: response.status });
        return null;
      }

      const html = await response.text();
      const content = this.extractContent(html);
      const title = this.extractTitle(html);

      const doc: DocumentationSource = {
        url,
        title,
        content,
        lastFetched: new Date(),
        relevanceScore: 0 // Will be calculated later
      };

      // Cache the result
      this.cache.set(url, doc);
      this.lastFetch.set(url, Date.now());

      this.emit('documentation-fetched', doc);
      this.config.logger.debug('Documentation fetched successfully', {
        url,
        title,
        contentLength: content.length
      });

      return doc;

    } catch (error) {
      this.config.logger.error('Error fetching documentation', { url, error });
      return null;
    }
  }

  private extractContent(html: string): string {
    // Simple HTML to text conversion
    // In a real implementation, you might want to use a proper HTML parser
    return html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/\s+/g, ' ').trim();
    }

    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return h1Match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    return 'Cloudflare Workers Documentation';
  }

  private calculateRelevance(content: string, prompt: string): number {
    const lowerContent = content.toLowerCase();
    const lowerPrompt = prompt.toLowerCase();

    // Extract keywords from prompt
    const keywords = lowerPrompt
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['make', 'create', 'build', 'generate', 'using', 'with', 'that'].includes(word));

    if (keywords.length === 0) return 0.1;

    // Calculate keyword density
    let matches = 0;
    let totalKeywordOccurrences = 0;

    for (const keyword of keywords) {
      const occurrences = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
      if (occurrences > 0) {
        matches++;
        totalKeywordOccurrences += occurrences;
      }
    }

    // Relevance score based on:
    // - Percentage of keywords found
    // - Frequency of keyword occurrences
    // - Length bonus for comprehensive docs
    const keywordCoverage = matches / keywords.length;
    const keywordDensity = Math.min(totalKeywordOccurrences / 100, 1); // Cap at 1
    const lengthBonus = Math.min(content.length / 10000, 0.2); // Small bonus for comprehensive docs

    return keywordCoverage * 0.7 + keywordDensity * 0.2 + lengthBonus * 0.1;
  }

  /**
   * Preload documentation for common use cases
   */
  async preloadDocs(): Promise<void> {
    this.config.logger.info('Preloading documentation...');

    const coreUrls = [
      'https://developers.cloudflare.com/workers/',
      'https://developers.cloudflare.com/workers/runtime-apis/',
      'https://developers.cloudflare.com/workers/platform/nodejs-compatibility/'
    ];

    await Promise.all(coreUrls.map(url => this.fetchDoc(url)));
    this.config.logger.info('Documentation preloading complete');
  }

  /**
   * Get documentation statistics
   */
  getStats(): {
    cachedDocs: number;
    totalFetches: number;
    averageContentLength: number;
  } {
    const docs = Array.from(this.cache.values());
    return {
      cachedDocs: this.cache.size,
      totalFetches: this.lastFetch.size,
      averageContentLength: docs.length > 0
        ? Math.round(docs.reduce((sum, doc) => sum + doc.content.length, 0) / docs.length)
        : 0
    };
  }

  /**
   * Clear documentation cache
   */
  clearCache(): void {
    this.cache.clear();
    this.lastFetch.clear();
    this.config.logger.debug('Documentation cache cleared');
  }
}