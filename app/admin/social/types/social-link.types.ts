/**
 * Tipos e interfaces para Social Links
 * 
 * Centraliza todas las definiciones de tipos relacionadas con enlaces sociales
 */

/**
 * Modelo de datos de un enlace social
 */
export interface SocialLink {
  id: string
  label: string
  url: string
  icon: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Datos del formulario para crear/editar un enlace social
 */
export interface SocialLinkFormData {
  label: string
  url: string
  icon: string
  order: number
  active: boolean
}

/**
 * Datos para crear un nuevo enlace social (sin id)
 */
export type CreateSocialLinkInput = Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Datos para actualizar un enlace social (todos los campos opcionales excepto id)
 */
export type UpdateSocialLinkInput = Partial<Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Errores de validación por campo
 */
export type SocialLinkFieldErrors = Record<keyof SocialLinkFormData, string>

/**
 * Respuesta de error de la API
 */
export interface ApiErrorResponse {
  error: string
  details?: Array<{
    field: string
    message: string
  }>
}

/**
 * Estado del modal
 */
export type ModalMode = 'create' | 'edit' | null

