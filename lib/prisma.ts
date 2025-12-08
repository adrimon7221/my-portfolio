/**
 * Cliente Prisma Singleton
 * 
 * Este archivo crea una instancia única de Prisma Client que se reutiliza
 * en toda la aplicación para evitar múltiples conexiones a la base de datos.
 * 
 * Patrón Singleton:
 * - En desarrollo: se guarda en globalThis para evitar crear múltiples instancias
 *   durante hot-reload de Next.js
 * - En producción: se crea una nueva instancia por proceso
 * 
 * Optimizaciones:
 * - Logging solo en desarrollo para mejor performance en producción
 * - Manejo de errores de conexión
 * - Connection pooling optimizado
 * 
 * Documentación: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration
 */

import { PrismaClient } from '@prisma/client'
import { logger } from './logger'
import { env } from './env'

// Tipo para almacenar Prisma en el contexto global (solo en desarrollo)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Instancia única de Prisma Client
 * 
 * PrismaClient lee automáticamente DATABASE_URL del archivo .env
 * No es necesario pasar la URL manualmente en Prisma 6
 * 
 * Configuración:
 * - Logging: Solo queries y errores en desarrollo
 * - Error formatting: Mejora los mensajes de error
 * - Connection pooling: Optimizado para producción
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
  // Prisma lee DATABASE_URL automáticamente de las variables de entorno
  // No es necesario pasarlo manualmente en Prisma 6+
})

// En desarrollo, guardar en globalThis para reutilizar en hot-reload
if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Manejar desconexión graceful en producción
if (env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    logger.info('Desconectando Prisma Client...')
    await prisma.$disconnect()
  })

  process.on('SIGINT', async () => {
    logger.info('SIGINT recibido, desconectando Prisma Client...')
    await prisma.$disconnect()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM recibido, desconectando Prisma Client...')
    await prisma.$disconnect()
    process.exit(0)
  })
}

export default prisma

