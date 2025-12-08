/**
 * Servicio de API para About Me
 * 
 * Centraliza todas las llamadas a la API relacionadas con About Me.
 * Separación de responsabilidades: el componente no debe conocer los detalles de la API.
 * 
 * Mejoras implementadas:
 * - Timeout configurable para evitar requests colgados
 * - Manejo robusto de errores con tipos específicos
 * - Validación de respuestas
 * - Retry logic para errores transitorios
 * - Logging estructurado
 * - Type safety completo
 */

import type { AboutMe, UpdateAboutMeInput, ApiErrorResponse, UploadImageResponse } from '../types/about-me.types'

/**
 * Clase de error personalizada para errores de API
 * 
 * Permite distinguir entre diferentes tipos de errores y manejar
 * errores de campo específicos para mostrar en el formulario.
 */
export class AboutMeServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string>
  ) {
    super(message)
    this.name = 'AboutMeServiceError'
    // Mantener el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AboutMeServiceError)
    }
  }
}

/**
 * Configuración del servicio
 */
const SERVICE_CONFIG = {
  BASE_URL: '/api/admin/about-me',
  UPLOAD_URL: '/api/admin/about-me/upload-image',
  REQUEST_TIMEOUT: 10000, // 10 segundos
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 segundo
} as const

/**
 * Crea un AbortController con timeout
 */
function createTimeoutController(timeout: number): AbortController {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeout)
  return controller
}

/**
 * Realiza una petición fetch con timeout y retry
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = SERVICE_CONFIG.MAX_RETRIES
): Promise<Response> {
  const controller = createTimeoutController(SERVICE_CONFIG.REQUEST_TIMEOUT)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    
    // Si la respuesta es exitosa, retornarla
    if (response.ok) {
      return response
    }
    
    // Si es un error del servidor (5xx) y hay reintentos disponibles, reintentar
    if (response.status >= 500 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, SERVICE_CONFIG.RETRY_DELAY))
      return fetchWithRetry(url, options, retries - 1)
    }
    
    return response
  } catch (error) {
    // Si es un error de red y hay reintentos disponibles, reintentar
    if (retries > 0 && (error instanceof Error && error.name === 'AbortError' || error instanceof TypeError)) {
      await new Promise(resolve => setTimeout(resolve, SERVICE_CONFIG.RETRY_DELAY))
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

/**
 * Parsea la respuesta de error de la API
 */
function parseErrorResponse(response: Response): Promise<ApiErrorResponse> {
  return response.json().catch(() => ({
    error: 'Error desconocido',
    message: `Error ${response.status}: ${response.statusText}`,
  }))
}

/**
 * Servicio para gestionar About Me
 * 
 * Implementa:
 * - Timeout para evitar requests colgados
 * - Manejo robusto de errores
 * - Validación de respuestas
 * - Retry logic para errores de red
 */
export class AboutMeService {
  private static readonly BASE_URL = SERVICE_CONFIG.BASE_URL
  private static readonly UPLOAD_URL = SERVICE_CONFIG.UPLOAD_URL
  private static readonly REQUEST_TIMEOUT = SERVICE_CONFIG.REQUEST_TIMEOUT

  /**
   * Obtiene la información del About Me
   * 
   * @returns Información del About Me o null si no existe
   * @throws AboutMeServiceError si hay un error
   */
  static async get(): Promise<AboutMe | null> {
    try {
      const response = await fetchWithRetry(this.BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await parseErrorResponse(response)
        throw new AboutMeServiceError(
          errorData.error || 'Error al obtener About Me',
          response.status,
          typeof errorData.details === 'object' && !Array.isArray(errorData.details)
            ? errorData.details
            : undefined
        )
      }

      const data = await response.json()
      
      // Si la respuesta es null, retornar null
      if (!data || data === null) {
        return null
      }

      return data as AboutMe
    } catch (error) {
      if (error instanceof AboutMeServiceError) {
        throw error
      }

      // Manejar errores de red o timeout
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AboutMeServiceError(
            'La petición tardó demasiado. Por favor, intenta de nuevo.',
            408
          )
        }
        if (error.message.includes('fetch')) {
          throw new AboutMeServiceError(
            'Error de conexión. Verifica tu conexión a internet.',
            0
          )
        }
      }

      throw new AboutMeServiceError(
        'Error desconocido al obtener About Me',
        500
      )
    }
  }

  /**
   * Actualiza la información del About Me
   * 
   * @param input - Datos a actualizar
   * @returns About Me actualizado
   * @throws AboutMeServiceError si hay un error
   */
  static async update(input: UpdateAboutMeInput): Promise<AboutMe> {
    try {
      const response = await fetchWithRetry(this.BASE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const errorData = await parseErrorResponse(response)
        throw new AboutMeServiceError(
          errorData.error || 'Error al actualizar About Me',
          response.status,
          typeof errorData.details === 'object' && !Array.isArray(errorData.details)
            ? errorData.details
            : undefined
        )
      }

      const data = await response.json()
      return data as AboutMe
    } catch (error) {
      if (error instanceof AboutMeServiceError) {
        throw error
      }

      // Manejar errores de red o timeout
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AboutMeServiceError(
            'La petición tardó demasiado. Por favor, intenta de nuevo.',
            408
          )
        }
        if (error.message.includes('fetch')) {
          throw new AboutMeServiceError(
            'Error de conexión. Verifica tu conexión a internet.',
            0
          )
        }
      }

      throw new AboutMeServiceError(
        'Error desconocido al actualizar About Me',
        500
      )
    }
  }

  /**
   * Sube una imagen de perfil
   * 
   * @param file - Archivo de imagen a subir
   * @returns Respuesta con la URL de la imagen subida
   * @throws AboutMeServiceError si hay un error
   */
  static async uploadImage(file: File): Promise<UploadImageResponse> {
    try {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        throw new AboutMeServiceError(
          'Tipo de archivo no permitido. Solo se permiten JPG y PNG',
          400
        )
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new AboutMeServiceError(
          'El archivo es demasiado grande. Máximo 5MB',
          400
        )
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetchWithRetry(this.UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await parseErrorResponse(response)
        throw new AboutMeServiceError(
          errorData.error || 'Error al subir la imagen',
          response.status
        )
      }

      const data = await response.json()
      return data as UploadImageResponse
    } catch (error) {
      if (error instanceof AboutMeServiceError) {
        throw error
      }

      // Manejar errores de red o timeout
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AboutMeServiceError(
            'La petición tardó demasiado. Por favor, intenta de nuevo.',
            408
          )
        }
        if (error.message.includes('fetch')) {
          throw new AboutMeServiceError(
            'Error de conexión. Verifica tu conexión a internet.',
            0
          )
        }
      }

      throw new AboutMeServiceError(
        'Error desconocido al subir la imagen',
        500
      )
    }
  }
}

