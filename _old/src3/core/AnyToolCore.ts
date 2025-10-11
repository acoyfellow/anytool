import { EventEmitter } from 'events';
import {
  AnyToolConfig,
  ToolGenerationRequest,
  ToolGenerationResult,
  GenerationError,
  AnyToolEvents,
  ToolGenerationError,
  AnyToolEnv,
  CacheEntry,
  ValidationResult
} from './types';
import { DocumentationCrawler } from '../crawlers/DocumentationCrawler';
import { PackageVerifier } from '../crawlers/PackageVerifier';
import { SmartPromptBuilder } from '../generation/SmartPromptBuilder';
import { ToolValidator } from '../generation/ToolValidator';
import { ToolExecutor } from '../execution/ToolExecutor';
import { CacheManager } from '../execution/CacheManager';
import { Logger } from '../utils/logger';
import { hashPrompt } from '../utils/helpers';

/**
 * AnyTool Core - The main orchestrator for intelligent tool generation
 *
 * Features:
 * - Live documentation crawling
 * - Real-time package compatibility verification
 * - Intelligent caching with usage analytics
 * - Rich error handling with actionable suggestions
 * - Full TypeScript support with event system
 */
export class AnyToolCore extends EventEmitter {
  private logger: Logger;
  private documentationCrawler: DocumentationCrawler;
  private packageVerifier: PackageVerifier;
  private promptBuilder: SmartPromptBuilder;
  private validator: ToolValidator;
  private executor: ToolExecutor;
  private cacheManager: CacheManager;

  constructor(private config: AnyToolConfig, private env?: AnyToolEnv) {
    super();

    this.logger = new Logger({
      level: config.logLevel || 'info',
      verbose: config.verbose || false,
      devMode: config.devMode || false
    });

    this.initializeComponents();
    this.setupEventHandlers();

    this.logger.info('AnyTool Core initialized', {
      devMode: config.devMode,
      cacheEnabled: !!config.cache,
      compilationEnabled: !!config.compiler
    });
  }

  private initializeComponents(): void {
    this.documentationCrawler = new DocumentationCrawler({
      urls: this.config.documentationUrls || [
        'https://developers.cloudflare.com/workers/',
        'https://developers.cloudflare.com/workers/runtime-apis/',
        'https://developers.cloudflare.com/workers/platform/nodejs-compatibility/'
      ],
      logger: this.logger
    });

    this.packageVerifier = new PackageVerifier({
      registries: this.config.packageRegistries || ['https://registry.npmjs.org'],
      logger: this.logger,
      devMode: this.config.devMode
    });

    this.promptBuilder = new SmartPromptBuilder({
      templates: this.config.promptTemplates,
      projectContext: this.config.projectContext,
      logger: this.logger
    });

    this.validator = new ToolValidator({
      rules: this.config.validationRules || [],
      logger: this.logger
    });

    this.executor = new ToolExecutor({
      compiler: this.config.compiler,
      useLocalCompiler: this.config.useLocalCompiler,
      timeout: this.config.compilationTimeout,
      env: this.env,
      logger: this.logger
    });

    this.cacheManager = new CacheManager({
      cache: this.config.cache,
      prefix: this.config.cachePrefix || 'anytool',
      ttl: this.config.cacheTTL || 7 * 24 * 60 * 60, // 7 days
      logger: this.logger
    });
  }

  private setupEventHandlers(): void {
    // Forward internal events to public API
    this.packageVerifier.on('package-verified', (compatibility) => {
      this.emit('package:verified', { compatibility });
      this.config.onPackageVerified?.(compatibility);
    });

    this.cacheManager.on('cache-hit', (hash, entry) => {
      this.emit('cache:hit', { hash, entry });
      this.config.onCacheHit?.(hash);
    });

    this.cacheManager.on('cache-miss', (hash) => {
      this.emit('cache:miss', { hash });
      this.config.onCacheMiss?.(hash);
    });

    this.documentationCrawler.on('documentation-fetched', (source) => {
      this.emit('documentation:fetched', { source });
    });
  }

