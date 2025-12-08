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
