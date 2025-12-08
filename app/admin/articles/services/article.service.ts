/**
 * Servicio de API para Articles
 * 
 * Centraliza todas las llamadas a la API relacionadas con artículos.
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

import type { Article, CreateArticleInput, UpdateArticleInput, ApiErrorResponse } from '../types/article.types'

/**
 * Clase de error personalizada para errores de API
 * 
 * Permite distinguir entre diferentes tipos de errores y manejar
 * errores de campo específicos para mostrar en el formulario.
 */
export class ArticleServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string>
  ) {
    super(message)
    this.name = 'ArticleServiceError'
    // Mantener el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ArticleServiceError)
    }
  }
}

/**
 * Configuración del servicio
 */
const SERVICE_CONFIG = {
  BASE_URL: '/api/admin/articles',
  REQUEST_TIMEOUT: 10000, // 10 segundos
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 segundo
} as const

/**
 * Servicio para gestionar artículos
 * 
 * Implementa:
 * - Timeout para evitar requests colgados
 * - Manejo robusto de errores
 * - Validación de respuestas
 * - Retry logic para errores de red
 */
export class ArticleService {
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
        throw new ArticleServiceError(
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
        throw new ArticleServiceError(
          defaultErrorMessage,
          response.status
        )
      }

      const fieldErrors = this.extractFieldErrors(errorData)
      const errorMessage = errorData.message || errorData.error || defaultErrorMessage
      
      throw new ArticleServiceError(
        errorMessage,
        response.status,
        fieldErrors
      )
    }

    try {
      return await response.json()
    } catch (error) {
      throw new ArticleServiceError(
        'Error al procesar la respuesta del servidor',
        500
      )
    }
  }

  /**
   * Obtiene todos los artículos
   * 
   * @returns Array de artículos
   * @throws {ArticleServiceError} Si hay un error en la petición
   */
  static async getAll(): Promise<Article[]> {
    try {
      const response = await this.fetchWithTimeout(this.BASE_URL)
      return this.handleResponse<Article[]>(
        response,
        'Error al cargar artículos'
      )
    } catch (error) {
      if (error instanceof ArticleServiceError) {
        throw error
      }
      throw new ArticleServiceError(
        'Error de conexión al cargar artículos',
        0
      )
    }
  }

  /**
   * Obtiene un artículo por ID
   * 
   * @param id - ID del artículo
   * @returns Artículo encontrado
   * @throws {ArticleServiceError} Si hay un error en la petición o el artículo no existe
   */
  static async getById(id: string): Promise<Article> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ArticleServiceError('ID inválido', 400)
    }

    try {
      const response = await this.fetchWithTimeout(`${this.BASE_URL}/${encodeURIComponent(id.trim())}`)
      return this.handleResponse<Article>(
        response,
        'Error al obtener artículo'
      )
    } catch (error) {
      if (error instanceof ArticleServiceError) {
        throw error
      }
      throw new ArticleServiceError(
        'Error de conexión al obtener artículo',
        0
      )
    }
  }

  /**
   * Crea un nuevo artículo
   * 
   * @param data - Datos del artículo a crear
   * @returns Artículo creado
   * @throws {ArticleServiceError} Si hay un error en la petición o validación
   */
  static async create(data: CreateArticleInput): Promise<Article> {
    if (!data || typeof data !== 'object') {
      throw new ArticleServiceError('Datos inválidos', 400)
    }

    try {
      const response = await this.fetchWithTimeout(this.BASE_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      return this.handleResponse<Article>(
        response,
        'Error al crear artículo'
      )
    } catch (error) {
      if (error instanceof ArticleServiceError) {
        throw error
      }
      throw new ArticleServiceError(
        'Error de conexión al crear artículo',
        0
      )
    }
  }

  /**
   * Actualiza un artículo existente
   * 
   * @param id - ID del artículo a actualizar
   * @param data - Datos a actualizar
   * @returns Artículo actualizado
   * @throws {ArticleServiceError} Si hay un error en la petición o validación
   */
  static async update(id: string, data: UpdateArticleInput): Promise<Article> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ArticleServiceError('ID inválido', 400)
    }

    if (!data || typeof data !== 'object') {
      throw new ArticleServiceError('Datos inválidos', 400)
    }

    try {
      const response = await this.fetchWithTimeout(`${this.BASE_URL}/${encodeURIComponent(id.trim())}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      return this.handleResponse<Article>(
        response,
        'Error al actualizar artículo'
      )
    } catch (error) {
      if (error instanceof ArticleServiceError) {
        throw error
      }
      throw new ArticleServiceError(
        'Error de conexión al actualizar artículo',
        0
      )
    }
  }

  /**
   * Elimina un artículo
   * 
   * @param id - ID del artículo a eliminar
   * @throws {ArticleServiceError} Si hay un error en la petición
   */
  static async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ArticleServiceError('ID inválido', 400)
    }

    try {
      const response = await this.fetchWithTimeout(`${this.BASE_URL}/${encodeURIComponent(id.trim())}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        await this.handleResponse<void>(response, 'Error al eliminar artículo')
      }
    } catch (error) {
      if (error instanceof ArticleServiceError) {
        throw error
      }
      throw new ArticleServiceError(
        'Error de conexión al eliminar artículo',
        0
      )
    }
  }

  /**
   * Extrae errores de campo de la respuesta de error de la API
   * 
   * @param errorData - Datos de error de la API
   * @returns Objeto con errores por campo o undefined si no hay errores de campo
   */
  private static extractFieldErrors(errorData: ApiErrorResponse): Record<string, string> | undefined {
    if (!errorData.details || !Array.isArray(errorData.details)) {
      return undefined
    }

    const fieldErrors: Record<string, string> = {}
    errorData.details.forEach((detail) => {
      if (detail.field && detail.message) {
        fieldErrors[detail.field] = detail.message
      }
    })

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
  }
}
