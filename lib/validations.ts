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

/**
 * Schema de validación para About Me
 * 
 * Modelo singleton: solo hay un registro de About Me
 */
export const aboutMeSchema = z.object({
  id: z.string().cuid().optional(),
  profileImage: z
    .string()
    .max(500, 'La URL de la imagen es demasiado larga')
    .trim()
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success || val.startsWith('/'),
      { message: 'La URL de la imagen no es válida' }
    )
    .nullable()
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

/**
 * Schema de validación para actualizar About Me
 * Todos los campos son opcionales
 */
export const updateAboutMeSchema = z.object({
  profileImage: z
    .string()
    .max(500, 'La URL de la imagen es demasiado larga')
    .trim()
    .refine(
      (val) => !val || val === '' || z.string().url().safeParse(val).success || val.startsWith('/'),
      { message: 'La URL de la imagen no es válida' }
    )
    .nullable()
    .optional(),
})

/**
 * Valida y parsea datos de About Me para actualizar
 */
export function validateUpdateAboutMe(data: unknown) {
  return updateAboutMeSchema.parse(data)
}

/**
 * Schema de validación para Technology
 */
export const technologySchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  category: z.enum(['frontend', 'styles', 'backend', 'devops'], {
    message: 'La categoría debe ser: frontend, styles, backend o devops',
  }),
  order: z
    .number()
    .int('El orden debe ser un número entero')
    .min(0, 'El orden no puede ser negativo')
    .max(1000, 'El orden no puede exceder 1000'),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

/**
 * Schema de validación para crear Technology
 */
export const createTechnologySchema = technologySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  active: z.boolean().optional().default(true),
})

/**
 * Schema de validación para actualizar Technology (todos los campos opcionales excepto id)
 */
export const updateTechnologySchema = technologySchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Valida y parsea datos de Technology para crear
 */
export function validateCreateTechnology(data: unknown) {
  return createTechnologySchema.parse(data)
}

/**
 * Valida y parsea datos de Technology para actualizar
 */
export function validateUpdateTechnology(data: unknown) {
  return updateTechnologySchema.parse(data)
}

/**
 * Schema de validación para Work Experience
 */
export const workExperienceSchema = z.object({
  id: z.string().cuid().optional(),
  period: z
    .string()
    .min(1, 'El período es requerido')
    .max(50, 'El período no puede exceder 50 caracteres')
    .trim(),
  duration: z
    .string()
    .min(1, 'La duración es requerida')
    .max(50, 'La duración no puede exceder 50 caracteres')
    .trim(),
  company: z
    .string()
    .min(1, 'La empresa es requerida')
    .max(100, 'La empresa no puede exceder 100 caracteres')
    .trim(),
  position: z
    .string()
    .min(1, 'La posición es requerida')
    .max(200, 'La posición no puede exceder 200 caracteres')
    .trim(),
  order: z
    .number()
    .int('El orden debe ser un número entero')
    .min(0, 'El orden no puede ser negativo')
    .max(1000, 'El orden no puede exceder 1000'),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

/**
 * Schema de validación para crear Work Experience
 */
export const createWorkExperienceSchema = workExperienceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  active: z.boolean().optional().default(true),
})

/**
 * Schema de validación para actualizar Work Experience (todos los campos opcionales excepto id)
 */
export const updateWorkExperienceSchema = workExperienceSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * Valida y parsea datos de Work Experience para crear
 */
export function validateCreateWorkExperience(data: unknown) {
  return createWorkExperienceSchema.parse(data)
}

/**
 * Valida y parsea datos de Work Experience para actualizar
 */
export function validateUpdateWorkExperience(data: unknown) {
  return updateWorkExperienceSchema.parse(data)
}

/**
 * Schema de validación para Project
 */
export const projectSchema = z.object({
  id: z.string().cuid().optional(),
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(5000, 'La descripción no puede exceder 5000 caracteres')
    .trim(),
  image: z
    .string()
    .max(500, 'La URL de la imagen no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .default(''),
  images: z
    .array(z.string().max(500).trim())
    .optional()
    .nullable()
    .default([]),
  tags: z
    .array(z.string().min(1).max(50).trim())
    .min(1, 'Debe tener al menos un tag')
    .max(20, 'No se pueden tener más de 20 tags'),
  demoUrl: z
    .string()
    .url('La URL del demo no es válida')
    .max(500, 'La URL del demo no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal('')),
  githubUrl: z
    .string()
    .url('La URL de GitHub no es válida')
    .max(500, 'La URL de GitHub no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal('')),
  order: z
    .number()
    .int('El orden debe ser un número entero')
    .min(0, 'El orden no puede ser negativo')
    .max(1000, 'El orden no puede exceder 1000'),
  collageType: z
    .enum(['first', 'second', 'third'], {
      message: 'El tipo de collage debe ser "first", "second" o "third"',
    })
    .default('first'),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

/**
 * Schema de validación para crear Project
 */
export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  image: z
    .string()
    .max(500, 'La URL de la imagen no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal(''))
    .default(''),
  images: z
    .array(z.string().max(500).trim())
    .optional()
    .default([]),
  demoUrl: z
    .string()
    .url('La URL del demo no es válida')
    .max(500, 'La URL del demo no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal(''))
    .default(''),
  githubUrl: z
    .string()
    .url('La URL de GitHub no es válida')
    .max(500, 'La URL de GitHub no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal(''))
    .default(''),
  active: z.boolean().optional().default(true),
})

/**
 * Schema de validación para actualizar Project (todos los campos opcionales excepto id)
 */
export const updateProjectSchema = projectSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  images: z
    .array(z.string().max(500).trim())
    .optional()
    .nullable(),
  demoUrl: z
    .string()
    .url('La URL del demo no es válida')
    .max(500, 'La URL del demo no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal('')),
  githubUrl: z
    .string()
    .url('La URL de GitHub no es válida')
    .max(500, 'La URL de GitHub no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
    .or(z.literal('')),
})

/**
 * Valida y parsea datos de Project para crear
 */
export function validateCreateProject(data: unknown) {
  return createProjectSchema.parse(data)
}

/**
 * Valida y parsea datos de Project para actualizar
 */
export function validateUpdateProject(data: unknown) {
  return updateProjectSchema.parse(data)
}
