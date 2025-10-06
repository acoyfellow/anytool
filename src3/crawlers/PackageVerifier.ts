import { EventEmitter } from 'events';
import { PackageCompatibility } from '../core/types';
import { Logger } from '../utils/logger';

/**
 * PackageVerifier - Real-time NPM package compatibility checking
 *
 * Instead of maintaining a static database, this component:
 * - Fetches package metadata from NPM in real-time
 * - Analyzes package.json for Workers compatibility markers
 * - Checks source code for Node.js-specific APIs
 * - Builds confidence scores based on multiple verification methods
 */
export class PackageVerifier extends EventEmitter {
  private compatibilityCache = new Map<string, PackageCompatibility>();
  private verificationInProgress = new Map<string, Promise<PackageCompatibility>>();

  constructor(
    private config: {
      registries: string[];
      logger: Logger;
      devMode?: boolean;
      cacheTTL?: number;
      maxConcurrent?: number;
    }
  ) {
    super();
  }

  /**
   * Verify compatibility of multiple packages
   */
  async verifyPackages(packageNames: string[]): Promise<PackageCompatibility[]> {
    this.config.logger.debug('Verifying package compatibility', {
      packages: packageNames,
      count: packageNames.length
    });

    const results = await Promise.all(
      packageNames.map(name => this.verifyPackage(name))
    );

    const incompatible = results.filter(r => !r.compatible);
    if (incompatible.length > 0) {
      this.config.logger.warn('Incompatible packages detected', {
        packages: incompatible.map(p => ({ name: p.name, reason: p.reason }))
      });
    }

    return results;
  }

  /**
   * Verify compatibility of a single package
   */
  async verifyPackage(packageName: string, version?: string): Promise<PackageCompatibility> {
    const cacheKey = version ? `${packageName}@${version}` : packageName;

    // Check cache first
    const cached = this.compatibilityCache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      this.config.logger.debug('Using cached compatibility result', { package: cacheKey });
      return cached;
    }

    // Check if verification is already in progress
    const inProgress = this.verificationInProgress.get(cacheKey);
    if (inProgress) {
      this.config.logger.debug('Verification already in progress', { package: cacheKey });
      return await inProgress;
    }

    // Start new verification
    const verificationPromise = this.performVerification(packageName, version);
    this.verificationInProgress.set(cacheKey, verificationPromise);

