// Core type definitions for AnyTool

export interface ToolGenerationRequest {
  prompt: string;
  input?: string;
  forceRegenerate?: boolean;
  userContext?: string;
  outputHints?: {
    preferredType?: 'json' | 'html' | 'svg' | 'text' | 'image';
    contentType?: string;
  };
}

export interface ToolGenerationResult {
  output: string;
  contentType: string;
  outputType: string;
  outputDescription: string;
  toolHash: string;
  packages: string[];
  cached: boolean;
  generatedCode?: string;
  executionTime: number;
  metadata: {
    promptTokens: number;
    completionTokens: number;
    compilationTime: number;
    validationTime: number;
  };
}

export interface GenerationError {
  error: string;
  type: 'validation' | 'compilation' | 'execution' | 'compatibility' | 'network';
  suggestion?: string;
  documentation?: string;
  retryable: boolean;
  details?: Record<string, any>;
}

export interface PackageCompatibility {
  name: string;
  version?: string;
  compatible: boolean;
  reason?: string;
  alternative?: string;
  confidence: number; // 0-1
  verificationMethod: 'documentation' | 'source-analysis' | 'runtime-test' | 'cached';
  lastVerified: Date;
}

export interface DocumentationSource {
  url: string;
  title: string;
  content: string;
  lastFetched: Date;
  relevanceScore: number; // 0-1
}

export interface ProjectContext {
  name: string;
  domain: string;
  constraints: string[];
  preferredPackages?: string[];
  forbiddenPackages?: string[];
  customInstructions?: string;
}

export interface CacheEntry {
  hash: string;
  bundledCode: string;
  createdAt: number;
  lastUsed: number;
  useCount: number;
  packages: string[];
  outputType: string;
  outputDescription: string;
  metadata: {
    generationVersion: string;
    compatibility: PackageCompatibility[];
    documentation: DocumentationSource[];
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  executionResult?: {
    output: string;
    contentType: string;
    executionTime: number;
  };
}

export interface CompilationRequest {
  code: string;
  packages: string[];
  target: 'worker' | 'nodejs' | 'browser';
  timeout?: number;
}

export interface CompilationResult {
  success: boolean;
  bundledCode?: string;
  packages: string[];
  errors?: string[];
  warnings?: string[];
  stats: {
    bundleSize: number;
    compilationTime: number;
  };
}

// Configuration interfaces
export interface AnyToolConfig {
  // Required
  openaiApiKey: string;

  // Storage & Caching
  cache?: R2Bucket;
  cachePrefix?: string;
  cacheTTL?: number;

  // Compilation
  compiler?: DurableObjectNamespace;
  compilationTimeout?: number;
  useLocalCompiler?: boolean;

  // Intelligence & Documentation
  documentationUrls?: string[];
  packageRegistries?: string[];
  enableLiveDocsFetch?: boolean;

  // Project Context
  projectContext?: ProjectContext;

  // Development & Debugging
  devMode?: boolean;
  verbose?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  enableMetrics?: boolean;

  // Customization
  promptTemplates?: Record<string, string>;
  validationRules?: ValidationRule[];
  maxRetries?: number;
  timeouts?: {
    generation: number;
    compilation: number;
    execution: number;
    documentation: number;
  };

  // Callbacks & Hooks
  onGenerationStart?: (request: ToolGenerationRequest) => void;
  onGenerationComplete?: (result: ToolGenerationResult) => void;
  onError?: (error: GenerationError) => void;
  onPackageVerified?: (compatibility: PackageCompatibility) => void;
  onCacheHit?: (hash: string) => void;
  onCacheMiss?: (hash: string) => void;
}

export interface ValidationRule {
  name: string;
  check: (code: string, result: any) => ValidationResult;
  severity: 'error' | 'warning' | 'info';
  description: string;
}

// Event system
export interface AnyToolEvents {
  'generation:start': { request: ToolGenerationRequest };
  'generation:complete': { result: ToolGenerationResult };
  'generation:error': { error: GenerationError };
  'package:verified': { compatibility: PackageCompatibility };
  'documentation:fetched': { source: DocumentationSource };
  'cache:hit': { hash: string; entry: CacheEntry };
  'cache:miss': { hash: string };
  'compilation:start': { request: CompilationRequest };
  'compilation:complete': { result: CompilationResult };
  'validation:complete': { result: ValidationResult };
}

// Utility types
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type ToolOutputType = 'json' | 'html' | 'svg' | 'text' | 'image' | 'csv' | 'xml';
export type PackageVerificationMethod = 'documentation' | 'source-analysis' | 'runtime-test' | 'cached';

// Error types
export class ToolGenerationError extends Error {
  constructor(
    message: string,
    public type: GenerationError['type'],
    public suggestion?: string,
    public retryable: boolean = false,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ToolGenerationError';
  }
}

export class PackageCompatibilityError extends ToolGenerationError {
  constructor(
    packageName: string,
    reason: string,
    alternative?: string
  ) {
    super(
      `Package '${packageName}' is incompatible: ${reason}`,
      'compatibility',
      alternative ? `Try using '${alternative}' instead` : undefined,
      true,
      { packageName, reason, alternative }
    );
  }
}

export class ValidationError extends ToolGenerationError {
  constructor(
    message: string,
    public validationErrors: string[],
    public warnings: string[] = []
  ) {
    super(message, 'validation', undefined, true, { validationErrors, warnings });
  }
}

// Environment bindings (for CF Workers)
export interface AnyToolEnv {
  OPENAI_API_KEY: string;
  TOOL_CACHE?: R2Bucket;
  BUN_COMPILER_DO?: DurableObjectNamespace;
  HISTORY_DO?: DurableObjectNamespace;
  LOADER?: any; // Worker Loaders binding
  ENVIRONMENT?: string;

  // Optional analytics/monitoring
  ANALYTICS?: any;
  SENTRY_DSN?: string;
}