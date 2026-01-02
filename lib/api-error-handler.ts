/**
 * Manejo de Errores para API Routes
 * 
 * Middleware y utilidades para manejar errores de forma consistente
 * en las rutas de API de Next.js.
 * 
 * Uso:
 * ```ts
 * export async function GET(request: Request) {
 *   return withErrorHandling(async () => {
 *     // tu código aquí
 *   })
 * }
 * ```
 */

import { NextResponse } from 'next/server'
import { AppError, normalizeError, ErrorType } from './errors'
import { logger } from './logger'

/**
 * Wrapper para manejar errores en API routes
 * 
 * @param handler - Función async que puede lanzar errores
 * @returns NextResponse con la respuesta o error
 */
export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler()
    
    // Si ya es una NextResponse, retornarla directamente
    if (result instanceof NextResponse) {
      return result
    }
    
    // Si es otro tipo de dato, convertirlo a JSON
    return NextResponse.json(result)
  } catch (error) {
    const appError = normalizeError(error)
    
    // Loggear el error
    logger.error('Error en API route', appError, {
      type: appError.type,
      statusCode: appError.statusCode,
    })
    
    // Retornar respuesta de error apropiada
    return NextResponse.json(
      {
        error: appError.message,
        type: appError.type,
        ...(process.env.NODE_ENV === 'development' && appError.details
          ? { details: appError.details }
          : {}),
      },
      { status: appError.statusCode }
    )
  }
}

/**
 * Verifica que el usuario esté autenticado
 * 
 * @param session - Sesión del usuario (de auth())
 * @throws AppError si no está autenticado
 */
export function requireAuth(session: { user?: { id: string } } | null) {
  if (!session?.user?.id) {
    throw new AppError(
      ErrorType.AUTHENTICATION,
      'No autenticado',
      401
    )
  }
  return session
}