  /**
   * Generate and execute a tool based on a natural language prompt
   */
  async generateAndExecute(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
    const startTime = Date.now();
    const hash = await hashPrompt(request.prompt);

    this.logger.info('Starting tool generation', {
      hash: hash.substring(0, 8),
      prompt: request.prompt.substring(0, 100)
    });

    this.emit('generation:start', { request });
    this.config.onGenerationStart?.(request);

    try {
      // 1. Check cache first (unless forcing regeneration)
      let cachedTool: CacheEntry | null = null;
      if (!request.forceRegenerate) {
        cachedTool = await this.cacheManager.get(hash);
        if (cachedTool) {
          this.logger.debug('Cache hit, executing cached tool', { hash: hash.substring(0, 8) });

          const result = await this.executor.execute({
            bundledCode: cachedTool.bundledCode,
            input: request.input || '',
            hash,
            metadata: cachedTool.metadata
          });

          const finalResult: ToolGenerationResult = {
            output: result.output,
            contentType: result.contentType,
            outputType: cachedTool.outputType,
            outputDescription: cachedTool.outputDescription,
            toolHash: hash,
            packages: cachedTool.packages,
            cached: true,
            executionTime: Date.now() - startTime,
            metadata: {
              promptTokens: 0,
              completionTokens: 0,
              compilationTime: 0,
              validationTime: 0
            }
          };

          this.emit('generation:complete', { result: finalResult });
          this.config.onGenerationComplete?.(finalResult);
          return finalResult;
        }
      }

      // 2. Generate new tool
      const generationResult = await this.generateNewTool(request, hash);

      const finalResult: ToolGenerationResult = {
        ...generationResult,
        executionTime: Date.now() - startTime
      };

      this.emit('generation:complete', { result: finalResult });
      this.config.onGenerationComplete?.(finalResult);
      return finalResult;

    } catch (error) {
      const generationError: GenerationError = {
        error: error instanceof Error ? error.message : String(error),
        type: error instanceof ToolGenerationError ? error.type : 'execution',
        suggestion: error instanceof ToolGenerationError ? error.suggestion : undefined,
        retryable: error instanceof ToolGenerationError ? error.retryable : false,
        details: error instanceof ToolGenerationError ? error.details : undefined
      };

      this.logger.error('Tool generation failed', generationError);
      this.emit('generation:error', { error: generationError });
      this.config.onError?.(generationError);

      throw new ToolGenerationError(
        generationError.error,
        generationError.type,
        generationError.suggestion,
        generationError.retryable,
        generationError.details
      );
    }
  }

