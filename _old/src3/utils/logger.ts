/**
 * Structured logging utility for AnyTool Core
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogContext {
  [key: string]: any;
}

export class Logger {
  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };

  constructor(
    private config: {
      level: LogLevel;
      verbose: boolean;
      devMode: boolean;
    }
  ) {}

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (this.levels[level] > this.levels[this.config.level]) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = this.config.devMode ? `[AnyTool:${level.toUpperCase()}]` : '';

    if (this.config.verbose && context) {
      console.log(`${prefix} ${timestamp} ${message}`, context);
    } else {
      console.log(`${prefix} ${timestamp} ${message}`);
    }
  }
}