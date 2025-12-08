/**
 * Seeder de Autenticación
 * 
 * Crea el usuario administrador inicial en la base de datos.
 * 
 * Credenciales por defecto:
 * - Email: admin@portfolio.com
 * - Password: admin123
 * 
 * IMPORTANTE: Cambia estas credenciales después del primer despliegue.
 * 
 * Seguridad:
 * - Usa bcrypt con 10 rounds para encriptar contraseñas
 * - Valida que el usuario no exista antes de crear
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { logger } from '@/lib/logger'
import { emailSchema } from '@/lib/validations'

// Constantes de configuración
const ADMIN_EMAIL = 'admin@portfolio.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_NAME = 'Administrador'
const BCRYPT_ROUNDS = 10

export async function seedAuth(prisma: PrismaClient): Promise<void> {
  logger.info('🔐 Seeding autenticación...')

  try {
    // Validar email antes de usarlo
    const validatedEmail = emailSchema.parse(ADMIN_EMAIL)

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedEmail },
      select: { id: true, email: true, name: true }
    })

    if (existingUser) {
      logger.warn('El usuario administrador ya existe. Saltando creación...', {
        email: existingUser.email,
        userId: existingUser.id,
      })
      return
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS)

    // Crear el usuario administrador
    const admin = await prisma.user.create({
      data: {
        email: validatedEmail,
        password: hashedPassword,
        name: ADMIN_NAME,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    logger.info('Usuario administrador creado', {
      email: admin.email,
      name: admin.name,
      userId: admin.id,
      createdAt: admin.createdAt.toISOString(),
    })
    logger.warn('IMPORTANTE: Cambia la contraseña después del primer login.')
  } catch (error) {
    logger.error('Error creando usuario administrador', error)
    throw error
  }
}

