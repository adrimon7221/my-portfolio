/**
 * Tipos TypeScript para Projects
 * 
 * Centraliza todos los tipos relacionados con Projects
 * para mantener consistencia y type-safety en toda la aplicación.
 */

/**
 * Proyecto desde la base de datos
 */
export interface Project {
  id: string
  title: string
  description: string
  image: string
  images: string[] | null
  tags: string[]
  demoUrl: string | null
  githubUrl: string | null
  order: number
  collageType: 'first' | 'second' | 'third'
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Datos de proyecto para el formulario
 */
export interface ProjectFormData {
  title: string
  description: string
  image: string
  images: string[]
  tags: string[]
  demoUrl: string
  githubUrl: string
  order: number
  collageType: 'first' | 'second' | 'third'
  active: boolean
}

/**
 * Input para crear un proyecto
 */
export interface CreateProjectInput {
  title: string
  description: string
  image?: string
  images?: string[]
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  order: number
  collageType?: 'first' | 'second' | 'third'
  active?: boolean
}

/**
 * Input para actualizar un proyecto
 */
export interface UpdateProjectInput {
  title?: string
  description?: string
  image?: string
  images?: string[]
  tags?: string[]
  demoUrl?: string
  githubUrl?: string
  order?: number
  collageType?: 'first' | 'second' | 'third'
  active?: boolean
}

/**
 * Errores de validación por campo
 */
export interface ProjectFieldErrors {
  title?: string
  description?: string
  image?: string
  images?: string
  tags?: string
  demoUrl?: string
  githubUrl?: string
  order?: string
  collageType?: string
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

