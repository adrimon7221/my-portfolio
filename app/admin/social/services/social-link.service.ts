/**
 * Servicio de API para Social Links
 * 
 * Centraliza todas las llamadas a la API relacionadas con enlaces sociales.
 * Separación de responsabilidades: el componente no debe conocer los detalles de la API.
 */

import type { SocialLink, CreateSocialLinkInput, UpdateSocialLinkInput, ApiErrorResponse } from '../types/social-link.types'

/**
 * Clase de error personalizada para errores de API
 */
export class SocialLinkServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string>
  ) {
    super(message)
    this.name = 'SocialLinkServiceError'
  }
}

/**
 * Servicio para gestionar enlaces sociales
 * 
 * Implementa:
 * - Timeout para evitar requests colgados
 * - Manejo robusto de errores
 * - Validación de respuestas
 */
export class SocialLinkService {
  private static readonly BASE_URL = '/api/admin/social-links'
  private static readonly REQUEST_TIMEOUT = 10000 // 10 segundos

  /**
   * Realiza una petición fetch con timeout
   */
  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new SocialLinkServiceError(
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
        throw new SocialLinkServiceError(
          defaultErrorMessage,
          response.status
        )
      }

      const fieldErrors = this.extractFieldErrors(errorData)
      throw new SocialLinkServiceError(
        errorData.error || defaultErrorMessage,
        response.status,
        fieldErrors
      )
    }

    try {
      return await response.json()
    } catch (error) {
      throw new SocialLinkServiceError(
        'Error al procesar la respuesta del servidor',
        500
      )
    }
  }

  /**
   * Obtiene todos los enlaces sociales
   */
  static async getAll(): Promise<SocialLink[]> {
    const response = await this.fetchWithTimeout(this.BASE_URL)
    return this.handleResponse<SocialLink[]>(
      response,
      'Error al cargar enlaces sociales'
    )
  }

  /**
   * Obtiene un enlace social por ID
   */
  static async getById(id: string): Promise<SocialLink> {
    if (!id || typeof id !== 'string') {
      throw new SocialLinkServiceError('ID inválido', 400)
    }

    const response = await this.fetchWithTimeout(`${this.BASE_URL}/${id}`)
    return this.handleResponse<SocialLink>(
      response,
      'Error al obtener enlace social'
    )
  }

  /**
   * Crea un nuevo enlace social
   */
  static async create(data: CreateSocialLinkInput): Promise<SocialLink> {
    if (!data || typeof data !== 'object') {
      throw new SocialLinkServiceError('Datos inválidos', 400)
    }

    const response = await this.fetchWithTimeout(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    return this.handleResponse<SocialLink>(
      response,
      'Error al crear enlace social'
    )
  }

  /**
   * Actualiza un enlace social existente
   */
  static async update(id: string, data: UpdateSocialLinkInput): Promise<SocialLink> {
    if (!id || typeof id !== 'string') {
      throw new SocialLinkServiceError('ID inválido', 400)
    }

    if (!data || typeof data !== 'object') {
      throw new SocialLinkServiceError('Datos inválidos', 400)
    }

    const response = await this.fetchWithTimeout(`${this.BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    return this.handleResponse<SocialLink>(
      response,
      'Error al actualizar enlace social'
    )
  }

  /**
   * Elimina un enlace social
   */
  static async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new SocialLinkServiceError('ID inválido', 400)
    }

    const response = await this.fetchWithTimeout(`${this.BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      await this.handleResponse<void>(response, 'Error al eliminar enlace social')
    }
  }

  /**
   * Extrae errores de campo de la respuesta de error de la API
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

