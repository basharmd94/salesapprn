/**
 * Logger utility for consistent logging across the application
 * Automatically handles environment-specific logging behavior
 */

// Determine if we're in development mode
const isDev = __DEV__;

// Optional: Add any error reporting service integration here
const reportToErrorService = (error, context = {}) => {
  // Integration with error reporting services like Sentry would go here
  // This is just a placeholder for future implementation
};

/**
 * Application logger that handles environment-specific logging
 */
const logger = {
  /**
   * Log informational messages (only in development)
   * @param {*} args - Arguments to log
   */
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log debug information (only in development)
   * @param {*} args - Arguments to log
   */
  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log warnings (only in development)
   * @param {*} args - Arguments to log
   */
  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (in all environments, but with different behavior)
   * @param {Error|string} error - The error object or message
   * @param {Object} context - Additional context information
   */
  error: (error, context = {}) => {
    if (isDev) {
      // In development, log the full error to the console
      console.error(error, context);
    } else {
      // In production, send to error reporting service
      // but don't log sensitive details to the console
      reportToErrorService(error, context);
    }
  },

  /**
   * Log critical errors that should always be visible
   * Use sparingly for truly critical errors that should be
   * logged regardless of environment
   * @param {*} args - Arguments to log
   */
  critical: (...args) => {
    console.error('[CRITICAL]', ...args);
    // Always report critical errors
    reportToErrorService(args[0], { critical: true });
  }
};

export default logger;