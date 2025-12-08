/**
 * Seeder Principal de Prisma
 * 
 * Este archivo importa y ejecuta todos los seeders individuales.
 * 
 * Uso:
 *   npx prisma db seed
 * 
 * Estructura:
 * - prisma/seeders/ - Carpeta con todos los seeders individuales
 * - prisma/seed.ts - Este archivo, que ejecuta todos los seeders
 * 
 * Documentación: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
 */

// Cargar variables de entorno PRIMERO, antes de cualquier otra importación
import 'dotenv/config'

// Validar variables de entorno usando el sistema centralizado
// Esto fallará si faltan variables requeridas
import '@/lib/env'

import { PrismaClient } from '@prisma/client'
import { seedAuth } from './seeders/auth.seed'
import { seedSocialLinks } from './seeders/socialLinks.seed'
import { seedArticles } from './seeders/articles.seed'
import { seedTechnologies } from './seeders/technologies.seed'
import { logger } from '@/lib/logger'

/**
 * Instancia de PrismaClient para el seed
 * 
 * Se crea una instancia separada para el seed (no se usa lib/prisma.ts)
 * para evitar problemas con el singleton en contexto de scripts.
 * 
 * Configuración:
 * - Logging deshabilitado para mejor performance durante seeding
 * - Error formatting habilitado para debugging
 */
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
})

/**
 * Función principal que ejecuta todos los seeders
 */
async function main(): Promise<void> {
  const startTime = Date.now()
  
  logger.info('🌱 Iniciando seeders...')

  try {
    // Ejecutar seeders en orden (pasar prisma como parámetro)
    await seedAuth(prisma)
    await seedSocialLinks(prisma)
    await seedArticles(prisma)
    await seedTechnologies(prisma)
    
    // Aquí puedes agregar más seeders en el futuro:
    // await seedProjects(prisma)
    // etc.

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    logger.info(`✅ Todos los seeders completados exitosamente en ${duration}s`)
  } catch (error) {
    logger.error('Error ejecutando seeders', error)
    throw error
  }
}

// Ejecutar seeders con manejo de errores
main()
  .catch((e) => {
    logger.error('Error fatal en seeders', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

