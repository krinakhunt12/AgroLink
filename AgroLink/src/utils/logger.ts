/**
 * Application Logger
 * Centralized logging utility for the entire application
 * Replaces console.log with structured, trackable logs
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum LogCategory {
  API = 'API',
  UI = 'UI',
  AUTH = 'AUTH',
  NAVIGATION = 'NAVIGATION',
  DATA = 'DATA',
  PERFORMANCE = 'PERFORMANCE',
  USER_ACTION = 'USER_ACTION',
  SYSTEM = 'SYSTEM'
}

interface LogMetadata {
  featureName?: string;
  screenName?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: LogMetadata;
  error?: Error;
  stack?: string;
}

class AppLogger {
  private static isDevelopment: boolean = import.meta.env.DEV;
  private static isProduction: boolean = import.meta.env.PROD;
  private static logs: LogEntry[] = [];
  private static maxLogs: number = 1000;

  /**
   * Format log entry for console output
   */
  private static formatLog(entry: LogEntry): string {
    const timestamp = new Date().toISOString();
    const { level, category, message, metadata } = entry;

    let formattedMessage = `[${timestamp}] [${level}] [${category}]`;

    if (metadata?.screenName) {
      formattedMessage += ` [${metadata.screenName}]`;
    }

    if (metadata?.featureName) {
      formattedMessage += ` [${metadata.featureName}]`;
    }

    formattedMessage += ` ${message}`;

    return formattedMessage;
  }

  /**
   * Get console style based on log level
   */
  private static getConsoleStyle(level: LogLevel): string {
    const styles = {
      [LogLevel.DEBUG]: 'color: #6B7280; font-weight: normal',
      [LogLevel.INFO]: 'color: #3B82F6; font-weight: bold',
      [LogLevel.WARN]: 'color: #F59E0B; font-weight: bold',
      [LogLevel.ERROR]: 'color: #EF4444; font-weight: bold',
      [LogLevel.SUCCESS]: 'color: #10B981; font-weight: bold'
    };
    return styles[level];
  }

  /**
   * Store log entry
   */
  private static storeLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Send log to external service (implement as needed)
   */
  private static async sendToExternalService(entry: LogEntry): Promise<void> {
    // TODO: Implement external logging service integration
    // Examples: Sentry, LogRocket, DataDog, etc.
    if (this.isProduction && entry.level === LogLevel.ERROR) {
      // Send errors to monitoring service
      // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
    }
  }

  /**
   * Core logging method
   */
  private static log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: LogMetadata,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      category,
      message,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      error,
      stack: error?.stack
    };

    // Store log
    this.storeLog(entry);

    // Console output in development
    if (this.isDevelopment) {
      const formattedMessage = this.formatLog(entry);
      const style = this.getConsoleStyle(level);

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`%c${formattedMessage}`, style, metadata, error);
          break;
        case LogLevel.INFO:
        case LogLevel.SUCCESS:
          console.info(`%c${formattedMessage}`, style, metadata);
          break;
        case LogLevel.WARN:
          console.warn(`%c${formattedMessage}`, style, metadata);
          break;
        case LogLevel.ERROR:
          console.error(`%c${formattedMessage}`, style, metadata, error);
          if (error?.stack) console.error(error.stack);
          break;
      }
    }

    // Send to external service
    this.sendToExternalService(entry);
  }

  /**
   * Debug level logging
   */
  static debug(
    category: LogCategory,
    message: string,
    metadata?: LogMetadata
  ): void {
    this.log(LogLevel.DEBUG, category, message, metadata);
  }

  /**
   * Info level logging
   */
  static info(
    category: LogCategory,
    message: string,
    metadata?: LogMetadata
  ): void {
    this.log(LogLevel.INFO, category, message, metadata);
  }

  /**
   * Success level logging
   */
  static success(
    category: LogCategory,
    message: string,
    metadata?: LogMetadata
  ): void {
    this.log(LogLevel.SUCCESS, category, message, metadata);
  }

  /**
   * Warning level logging
   */
  static warn(
    category: LogCategory,
    message: string,
    metadata?: LogMetadata
  ): void {
    this.log(LogLevel.WARN, category, message, metadata);
  }

  /**
   * Error level logging
   */
  static error(
    category: LogCategory,
    message: string,
    error?: Error,
    metadata?: LogMetadata
  ): void {
    this.log(LogLevel.ERROR, category, message, metadata, error);
  }

  /**
   * API request logging
   */
  static apiRequest(
    method: string,
    url: string,
    metadata?: LogMetadata
  ): void {
    this.info(LogCategory.API, `${method} ${url}`, {
      ...metadata,
      featureName: metadata?.featureName || 'API',
      method,
      url
    });
  }

  /**
   * API response logging
   */
  static apiResponse(
    method: string,
    url: string,
    status: number,
    metadata?: LogMetadata
  ): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.SUCCESS;
    this.log(level, LogCategory.API, `${method} ${url} - ${status}`, {
      ...metadata,
      featureName: metadata?.featureName || 'API',
      method,
      url,
      status
    });
  }

  /**
   * API error logging
   */
  static apiError(
    method: string,
    url: string,
    error: Error,
    metadata?: LogMetadata
  ): void {
    this.error(LogCategory.API, `${method} ${url} failed`, error, {
      ...metadata,
      featureName: metadata?.featureName || 'API',
      method,
      url
    });
  }

  /**
   * User action logging
   */
  static userAction(
    action: string,
    screenName: string,
    metadata?: LogMetadata
  ): void {
    this.info(LogCategory.USER_ACTION, action, {
      ...metadata,
      screenName,
      featureName: metadata?.featureName || 'UserAction'
    });
  }

  /**
   * Navigation logging
   */
  static navigation(
    from: string,
    to: string,
    metadata?: LogMetadata
  ): void {
    this.info(LogCategory.NAVIGATION, `Navigated from ${from} to ${to}`, {
      ...metadata,
      featureName: 'Navigation',
      from,
      to
    });
  }

  /**
   * Performance logging
   */
  static performance(
    metric: string,
    value: number,
    unit: string = 'ms',
    metadata?: LogMetadata
  ): void {
    this.info(LogCategory.PERFORMANCE, `${metric}: ${value}${unit}`, {
      ...metadata,
      featureName: 'Performance',
      metric,
      value,
      unit
    });
  }

  /**
   * Component lifecycle logging
   */
  static componentLifecycle(
    componentName: string,
    lifecycle: 'mount' | 'unmount' | 'update',
    metadata?: LogMetadata
  ): void {
    this.debug(LogCategory.UI, `${componentName} ${lifecycle}`, {
      ...metadata,
      screenName: componentName,
      featureName: 'Component',
      lifecycle
    });
  }

  /**
   * Get all stored logs
   */
  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  static getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs by category
   */
  static getLogsByCategory(category: LogCategory): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  static downloadLogs(): void {
    const dataStr = this.exportLogs();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `app-logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export default AppLogger;

// Export enums for easy access
export { LogLevel as Level, LogCategory as Category };
