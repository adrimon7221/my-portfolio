/**
 * Tipos TypeScript para About Me
 * 
 * Centraliza todos los tipos relacionados con About Me
 * para mantener consistencia y type-safety en toda la aplicación.
 */

/**
 * Datos del About Me desde la base de datos
 */
export interface AboutMe {
  id: string
  profileImage: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Datos del About Me para el formulario
 */
export interface AboutMeFormData {
  profileImage: string | null
}

/**
 * Input para actualizar About Me
 */
export interface UpdateAboutMeInput {
  profileImage?: string | null
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
 * Respuesta exitosa de subida de imagen
 */
export interface UploadImageResponse {
  success: boolean
  imageUrl: string
  fileName: string
}

