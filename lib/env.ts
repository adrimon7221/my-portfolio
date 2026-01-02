/**
 * Validación de Variables de Entorno
 * 
 * Valida y tipa las variables de entorno usando Zod.
 * Falla al iniciar si faltan variables requeridas o tienen formato incorrecto.
 * 
 * Documentación: https://zod.dev/
 */

import { z } from 'zod'

/**
 * Schema de validación para variables de entorno
 */
const envSchema = z.object({
  // Base de datos
  DATABASE_URL: z.string().url('DATABASE_URL debe ser una URL válida'),
  
  // Autenticación
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET debe tener al menos 32 caracteres'),
  
  // Entorno
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * Tipo inferido de las variables de entorno validadas
 */
export type Env = z.infer<typeof envSchema>

/**
 * Valida y retorna las variables de entorno tipadas
 * 
 * @throws Error si alguna variable requerida falta o es inválida
 */
function validateEnv(): Env {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      throw new Error(
        `❌ Variables de entorno inválidas:\n${missingVars.join('\n')}\n\n` +
        `Por favor, verifica tu archivo .env`
      )
    }
    throw error
  }
}

/**
 * Variables de entorno validadas y tipadas
 * 
 * Se valida una sola vez al importar el módulo.
 */
export const env = validateEnv()