  private async generateNewTool(request: ToolGenerationRequest, hash: string): Promise<ToolGenerationResult> {
    this.logger.debug('Generating new tool', { hash: hash.substring(0, 8) });

    // 1. Crawl live documentation
    const documentation = await this.documentationCrawler.fetchRelevantDocs(request.prompt);
    this.logger.debug('Fetched documentation', { sources: documentation.length });

    // 2. Build intelligent prompt with live context
    const prompt = await this.promptBuilder.buildPrompt({
      userPrompt: request.prompt,
      documentation,
      userContext: request.userContext,
      outputHints: request.outputHints
    });
    this.logger.debug('Built intelligent prompt', { length: prompt.length });

    // 3. Generate code with AI
    const aiResponse = await this.generateWithAI(prompt);
    this.logger.debug('AI generation complete', {
      codeLength: aiResponse.code.length,
      packages: aiResponse.packages
    });

    // 4. Verify package compatibility in real-time
    const compatibilityResults = await this.packageVerifier.verifyPackages(aiResponse.packages);
    const incompatiblePackages = compatibilityResults.filter(r => !r.compatible);

    if (incompatiblePackages.length > 0) {
      const suggestions = incompatiblePackages.map(p => p.alternative).filter(Boolean);
      throw new ToolGenerationError(
        `Incompatible packages detected: ${incompatiblePackages.map(p => p.name).join(', ')}`,
        'compatibility',
        suggestions.length > 0 ? `Try using: ${suggestions.join(', ')}` : undefined,
        true,
        { incompatiblePackages, suggestions }
      );
    }

    // 5. Compile the generated code
    const compilationResult = await this.executor.compile({
      code: aiResponse.code,
      packages: aiResponse.packages,
      target: 'worker'
    });

    if (!compilationResult.success) {
      throw new ToolGenerationError(
        `Compilation failed: ${compilationResult.errors?.join(', ')}`,
        'compilation',
        'Check package imports and Worker API usage',
        true,
        { errors: compilationResult.errors, warnings: compilationResult.warnings }
      );
    }

    // 6. Validate the generated tool
    const validationResult = await this.validator.validate({
      code: aiResponse.code,
      bundledCode: compilationResult.bundledCode!,
      testInput: request.input || 'test',
      expectedOutput: request.outputHints
    });

    if (!validationResult.valid) {
      throw new ToolGenerationError(
        `Validation failed: ${validationResult.errors.join(', ')}`,
        'validation',
        validationResult.suggestions.join(', '),
        true,
        {
          errors: validationResult.errors,
          warnings: validationResult.warnings,
          suggestions: validationResult.suggestions
        }
      );
    }

    // 7. Execute the tool
    const executionResult = await this.executor.execute({
      bundledCode: compilationResult.bundledCode!,
      input: request.input || '',
      hash
    });

    // 8. Cache the successful tool
    const cacheEntry: CacheEntry = {
      hash,
      bundledCode: compilationResult.bundledCode!,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 1,
      packages: aiResponse.packages,
      outputType: aiResponse.outputType,
      outputDescription: aiResponse.outputDescription,
      metadata: {
        generationVersion: '3.0.0',
        compatibility: compatibilityResults,
        documentation
      }
    };

    await this.cacheManager.set(hash, cacheEntry);
    this.logger.debug('Cached new tool', { hash: hash.substring(0, 8) });

    return {
      output: executionResult.output,
      contentType: executionResult.contentType,
      outputType: aiResponse.outputType,
      outputDescription: aiResponse.outputDescription,
      toolHash: hash,
      packages: aiResponse.packages,
      cached: false,
      generatedCode: compilationResult.bundledCode,
      executionTime: 0, // Will be set by caller
      metadata: {
        promptTokens: aiResponse.usage?.promptTokens || 0,
        completionTokens: aiResponse.usage?.completionTokens || 0,
        compilationTime: compilationResult.stats.compilationTime,
        validationTime: 0 // TODO: Add timing to validation
      }
    };
  }

  private async generateWithAI(prompt: string): Promise<{
    code: string;
    packages: string[];
    outputType: string;
    outputDescription: string;
    example: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
    };
  }> {
    // This would integrate with your AI generation logic
    // For now, returning a placeholder structure
    throw new Error('AI generation not implemented - integrate with your OpenAI setup');
  }

  /**
   * Handle HTTP requests (for integration with Hono/Workers)
   */
  async handleRequest(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (request.method === 'POST' && url.pathname === '/generate') {
        const body = await request.json() as ToolGenerationRequest;
        const result = await this.generateAndExecute(body);
        return Response.json(result);
      }

      if (request.method === 'GET' && url.pathname === '/health') {
        return Response.json({
          status: 'healthy',
          version: '3.0.0',
          features: {
            liveDocs: this.config.enableLiveDocsFetch !== false,
            packageVerification: true,
            caching: !!this.config.cache,
            compilation: !!this.config.compiler
          }
        });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      this.logger.error('Request handling failed', error);
      return Response.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }

  /**
   * Get usage statistics and health metrics
   */
  async getMetrics(): Promise<{
    cacheStats: any;
    packageVerificationStats: any;
    generationStats: any;
  }> {
    return {
      cacheStats: await this.cacheManager.getStats(),
      packageVerificationStats: await this.packageVerifier.getStats(),
      generationStats: {
        // TODO: Add generation metrics
      }
    };
  }

  /**
   * Clear all caches (useful for development)
   */
  async clearCache(): Promise<void> {
    await this.cacheManager.clear();
    this.logger.info('Cache cleared');
  }

  /**
   * Preload documentation and package data
   */
  async warmup(): Promise<void> {
    this.logger.info('Warming up AnyTool Core...');
    await Promise.all([
      this.documentationCrawler.preloadDocs(),
      this.packageVerifier.preloadPopularPackages()
    ]);
    this.logger.info('Warmup complete');
  }
}