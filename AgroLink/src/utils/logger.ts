
/**
 * Centralized AppLogger utility for Khedut Setu.
 * Categorizes logs into info, warn, and error.
 */
class AppLogger {
  private static isProduction = false; // Can be set based on env

  static info(message: string, data?: any) {
    if (this.isProduction) return;
    console.info(`[INFO][${new Date().toISOString()}] ${message}`, data || '');
  }

  static warn(message: string, data?: any) {
    if (this.isProduction) return;
    console.warn(`[WARN][${new Date().toISOString()}] ${message}`, data || '');
  }

  static error(message: string, error?: any) {
    // In production, you might send this to Sentry/LogRocket
    console.error(`[ERROR][${new Date().toISOString()}] ${message}`, error || '');
  }
}

export default AppLogger;