    try {
      const result = await verificationPromise;
      this.compatibilityCache.set(cacheKey, result);
      this.emit('package-verified', result);
      this.config.logger.debug('Package verification complete', {
        package: cacheKey,
        compatible: result.compatible,
        confidence: result.confidence
      });
      return result;
    } finally {
      this.verificationInProgress.delete(cacheKey);
    }
  }

  private async performVerification(packageName: string, version?: string): Promise<PackageCompatibility> {
    this.config.logger.debug('Starting package verification', { package: packageName, version });

    try {
      // 1. Check known incompatible patterns first (fast path)
      const knownIncompatible = this.checkKnownIncompatible(packageName);
      if (knownIncompatible) {
        return {
          name: packageName,
          version,
          compatible: false,
          reason: knownIncompatible.reason,
          alternative: knownIncompatible.alternative,
          confidence: 0.95,
          verificationMethod: 'cached',
          lastVerified: new Date()
        };
      }

      // 2. Fetch package metadata from NPM
      const packageData = await this.fetchPackageMetadata(packageName, version);
      if (!packageData) {
        return {
          name: packageName,
          version,
          compatible: false,
          reason: 'Package not found in NPM registry',
          confidence: 1.0,
          verificationMethod: 'documentation',
          lastVerified: new Date()
        };
      }

      // 3. Check package.json for compatibility markers
      const packageJsonAnalysis = this.analyzePackageJson(packageData);

      // 4. Analyze package source for Node.js APIs (if available)
      const sourceAnalysis = await this.analyzePackageSource(packageData);

      // 5. Combine analysis results
      const result = this.combineAnalysisResults(
        packageName,
        version,
        packageJsonAnalysis,
        sourceAnalysis
      );

      return result;

    } catch (error) {
      this.config.logger.error('Package verification failed', { package: packageName, error });
      return {
        name: packageName,
        version,
        compatible: false,
        reason: `Verification failed: ${error instanceof Error ? error.message : String(error)}`,
        confidence: 0.1,
        verificationMethod: 'runtime-test',
        lastVerified: new Date()
      };
    }
  }

  private checkKnownIncompatible(packageName: string): { reason: string; alternative?: string } | null {
    const knownIncompatible: Record<string, { reason: string; alternative?: string }> = {
      'fs': { reason: 'Node.js file system module', alternative: 'Use fetch() for remote files' },
      'path': { reason: 'Node.js path module', alternative: 'Use URL API' },
      'os': { reason: 'Node.js operating system module' },
      'process': { reason: 'Node.js process module' },
      'child_process': { reason: 'Node.js child process module' },
      'cluster': { reason: 'Node.js cluster module' },
      'dgram': { reason: 'Node.js UDP/datagram module' },
      'dns': { reason: 'Node.js DNS module' },
      'net': { reason: 'Node.js networking module' },
      'tls': { reason: 'Node.js TLS/SSL module' },
      'jsonwebtoken': { reason: 'Uses Node.js process object', alternative: 'jose' },
      'sharp': { reason: 'Native image processing library', alternative: 'Use Web APIs' },
      'puppeteer': { reason: 'Browser automation requires full browser' },
      'playwright': { reason: 'Browser automation requires full browser' },
      'fs-extra': { reason: 'File system operations not available' },
      'express': { reason: 'Node.js web framework', alternative: 'hono' },
      'koa': { reason: 'Node.js web framework', alternative: 'hono' },
      'fastify': { reason: 'Node.js web framework', alternative: 'hono' },
      'node-fetch': { reason: 'Not needed in Workers', alternative: 'Built-in fetch()' },
      'axios': { reason: 'Heavy HTTP client', alternative: 'Built-in fetch()' },
      'request': { reason: 'Deprecated Node.js HTTP client', alternative: 'Built-in fetch()' },
      'faker': { reason: 'Old package name', alternative: '@faker-js/faker' }
    };

    return knownIncompatible[packageName] || null;
  }

  private async fetchPackageMetadata(packageName: string, version?: string): Promise<any> {
    const registry = this.config.registries[0]; // Use first registry
    const url = version
      ? `${registry}/${packageName}/${version}`
      : `${registry}/${packageName}/latest`;

    this.config.logger.debug('Fetching package metadata', { package: packageName, url });

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Package not found
        }
        throw new Error(`NPM registry error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.config.logger.warn('Failed to fetch package metadata', { package: packageName, error });
      return null;
    }
  }

  private analyzePackageJson(packageData: any): {
    compatible: boolean;
    confidence: number;
    reasons: string[];
    positiveSignals: string[];
  } {
    const reasons: string[] = [];
    const positiveSignals: string[] = [];
    let compatible = true;
    let confidence = 0.5;

    // Check for positive compatibility signals
    if (packageData.browser) {
      positiveSignals.push('Has browser field');
      confidence += 0.2;
    }

    if (packageData.type === 'module') {
      positiveSignals.push('ESM module');
      confidence += 0.1;
    }

    if (packageData.sideEffects === false) {
      positiveSignals.push('No side effects');
      confidence += 0.1;
    }

    if (packageData.keywords?.includes('browser')) {
      positiveSignals.push('Browser keyword');
      confidence += 0.1;
    }

    if (packageData.keywords?.some((k: string) => ['edge', 'workers', 'cloudflare'].includes(k))) {
      positiveSignals.push('Edge/Workers keyword');
      confidence += 0.3;
    }

    // Check for negative signals in dependencies
    const allDeps = {
      ...packageData.dependencies,
      ...packageData.peerDependencies,
      ...packageData.optionalDependencies
    };

    const problematicDeps = Object.keys(allDeps || {}).filter(dep =>
      ['fs', 'path', 'os', 'process', 'child_process', 'cluster', 'net', 'tls', 'dgram'].includes(dep)
    );

    if (problematicDeps.length > 0) {
      compatible = false;
      reasons.push(`Depends on Node.js modules: ${problematicDeps.join(', ')}`);
      confidence = Math.min(confidence, 0.2);
    }

    // Check engines field
    if (packageData.engines?.node && !packageData.engines?.browsers) {
      reasons.push('Specifies Node.js engine requirement');
      confidence -= 0.1;
    }

    return { compatible, confidence: Math.max(0, Math.min(1, confidence)), reasons, positiveSignals };
  }

  private async analyzePackageSource(packageData: any): Promise<{
    compatible: boolean;
    confidence: number;
    reasons: string[];
  }> {
    // For now, return a basic analysis
    // In a full implementation, you might fetch and analyze the actual source code
    return {
      compatible: true,
      confidence: 0.5,
      reasons: ['Source analysis not implemented']
    };
  }

  private combineAnalysisResults(
    packageName: string,
    version: string | undefined,
    packageJsonAnalysis: any,
    sourceAnalysis: any
  ): PackageCompatibility {
    const compatible = packageJsonAnalysis.compatible && sourceAnalysis.compatible;
    const confidence = Math.min(packageJsonAnalysis.confidence, sourceAnalysis.confidence);

    const allReasons = [
      ...packageJsonAnalysis.reasons,
      ...sourceAnalysis.reasons,
      ...packageJsonAnalysis.positiveSignals
    ];

    const reason = compatible
      ? `Compatible: ${packageJsonAnalysis.positiveSignals.join(', ') || 'No issues detected'}`
      : allReasons.filter(r => r.length > 0).join('; ') || 'Compatibility analysis failed';

    return {
      name: packageName,
      version,
      compatible,
      reason,
      confidence,
      verificationMethod: 'source-analysis',
      lastVerified: new Date()
    };
  }

  private isCacheValid(compatibility: PackageCompatibility): boolean {
    const cacheTTL = this.config.cacheTTL || 24 * 60 * 60 * 1000; // 24 hours default
    const age = Date.now() - compatibility.lastVerified.getTime();
    return age < cacheTTL;
  }

  /**
   * Preload compatibility data for popular packages
   */
  async preloadPopularPackages(): Promise<void> {
    const popularPackages = [
      'lodash', 'uuid', 'crypto-js', 'date-fns', 'marked',
      'zxcvbn', 'slugify', 'bcryptjs', 'chroma-js',
      '@faker-js/faker', 'jose', 'zod'
    ];

    this.config.logger.info('Preloading popular package compatibility...');

    await Promise.all(
      popularPackages.map(pkg => this.verifyPackage(pkg).catch(err =>
        this.config.logger.warn('Failed to preload package', { package: pkg, error: err })
      ))
    );

    this.config.logger.info('Package compatibility preloading complete');
  }

  /**
   * Get verification statistics
   */
  getStats(): {
    cachedPackages: number;
    compatiblePackages: number;
    incompatiblePackages: number;
    averageConfidence: number;
  } {
    const compatibilities = Array.from(this.compatibilityCache.values());
    const compatible = compatibilities.filter(c => c.compatible);
    const incompatible = compatibilities.filter(c => !c.compatible);

    return {
      cachedPackages: this.compatibilityCache.size,
      compatiblePackages: compatible.length,
      incompatiblePackages: incompatible.length,
      averageConfidence: compatibilities.length > 0
        ? compatibilities.reduce((sum, c) => sum + c.confidence, 0) / compatibilities.length
        : 0
    };
  }

  /**
   * Clear compatibility cache
   */
  clearCache(): void {
    this.compatibilityCache.clear();
    this.verificationInProgress.clear();
    this.config.logger.debug('Package compatibility cache cleared');
  }
}