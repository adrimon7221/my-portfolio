/**
 * Logger Estructurado
 * 
 * Sistema de logging centralizado con diferentes niveles de log.
 * Mejora el debugging y monitoreo en producción.
 * 
 * Niveles:
 * - error: Errores críticos que requieren atención
 * - warn: Advertencias que no detienen la ejecución
 * - info: Información general del flujo de la aplicación
 * - debug: Información detallada para debugging (solo en desarrollo)
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogContext {
  [key: string]: unknown
}

/**
 * Formatea el mensaje de log con contexto
 */
function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` ${JSON.stringify(context)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
}

/**
 * Logger con métodos para cada nivel
 */
export const logger = {
  /**
   * Log de error - Errores críticos
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      ...(error instanceof Error
        ? {
            errorName: error.name,
            errorMessage: error.message,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          }
        : { error }),
    }
    console.error(formatLog('error', message, errorContext))
  },

  /**
   * Log de advertencia
   */
  warn(message: string, context?: LogContext): void {
    console.warn(formatLog('warn', message, context))
  },

  /**
   * Log de información
   */
  info(message: string, context?: LogContext): void {
    console.log(formatLog('info', message, context))
  },

  /**
   * Log de debug - Solo en desarrollo
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog('debug', message, context))
    }
  },
}

