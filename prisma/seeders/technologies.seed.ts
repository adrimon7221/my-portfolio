/**
 * Seeder para Technologies
 * 
 * Popula la base de datos con tecnologías iniciales basadas en
 * los datos estáticos de app/_data/aboutTechnologies.ts
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '../../lib/logger'

/**
 * Datos iniciales de tecnologías
 * Basados en app/_data/aboutTechnologies.ts
 */
const INITIAL_TECHNOLOGIES = [
  // Frontend
  { name: 'TypeScript', category: 'frontend', order: 0 },
  { name: 'React', category: 'frontend', order: 1 },
  { name: 'Vue', category: 'frontend', order: 2 },
  { name: 'Vuex', category: 'frontend', order: 3 },
  { name: 'Redux Toolkit', category: 'frontend', order: 4 },
  { name: 'NextJs', category: 'frontend', order: 5 },
  { name: 'Nuxt', category: 'frontend', order: 6 },
  { name: 'Jest', category: 'frontend', order: 7 },
  { name: 'GraphQL', category: 'frontend', order: 8 },
  { name: 'React Native', category: 'frontend', order: 9 },
  { name: 'Puppeteer', category: 'frontend', order: 10 },
  { name: 'Enzyme', category: 'frontend', order: 11 },
  
  // Styles
  { name: 'SCSS', category: 'styles', order: 0 },
  { name: 'SASS', category: 'styles', order: 1 },
  { name: 'PostCSS', category: 'styles', order: 2 },
  { name: 'Ant.d', category: 'styles', order: 3 },
  { name: 'MUI', category: 'styles', order: 4 },
  { name: 'Material UI', category: 'styles', order: 5 },
  
  // Backend
  { name: 'Golang', category: 'backend', order: 0 },
  { name: 'Gin', category: 'backend', order: 1 },
  { name: 'GORM', category: 'backend', order: 2 },
  { name: 'PostgreSQL', category: 'backend', order: 3 },
  { name: 'MySQL', category: 'backend', order: 4 },
  { name: 'MongoDB', category: 'backend', order: 5 },
  { name: 'gRPC', category: 'backend', order: 6 },
  { name: 'Redis', category: 'backend', order: 7 },
  { name: 'Kafka', category: 'backend', order: 8 },
  { name: 'Node', category: 'backend', order: 9 },
  { name: 'Nest', category: 'backend', order: 10 },
  { name: 'TypeORM', category: 'backend', order: 11 },
  { name: 'Microservices', category: 'backend', order: 12 },
  
  // DevOps
  { name: 'Nginx', category: 'devops', order: 0 },
  { name: 'Brotli', category: 'devops', order: 1 },
  { name: 'Docker', category: 'devops', order: 2 },
  { name: '(CI/CD)', category: 'devops', order: 3 },
  { name: 'k8s', category: 'devops', order: 4 },
  { name: 'Bash', category: 'devops', order: 5 },
]

/**
 * Seeder principal
 */
export async function seedTechnologies(prisma: PrismaClient) {
  try {
    logger.info('Iniciando seeder de Technologies...')

    // Verificar que el modelo existe
    if (!('technology' in prisma)) {
      logger.warn('Modelo technology no disponible. Ejecuta: npx prisma generate')
      return
    }

    let created = 0
    let skipped = 0

    for (const techData of INITIAL_TECHNOLOGIES) {
      try {
        // Verificar si ya existe
        const existing = await (prisma as any).technology.findFirst({
          where: {
            name: techData.name,
            category: techData.category,
          },
        })

        if (existing) {
          logger.debug(`Tecnología ya existe: ${techData.name} (${techData.category})`)
          skipped++
          continue
        }

        // Crear la tecnología
        await (prisma as any).technology.create({
          data: {
            name: techData.name,
            category: techData.category,
            order: techData.order,
            active: true,
          },
        })

        created++
        logger.debug(`Tecnología creada: ${techData.name} (${techData.category})`)
      } catch (error) {
        logger.error(`Error creando tecnología ${techData.name}`, {
          error: error instanceof Error ? error.message : 'Error desconocido',
          data: techData,
        })
      }
    }

    logger.info('Seeder de Technologies completado', {
      created,
      skipped,
      total: INITIAL_TECHNOLOGIES.length,
    })
  } catch (error) {
    logger.error('Error en seeder de Technologies', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

