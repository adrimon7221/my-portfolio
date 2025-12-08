/**
 * Manejo de Errores Centralizado
 * 
 * Utilidades para manejar errores de forma consistente en toda la aplicación.
 * Proporciona tipos y funciones para crear y manejar errores de manera uniforme.
 */

/**
 * Tipos de errores de la aplicación
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE = 'DATABASE',
  INTERNAL = 'INTERNAL',
}

/**
 * Error personalizado de la aplicación
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    
    // Mantener el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

/**
 * Crea un error de validación
 */
export function createValidationError(message: string, details?: unknown): AppError {
  return new AppError(ErrorType.VALIDATION, message, 400, details)
}

/**
 * Crea un error de autenticación
 */
export function createAuthenticationError(message: string = 'Credenciales inválidas'): AppError {
  return new AppError(ErrorType.AUTHENTICATION, message, 401)
}

/**
 * Crea un error de autorización
 */
export function createAuthorizationError(message: string = 'No tienes permisos para esta acción'): AppError {
  return new AppError(ErrorType.AUTHORIZATION, message, 403)
}

/**
 * Crea un error de recurso no encontrado
 */
export function createNotFoundError(resource: string = 'Recurso'): AppError {
  return new AppError(ErrorType.NOT_FOUND, `${resource} no encontrado`, 404)
}

/**
 * Crea un error de base de datos
 */
export function createDatabaseError(message: string = 'Error en la base de datos', details?: unknown): AppError {
  return new AppError(ErrorType.DATABASE, message, 500, details)
}

/**
 * Crea un error interno del servidor
 */
export function createInternalError(message: string = 'Error interno del servidor', details?: unknown): AppError {
  return new AppError(ErrorType.INTERNAL, message, 500, details)
}

/**
 * Convierte un error desconocido a AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  
  if (error instanceof Error) {
    return createInternalError(error.message, error.stack)
  }
  
  return createInternalError('Error desconocido', error)
}

