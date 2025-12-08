/**
 * Tipos TypeScript para Work Experience
 * 
 * Centraliza todos los tipos relacionados con Work Experience
 * para mantener consistencia y type-safety en toda la aplicación.
 */

/**
 * Experiencia laboral desde la base de datos
 */
export interface WorkExperience {
  id: string
  period: string
  duration: string
  company: string
  position: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Datos de experiencia laboral para el formulario
 */
export interface WorkExperienceFormData {
  period: string
  duration: string
  company: string
  position: string
  order: number
  active: boolean
}

/**
 * Input para crear una experiencia laboral
 */
export interface CreateWorkExperienceInput {
  period: string
  duration: string
  company: string
  position: string
  order: number
  active?: boolean
}

/**
 * Input para actualizar una experiencia laboral
 */
export interface UpdateWorkExperienceInput {
  period?: string
  duration?: string
  company?: string
  position?: string
  order?: number
  active?: boolean
}

/**
 * Errores de validación por campo
 */
export interface WorkExperienceFieldErrors {
  period?: string
  duration?: string
  company?: string
  position?: string
  order?: string
  active?: string
}

/**
 * Respuesta de error de la API
 */
export interface ApiErrorResponse {
  error: string
  message?: string
  details?: string[] | Record<string, string>
}

/**
 * Modo del modal (crear o editar)
 */
export type ModalMode = 'create' | 'edit'

