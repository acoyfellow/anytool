/**
 * Examples for integrating AnyTool Core with inbox.dog
 */

import { AnyToolCore } from '../core/AnyToolCore';
import { Hono } from 'hono';

// Configuration for inbox.dog integration
export const inboxDogConfig = {
  projectContext: {
    name: 'inbox.dog',
    domain: 'email processing and management',
    constraints: [
      'GDPR compliant',
      'High performance',
      'Privacy-focused',
      'Email-centric operations'
    ],
    preferredPackages: [
      'date-fns', // Date manipulation for email timestamps
      'crypto-js', // Encryption for email content
      'zod', // Email validation schemas
      'lodash', // Data processing utilities
      'marked' // Email content parsing
    ],
    forbiddenPackages: [
      'fs', 'path', 'os', // No file system access
      'puppeteer', 'playwright' // No browser automation
    ],
    customInstructions: 'All tools should be optimized for email processing workflows and respect user privacy'
  }
};

// Email processing tool generator for inbox.dog
export function createInboxDogToolGenerator(env: {
  OPENAI_API_KEY: string;
  TOOL_CACHE?: R2Bucket;
  BUN_COMPILER_DO?: DurableObjectNamespace;
}) {
  return new AnyToolCore({
    openaiApiKey: env.OPENAI_API_KEY,
    cache: env.TOOL_CACHE,
    compiler: env.BUN_COMPILER_DO,
    projectContext: inboxDogConfig.projectContext,
    devMode: false,
    logLevel: 'info',
    enableMetrics: true,

    // Callbacks for inbox.dog analytics
    onGenerationComplete: (result) => {
      // Track tool generation in inbox.dog analytics
      console.log('Tool generated for inbox.dog:', {
        hash: result.toolHash.substring(0, 8),
        packages: result.packages,
        outputType: result.outputType,
        executionTime: result.executionTime
      });
    },

    onError: (error) => {
      // Log errors for inbox.dog monitoring
      console.error('Tool generation failed in inbox.dog:', {
        type: error.type,
        retryable: error.retryable,
        suggestion: error.suggestion
      });
    }
  });
}

// Email-specific tool generation examples
export class InboxDogToolExamples {
  constructor(private tools: AnyToolCore) {}

  // Generate email header parser
  async createEmailHeaderParser() {
    return await this.tools.generateAndExecute({
      prompt: "Parse email headers and extract sender, recipient, subject, date, and message-id",
      input: `From: sender@example.com
To: recipient@inbox.dog
Subject: Test Email
Date: Wed, 21 Oct 2024 07:28:00 +0000
Message-ID: <123456@example.com>

Hello world!`,
      userContext: "inbox.dog email processing pipeline",
      outputHints: {
        preferredType: 'json',
        contentType: 'application/json'
      }
    });
  }

  // Generate email validation tool
  async createEmailValidator() {
    return await this.tools.generateAndExecute({
      prompt: "Validate email addresses and check for common formatting issues using zod",
      input: "user@inbox.dog",
      userContext: "inbox.dog email validation for user registration",
      outputHints: {
        preferredType: 'json'
      }
    });
  }

  // Generate email anonymization tool
  async createEmailAnonymizer() {
    return await this.tools.generateAndExecute({
      prompt: "Anonymize email content by replacing personal information with placeholders while preserving structure",
      input: "Hi John Smith, your order #12345 has been shipped to 123 Main St, New York, NY.",
      userContext: "inbox.dog privacy protection for email content analysis",
      outputHints: {
        preferredType: 'text'
      }
    });
  }

  // Generate email subject analyzer
  async createSubjectAnalyzer() {
    return await this.tools.generateAndExecute({
      prompt: "Analyze email subjects and categorize them as promotional, personal, newsletter, or spam",
      input: "🎉 50% Off Everything - Limited Time Only!",
      userContext: "inbox.dog smart email categorization",
      outputHints: {
        preferredType: 'json'
      }
    });
  }

