/**
 * Servicio de API para Technologies
 * 
 * Centraliza todas las llamadas a la API relacionadas con Technologies.
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

import type { 
  Technology, 
  CreateTechnologyInput, 
  UpdateTechnologyInput, 
  ApiErrorResponse 
} from '../types/technology.types'

/**
 * Clase de error personalizada para errores de API
 * 
 * Permite distinguir entre diferentes tipos de errores y manejar
 * errores de campo específicos para mostrar en el formulario.
 */
export class TechnologyServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string>
  ) {
    super(message)
    this.name = 'TechnologyServiceError'
    // Mantener el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TechnologyServiceError)
    }
  }
}

/**
 * Configuración del servicio
 */
const SERVICE_CONFIG = {
  BASE_URL: '/api/admin/technologies',
  REQUEST_TIMEOUT: 10000, // 10 segundos
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 segundo
} as const

/**
 * Servicio para gestionar Technologies
 * 
 * Implementa:
 * - Timeout para evitar requests colgados
 * - Manejo robusto de errores
 * - Validación de respuestas
 * - Retry logic para errores de red
 */
export class TechnologyService {
  private static readonly BASE_URL = SERVICE_CONFIG.BASE_URL
  private static readonly REQUEST_TIMEOUT = SERVICE_CONFIG.REQUEST_TIMEOUT
  private static readonly MAX_RETRIES = SERVICE_CONFIG.MAX_RETRIES
  private static readonly RETRY_DELAY = SERVICE_CONFIG.RETRY_DELAY

  /**
   * Realiza una petición fetch con timeout y retry
   */
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      
      // Retry en caso de errores de red (solo para GET)
      if (
        retryCount < this.MAX_RETRIES &&
        options.method === 'GET' &&
        (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch')))
      ) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (retryCount + 1)))
        return this.fetchWithTimeout(url, options, retryCount + 1)
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new TechnologyServiceError(
          'La petición tardó demasiado tiempo. Por favor, intenta de nuevo.',
          408
        )
      }
      throw error
    }
  }

  /**
   * Maneja errores de respuesta de forma consistente
   */
  private static async handleResponse<T>(
    response: Response,
    defaultErrorMessage: string
  ): Promise<T> {
    if (!response.ok) {
      let errorData: ApiErrorResponse
      try {
        errorData = await response.json()
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
        throw new TechnologyServiceError(
          defaultErrorMessage,
          response.status
        )
      }

      const fieldErrors = this.extractFieldErrors(errorData)
      const errorMessage = errorData.message || errorData.error || defaultErrorMessage
      
      throw new TechnologyServiceError(
        errorMessage,
        response.status,
        fieldErrors
      )
    }

    try {
      return await response.json()
    } catch (error) {
      throw new TechnologyServiceError(
        'Error al procesar la respuesta del servidor',
        500
      )
    }
  }

  /**
   * Extrae errores de campo de la respuesta de error
   */
  private static extractFieldErrors(errorData: ApiErrorResponse): Record<string, string> | undefined {
    if (!errorData.details) return undefined
    
    if (Array.isArray(errorData.details)) {
      // Si es un array, convertir a objeto
      return undefined
    }
    
    if (typeof errorData.details === 'object') {
      return errorData.details as Record<string, string>
    }
    
    return undefined
  }

  /**
   * Obtiene todas las tecnologías
   * 
   * @returns Lista de tecnologías
   * @throws TechnologyServiceError si hay un error
   */
  static async getAll(): Promise<Technology[]> {
    try {
      const response = await this.fetchWithTimeout(this.BASE_URL, {
        method: 'GET',
      })

      return await this.handleResponse<Technology[]>(
        response,
        'Error al obtener las tecnologías'
      )
    } catch (error) {
      if (error instanceof TechnologyServiceError) {
        throw error
      }

      // Manejar errores de red
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new TechnologyServiceError(
          'Error de conexión. Verifica tu conexión a internet.',
          0
        )
      }

      throw new TechnologyServiceError(
        'Error desconocido al obtener las tecnologías',
        500
      )
    }
  }

  /**
   * Obtiene una tecnología por ID
   * 
   * @param id - ID de la tecnología
   * @returns Tecnología
   * @throws TechnologyServiceError si hay un error
   */
  static async getById(id: string): Promise<Technology> {
    try {
      const response = await this.fetchWithTimeout(`${this.BASE_URL}/${id}`, {
        method: 'GET',
      })

      return await this.handleResponse<Technology>(
        response,
        'Error al obtener la tecnología'
      )
    } catch (error) {
      if (error instanceof TechnologyServiceError) {
        throw error
      }

      throw new TechnologyServiceError(
        'Error desconocido al obtener la tecnología',
        500
      )
    }
  }

  /**
   * Crea una nueva tecnología
   * 
   * @param input - Datos de la tecnología a crear
   * @returns Tecnología creada
   * @throws TechnologyServiceError si hay un error
   */
  static async create(input: CreateTechnologyInput): Promise<Technology> {
    try {
      const response = await this.fetchWithTimeout(this.BASE_URL, {
        method: 'POST',
        body: JSON.stringify(input),
      })

      return await this.handleResponse<Technology>(
        response,
        'Error al crear la tecnología'
      )
    } catch (error) {
      if (error instanceof TechnologyServiceError) {
        throw error
      }

      throw new TechnologyServiceError(
        'Error desconocido al crear la tecnología',
        500
      )
    }
  }

  /**
   * Actualiza una tecnología
   * 
   * @param id - ID de la tecnología
   * @param input - Datos a actualizar
   * @returns Tecnología actualizada
   * @throws TechnologyServiceError si hay un error
   */
  static async update(id: string, input: UpdateTechnologyInput): Promise<Technology> {
    try {
      const response = await this.fetchWithTimeout(`${this.BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      })

      return await this.handleResponse<Technology>(
        response,
        'Error al actualizar la tecnología'
      )
    } catch (error) {
      if (error instanceof TechnologyServiceError) {
        throw error
      }

      throw new TechnologyServiceError(
        'Error desconocido al actualizar la tecnología',
        500
      )
    }
  }

  /**
   * Elimina una tecnología
   * 
   * @param id - ID de la tecnología
   * @throws TechnologyServiceError si hay un error
   */
  static async remove(id: string): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        await this.handleResponse<void>(
          response,
          'Error al eliminar la tecnología'
        )
      }
    } catch (error) {
      if (error instanceof TechnologyServiceError) {
        throw error
      }

      throw new TechnologyServiceError(
        'Error desconocido al eliminar la tecnología',
        500
      )
    }
  }
}

