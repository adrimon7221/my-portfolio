/**
 * Tipos e interfaces para Articles
 * 
 * Centraliza todas las definiciones de tipos relacionadas con artículos
 */

/**
 * Modelo de datos de un artículo
 */
export interface Article {
  id: string
  title: string
  description: string
  url: string
  image: string | null
  order: number
  active: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Datos del formulario para crear/editar un artículo
 */
export interface ArticleFormData {
  title: string
  description: string
  url: string
  image: string
  order: number
  active: boolean
  featured: boolean
}

/**
 * Datos para crear un nuevo artículo (sin id)
 */
export type CreateArticleInput = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Datos para actualizar un artículo (todos los campos opcionales excepto id)
 */
export type UpdateArticleInput = Partial<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Errores de validación por campo
 */
export type ArticleFieldErrors = Partial<Record<keyof ArticleFormData, string>>

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

