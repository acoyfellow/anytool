/**
 * AnyTool Core - Main exports for easy integration
 */

// Core components
export { AnyToolCore } from './core/AnyToolCore';
export * from './core/types';

// Utilities
export { Logger } from './utils/logger';
export * from './utils/helpers';

// Components (for advanced usage)
export { DocumentationCrawler } from './crawlers/DocumentationCrawler';
export { PackageVerifier } from './crawlers/PackageVerifier';
export { SmartPromptBuilder } from './generation/SmartPromptBuilder';

// Convenience functions for common use cases
export {
  createInboxDogToolGenerator,
  createInboxDogAPI,
  InboxDogToolExamples,
  setupInboxDogTools
} from './examples/inbox-dog';

// Quick setup functions
import { AnyToolCore, AnyToolConfig } from './core/AnyToolCore';
import { AnyToolEnv } from './core/types';

/**
 * Create a basic AnyTool instance with minimal configuration
 */
export function createAnyTool(openaiApiKey: string): AnyToolCore {
  return new AnyToolCore({ openaiApiKey });
}

/**
 * Create an AnyTool instance optimized for Cloudflare Workers
 */
export function createWorkersTool(config: {
  openaiApiKey: string;
  cache?: R2Bucket;
  compiler?: DurableObjectNamespace;
  projectName?: string;
  domain?: string;
}): AnyToolCore {
  const anyToolConfig: AnyToolConfig = {
    openaiApiKey: config.openaiApiKey,
    cache: config.cache,
    compiler: config.compiler,
    enableLiveDocsFetch: true,
    logLevel: 'info'
  };

  if (config.projectName || config.domain) {
    anyToolConfig.projectContext = {
      name: config.projectName || 'CF Workers Project',
      domain: config.domain || 'general',
      constraints: ['Cloudflare Workers runtime', 'V8 JavaScript engine']
    };
  }

  return new AnyToolCore(anyToolConfig);
}

/**
 * Create a development-optimized AnyTool instance
 */
export function createDevTool(openaiApiKey: string): AnyToolCore {
  return new AnyToolCore({
    openaiApiKey,
    devMode: true,
    verbose: true,
    logLevel: 'debug',
    enableLiveDocsFetch: true
  });
}

/**
 * Create a Hono app with AnyTool endpoints
 */
export function createAnyToolApp(config: AnyToolConfig & {
  customMiddleware?: any[];
  basePath?: string;
}) {
  const { customMiddleware = [], basePath = '/api/tools', ...anyToolConfig } = config;

  // This would return a complete Hono app
  // Implementation would depend on your specific Hono setup
  throw new Error('createAnyToolApp not yet implemented - integrate with your Hono patterns');
}

/**
 * Generate a single tool without setting up a persistent instance
 */
export async function generateTool(params: {
  prompt: string;
  input?: string;
  apiKey: string;
  cache?: R2Bucket;
  userContext?: string;
}): Promise<{
  output: string;
  contentType: string;
  packages: string[];
  executionTime: number;
}> {
  const tools = new AnyToolCore({
    openaiApiKey: params.apiKey,
    cache: params.cache
  });

  const result = await tools.generateAndExecute({
    prompt: params.prompt,
    input: params.input,
    userContext: params.userContext
  });

  return {
    output: result.output,
    contentType: result.contentType,
    packages: result.packages,
    executionTime: result.executionTime
  };
}

// Re-export everything for comprehensive access
export default AnyToolCore;