  // Generate email thread aggregator
  async createThreadAggregator() {
    return await this.tools.generateAndExecute({
      prompt: "Group emails into conversation threads based on subject, references, and in-reply-to headers",
      input: JSON.stringify([
        { subject: "Project Update", messageId: "1@example.com", references: null },
        { subject: "Re: Project Update", messageId: "2@example.com", references: "1@example.com" },
        { subject: "Re: Project Update", messageId: "3@example.com", references: "1@example.com 2@example.com" }
      ]),
      userContext: "inbox.dog conversation threading for better email organization"
    });
  }

  // Generate email security scanner
  async createSecurityScanner() {
    return await this.tools.generateAndExecute({
      prompt: "Scan email content for potential security threats like phishing links, suspicious attachments, and social engineering attempts",
      input: "Click here to verify your account: http://suspicious-site.com/verify?token=123",
      userContext: "inbox.dog security features for user protection",
      outputHints: {
        preferredType: 'json'
      }
    });
  }

  // Generate email statistics tool
  async createEmailStats() {
    return await this.tools.generateAndExecute({
      prompt: "Calculate email statistics including sender frequency, domain analysis, and time patterns using date-fns",
      input: JSON.stringify([
        { from: "newsletter@company.com", date: "2024-10-01T10:00:00Z" },
        { from: "support@service.com", date: "2024-10-01T14:30:00Z" },
        { from: "newsletter@company.com", date: "2024-10-02T10:00:00Z" }
      ]),
      userContext: "inbox.dog analytics dashboard for user insights"
    });
  }
}

// Integration with Hono app for inbox.dog
export function createInboxDogAPI(tools: AnyToolCore) {
  const app = new Hono();

  // Email processing tool generation endpoint
  app.post('/api/tools/email/generate', async (c) => {
    try {
      const { task, emailData } = await c.req.json();

      const result = await tools.generateAndExecute({
        prompt: `Email processing task: ${task}`,
        input: typeof emailData === 'string' ? emailData : JSON.stringify(emailData),
        userContext: "inbox.dog email processing API"
      });

      return c.json({
        success: true,
        tool: {
          hash: result.toolHash,
          output: result.output,
          contentType: result.contentType,
          packages: result.packages,
          cached: result.cached
        },
        executionTime: result.executionTime
      });

    } catch (error) {
      return c.json({
        success: false,
        error: error.message,
        type: error.type || 'unknown',
        suggestion: error.suggestion
      }, 500);
    }
  });

  // Pre-built email tools
  app.post('/api/tools/email/:toolType', async (c) => {
    const toolType = c.req.param('toolType');
    const emailData = await c.req.text();

    const examples = new InboxDogToolExamples(tools);

    try {
      let result;
      switch (toolType) {
        case 'parse-headers':
          result = await examples.createEmailHeaderParser();
          break;
        case 'validate':
          result = await examples.createEmailValidator();
          break;
        case 'anonymize':
          result = await examples.createEmailAnonymizer();
          break;
        case 'analyze-subject':
          result = await examples.createSubjectAnalyzer();
          break;
        case 'thread':
          result = await examples.createThreadAggregator();
          break;
        case 'security-scan':
          result = await examples.createSecurityScanner();
          break;
        case 'stats':
          result = await examples.createEmailStats();
          break;
        default:
          return c.json({ error: 'Unknown tool type' }, 400);
      }

      return c.json({
        success: true,
        result: result.output,
        contentType: result.contentType,
        cached: result.cached
      });

    } catch (error) {
      return c.json({
        success: false,
        error: error.message
      }, 500);
    }
  });

  // Tool metrics for monitoring
  app.get('/api/tools/metrics', async (c) => {
    const metrics = await tools.getMetrics();
    return c.json(metrics);
  });

  // Clear cache for development
  app.delete('/api/tools/cache', async (c) => {
    await tools.clearCache();
    return c.json({ message: 'Cache cleared' });
  });

  return app;
}

// Usage example for inbox.dog startup
export async function setupInboxDogTools(env: any) {
  // Create the tool generator
  const tools = createInboxDogToolGenerator(env);

  // Warmup for production
  await tools.warmup();

  // Create the API
  const api = createInboxDogAPI(tools);

  console.log('inbox.dog AnyTool integration ready');

  return { tools, api };
}