/**
 * Tipos TypeScript para Technologies
 * 
 * Centraliza todos los tipos relacionados con Technologies
 * para mantener consistencia y type-safety en toda la aplicación.
 */

/**
 * Categorías válidas de tecnologías
 */
export type TechnologyCategory = 'frontend' | 'styles' | 'backend' | 'devops'

/**
 * Tecnología desde la base de datos
 */
export interface Technology {
  id: string
  name: string
  category: TechnologyCategory
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Datos de tecnología para el formulario
 */
export interface TechnologyFormData {
  name: string
  category: TechnologyCategory
  order: number
  active: boolean
}

/**
 * Input para crear una tecnología
 */
export interface CreateTechnologyInput {
  name: string
  category: TechnologyCategory
  order: number
  active?: boolean
}

/**
 * Input para actualizar una tecnología
 */
export interface UpdateTechnologyInput {
  name?: string
  category?: TechnologyCategory
  order?: number
  active?: boolean
}

/**
 * Errores de validación por campo
 */
export interface TechnologyFieldErrors {
  name?: string
  category?: string
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

/**
 * Tecnologías agrupadas por categoría
 */
export interface TechnologiesByCategory {
  frontend: Technology[]
  styles: Technology[]
  backend: Technology[]
  devops: Technology[]
}

