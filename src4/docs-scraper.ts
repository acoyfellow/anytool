/**
 * Script to scrape Cloudflare docs and populate R2 for AI Search
 * Run this separately to populate your R2 bucket with CF Workers docs
 */

import { parse } from 'node-html-parser';

export async function scrapeCFDocs(r2Bucket: any, aiSearch: any) {
  console.log('Starting Cloudflare docs scraping...');

  // Start with llms.txt to get the structure
  const llmsTxtResponse = await fetch('https://developers.cloudflare.com/llms.txt');
  const llmsTxt = await llmsTxtResponse.text();

  // Extract all markdown file URLs
  const markdownUrls = extractMarkdownUrls(llmsTxt);
  console.log(`Found ${markdownUrls.length} markdown files to scrape`);

  let processed = 0;
  let errors = 0;

  for (const url of markdownUrls) {
    try {
      await scrapeAndStoreDoc(url, r2Bucket, aiSearch);
      processed++;

      if (processed % 10 === 0) {
        console.log(`Processed ${processed}/${markdownUrls.length} docs`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Error processing ${url}:`, error);
      errors++;
    }
  }

  console.log(`Scraping complete: ${processed} processed, ${errors} errors`);
}

function extractMarkdownUrls(llmsTxt: string): string[] {
  const urls: string[] = [];
  const lines = llmsTxt.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('https://') && trimmed.includes('.md')) {
      urls.push(trimmed);
    }
  }

  return urls;
}

async function scrapeAndStoreDoc(url: string, r2Bucket: any, aiSearch: any) {
  // Convert GitHub raw URL to actual docs URL for better context
  const docsUrl = url
    .replace('https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/content/', 'https://developers.cloudflare.com/')
    .replace('.md', '/');

  // Fetch the markdown content
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const markdown = await response.text();

  // Extract title from markdown (first # heading)
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : extractTitleFromUrl(url);

  // Clean up markdown content
  const cleanContent = cleanMarkdown(markdown);

  // Create document ID from URL
  const docId = url.replace('https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/content/', '')
    .replace('.md', '')
    .replace(/\//g, '_');

  // Store in R2
  const docData = {
    id: docId,
    title,
    url: docsUrl,
    originalUrl: url,
    content: cleanContent,
    scrapedAt: new Date().toISOString(),
    wordCount: cleanContent.split(' ').length
  };

  await r2Bucket.put(`docs/${docId}.json`, JSON.stringify(docData, null, 2));

  // Add to AI Search if available
  if (aiSearch) {
    try {
      await aiSearch.upsert([{
        id: docId,
        values: await generateEmbedding(cleanContent.substring(0, 2000)), // Truncate for embedding
        metadata: {
          title,
          url: docsUrl,
          content: cleanContent.substring(0, 1000), // Store excerpt for context
          type: 'cloudflare-docs',
          section: extractSection(url)
        }
      }]);
    } catch (error) {
      console.warn(`Failed to add ${docId} to AI Search:`, error);
    }
  }
}

function extractTitleFromUrl(url: string): string {
  return url
    .split('/')
    .pop()
    ?.replace('.md', '')
    ?.replace(/-/g, ' ')
    ?.replace(/\b\w/g, l => l.toUpperCase()) || 'Untitled';
}

function extractSection(url: string): string {
  const parts = url.split('/');
  const contentIndex = parts.findIndex(part => part === 'content');
  if (contentIndex >= 0 && contentIndex < parts.length - 1) {
    return parts[contentIndex + 1];
  }
  return 'general';
}

function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n/, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove code blocks (keep content but remove language specifiers)
    .replace(/```[\w]*\n([\s\S]*?)```/g, '$1')
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// Placeholder for embedding generation
// In practice, you'd use OpenAI embeddings or similar
async function generateEmbedding(text: string): Promise<number[]> {
  // This is a placeholder - you'd implement actual embedding generation here
  // For now, return a dummy embedding
  return new Array(1536).fill(0).map(() => Math.random());
}

// CLI script to run the scraper
if (import.meta.main) {
  console.log('Cloudflare docs scraper');
  console.log('This script needs to be adapted for your specific R2 and AI Search setup');
  console.log('Example usage:');
  console.log('');
  console.log('import { scrapeCFDocs } from "./docs-scraper.ts";');
  console.log('await scrapeCFDocs(r2Bucket, aiSearch);');
}