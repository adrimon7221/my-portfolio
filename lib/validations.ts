/**
 * Utilidades de Validación con Zod
 * 
 * Funciones reutilizables para validar datos en el backend usando Zod.
 * Centraliza la lógica de validación para mantener consistencia y type-safety.
 * 
 * Documentación: https://zod.dev/
 */

import { z } from 'zod'

/**
 * Schema de validación para email
 */
export const emailSchema = z
  .string()
  .min(1, 'El email no tiene un formato válido')
  .email('El email no tiene un formato válido')
  .max(255, 'El email es demasiado largo')
  .toLowerCase()
  .trim()

/**
 * Schema de validación para contraseña
 */
export const passwordSchema = z
  .string()
  .min(3, 'La contraseña no es válida')
  .max(100, 'La contraseña no puede exceder 100 caracteres')

/**
 * Schema de validación para credenciales de login
 */
export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * Schema de validación para nombre
 */
export const nameSchema = z
  .string()
  .min(1, 'El nombre es requerido')
  .max(255, 'El nombre es demasiado largo')
  .trim()

/**
 * Valida formato de email
 * 
 * @param email - Email a validar
 * @returns true si el email es válido, false si no
 * @deprecated Usa emailSchema.parse() en su lugar para mejor type-safety
 */
export function isValidEmail(email: string): boolean {
  try {
    emailSchema.parse(email)
    return true
  } catch {
    return false
  }
}

/**
 * Valida longitud de contraseña
 * 
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima (default: 3)
 * @param maxLength - Longitud máxima (default: 100)
 * @returns true si la contraseña es válida, false si no
 * @deprecated Usa passwordSchema.parse() en su lugar para mejor type-safety
 */
export function isValidPassword(
  password: string,
  minLength: number = 3,
  maxLength: number = 100
): boolean {
  try {
    passwordSchema.parse(password)
    return password.length >= minLength && password.length <= maxLength
  } catch {
    return false
  }
}

/**
 * Valida que un string no esté vacío
 * 
 * @param value - Valor a validar
 * @returns true si el valor no está vacío, false si no
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Sanitiza un string removiendo espacios y caracteres peligrosos
 * 
 * @param value - Valor a sanitizar
 * @returns String sanitizado
 */
export function sanitizeString(value: string): string {
  if (typeof value !== 'string') {
    return ''
  }
  
  return value.trim().replace(/[<>]/g, '')
}

/**
 * Valida y parsea credenciales de login
 * 
 * @param data - Datos a validar
 * @returns Datos validados y tipados
 * @throws ZodError si la validación falla
 */
export function validateLoginCredentials(data: unknown) {
  return loginCredentialsSchema.parse(data)
}

/**
 * Schema de validación para URL
 */
export const urlSchema = z
  .string()
  .min(1, 'La URL es requerida')
  .url('La URL no tiene un formato válido')
  .max(500, 'La URL es demasiado larga')
  .trim()

/**
 * Schema de validación para SocialLink
 */
export const socialLinkSchema = z.object({
  label: z.string().min(1, 'El label es requerido').max(100, 'El label es demasiado largo').trim(),
  url: urlSchema,
  icon: z.string().min(1, 'El icono es requerido').max(50, 'El icono es demasiado largo').trim(),
  order: z.number().int().min(0, 'El orden debe ser mayor o igual a 0').default(0),
  active: z.boolean().default(true),
})

/**
 * Schema de validación para crear SocialLink (sin id, createdAt, updatedAt)
 */
export const createSocialLinkSchema = socialLinkSchema

/**
 * Schema de validación para actualizar SocialLink (todos los campos opcionales excepto id)
 */
export const updateSocialLinkSchema = socialLinkSchema.partial()

/**
 * Valida y parsea datos de SocialLink para crear
 */
export function validateCreateSocialLink(data: unknown) {
  return createSocialLinkSchema.parse(data)
}

/**
 * Valida y parsea datos de SocialLink para actualizar
 */
export function validateUpdateSocialLink(data: unknown) {
  return updateSocialLinkSchema.parse(data)
}

/**
 * Schema de validación para Article
 */
export const articleSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'El título es demasiado largo').trim(),
  description: z.string().min(1, 'La descripción es requerida').max(500, 'La descripción es demasiado larga').trim(),
  url: urlSchema,
  image: z.string()
    .max(500, 'La URL de la imagen es demasiado larga')
    .trim()
    .refine((val) => {
      // Permitir string vacío
      if (!val || val === '') return true
      // Permitir URLs completas (http://, https://)
      if (z.string().url().safeParse(val).success) return true
      // Permitir rutas relativas que empiecen con /
      if (val.startsWith('/')) return true
      return false
    }, {
      message: 'La imagen debe ser una URL válida o una ruta relativa que empiece con /'
    })
    .optional()
    .default(''),
  order: z.number().int().min(0, 'El orden debe ser mayor o igual a 0').default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false), // Si aparece en el carrusel
})

/**
 * Schema de validación para crear Article (sin id, createdAt, updatedAt)
 */
export const createArticleSchema = articleSchema

/**
 * Schema de validación para actualizar Article (todos los campos opcionales excepto id)
 */
export const updateArticleSchema = articleSchema.partial()

/**
 * Valida y parsea datos de Article para crear
 */
export function validateCreateArticle(data: unknown) {
  return createArticleSchema.parse(data)
}

/**
 * Valida y parsea datos de Article para actualizar
 */
export function validateUpdateArticle(data: unknown) {
  return updateArticleSchema.parse(data)
}
