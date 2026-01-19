/**
 * Backend Application Logger
 * Centralized logging utility for Node.js backend
 */

const LogLevel = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
};

const LogCategory = {
    API: 'API',
    DATABASE: 'DATABASE',
    AUTH: 'AUTH',
    EXTERNAL_API: 'EXTERNAL_API',
    MIDDLEWARE: 'MIDDLEWARE',
    SYSTEM: 'SYSTEM',
    VALIDATION: 'VALIDATION'
};

class BackendLogger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.isProduction = process.env.NODE_ENV === 'production';
        this.logs = [];
        this.maxLogs = 1000;
    }

    /**
     * Format log entry
     */
    formatLog(entry) {
        const timestamp = new Date().toISOString();
        const { level, category, message, metadata } = entry;

        let formattedMessage = `[${timestamp}] [${level}] [${category}]`;

        if (metadata?.featureName) {
            formattedMessage += ` [${metadata.featureName}]`;
        }

        if (metadata?.endpoint) {
            formattedMessage += ` [${metadata.endpoint}]`;
        }

        formattedMessage += ` ${message}`;

        return formattedMessage;
    }

    /**
     * Get console color based on log level
     */
    getColor(level) {
        const colors = {
            [LogLevel.DEBUG]: '\x1b[90m',    // Gray
            [LogLevel.INFO]: '\x1b[36m',     // Cyan
            [LogLevel.WARN]: '\x1b[33m',     // Yellow
            [LogLevel.ERROR]: '\x1b[31m',    // Red
            [LogLevel.SUCCESS]: '\x1b[32m'   // Green
        };
        return colors[level] || '\x1b[0m';
    }

    /**
     * Store log entry
     */
    storeLog(entry) {
        this.logs.push(entry);

        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
    }

    /**
     * Core logging method
     */
    log(level, category, message, metadata = {}, error = null) {
        const entry = {
            level,
            category,
            message,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            },
            error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : null
        };

        this.storeLog(entry);

        const formattedMessage = this.formatLog(entry);
        const color = this.getColor(level);
        const reset = '\x1b[0m';

        switch (level) {
            case LogLevel.DEBUG:
                if (this.isDevelopment) {
                    console.debug(`${color}${formattedMessage}${reset}`, metadata);
                }
                break;
            case LogLevel.INFO:
            case LogLevel.SUCCESS:
                console.info(`${color}${formattedMessage}${reset}`, metadata);
                break;
            case LogLevel.WARN:
                console.warn(`${color}${formattedMessage}${reset}`, metadata);
                break;
            case LogLevel.ERROR:
                console.error(`${color}${formattedMessage}${reset}`, metadata);
                if (error?.stack) console.error(error.stack);
                break;
        }

        // In production, send to external service
        if (this.isProduction && level === LogLevel.ERROR) {
            this.sendToExternalService(entry);
        }
    }

    /**
     * Send to external logging service
     */
    async sendToExternalService(entry) {
        // TODO: Implement external service integration
        // Examples: Winston, Morgan, Sentry, etc.
    }

    /**
     * Debug logging
     */
    debug(category, message, metadata = {}) {
        this.log(LogLevel.DEBUG, category, message, metadata);
    }

    /**
     * Info logging
     */
    info(category, message, metadata = {}) {
        this.log(LogLevel.INFO, category, message, metadata);
    }

    /**
     * Success logging
     */
    success(category, message, metadata = {}) {
        this.log(LogLevel.SUCCESS, category, message, metadata);
    }

    /**
     * Warning logging
     */
    warn(category, message, metadata = {}) {
        this.log(LogLevel.WARN, category, message, metadata);
    }

    /**
     * Error logging
     */
    error(category, message, error = null, metadata = {}) {
        this.log(LogLevel.ERROR, category, message, metadata, error);
    }

    /**
     * API request logging
     */
    apiRequest(method, path, metadata = {}) {
        this.info(LogCategory.API, `${method} ${path}`, {
            ...metadata,
            featureName: 'API Request',
            method,
            endpoint: path
        });
    }

    /**
     * API response logging
     */
    apiResponse(method, path, statusCode, metadata = {}) {
        const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.SUCCESS;
        this.log(level, LogCategory.API, `${method} ${path} - ${statusCode}`, {
            ...metadata,
            featureName: 'API Response',
            method,
            endpoint: path,
            statusCode
        });
    }

    /**
     * External API request logging
     */
    externalApiRequest(service, method, url, metadata = {}) {
        this.info(LogCategory.EXTERNAL_API, `${service}: ${method} ${url}`, {
            ...metadata,
            featureName: service,
            method,
            url
        });
    }

    /**
     * External API response logging
     */
    externalApiResponse(service, method, url, status, metadata = {}) {
        const level = status >= 400 ? LogLevel.ERROR : LogLevel.SUCCESS;
        this.log(level, LogCategory.EXTERNAL_API, `${service}: ${method} ${url} - ${status}`, {
            ...metadata,
            featureName: service,
            method,
            url,
            status
        });
    }

    /**
     * External API error logging
     */
    externalApiError(service, method, url, error, metadata = {}) {
        this.error(LogCategory.EXTERNAL_API, `${service}: ${method} ${url} failed`, error, {
            ...metadata,
            featureName: service,
            method,
            url
        });
    }

    /**
     * Database operation logging
     */
    database(operation, collection, metadata = {}) {
        this.debug(LogCategory.DATABASE, `${operation} on ${collection}`, {
            ...metadata,
            featureName: 'Database',
            operation,
            collection
        });
    }

    /**
     * Authentication logging
     */
    auth(action, userId, metadata = {}) {
        this.info(LogCategory.AUTH, `${action} for user ${userId}`, {
            ...metadata,
            featureName: 'Authentication',
            action,
            userId
        });
    }

    /**
     * Middleware logging
     */
    middleware(name, action, metadata = {}) {
        this.debug(LogCategory.MIDDLEWARE, `${name}: ${action}`, {
            ...metadata,
            featureName: 'Middleware',
            middleware: name,
            action
        });
    }

    /**
     * Get all logs
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Export logs
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
}

// Create singleton instance
const logger = new BackendLogger();

// Export singleton and enums
export default logger;
export { LogLevel, LogCategory };
