/**
 * Seeder para Work Experience
 * 
 * Popula la base de datos con experiencias laborales iniciales basadas en
 * los datos estáticos de app/_data/workExperience.ts
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '../../lib/logger'

/**
 * Datos iniciales de experiencias laborales
 * Basados en app/_data/workExperience.ts
 */
const INITIAL_WORK_EXPERIENCES = [
  {
    period: '2022 -',
    duration: '1 year 5 months',
    company: 'ITHUB',
    position: 'Frontend developer | React & Vue',
    order: 0,
    active: true,
  },
  {
    period: '2021 - 2022',
    duration: '8 months',
    company: 'VK Development Lab',
    position: 'Frontend developer | React',
    order: 1,
    active: true,
  },
  {
    period: '2020 - 2021',
    duration: '9 months',
    company: 'SN Inc.',
    position: 'Fullstack developer | JavaScript & Python',
    order: 2,
    active: true,
  },
  {
    period: '2018 - 2020',
    duration: '1 year 11 months',
    company: 'Business Up',
    position: 'Fullstack developer | JavaScript & Python',
    order: 3,
    active: true,
  },
]

/**
 * Seeder principal
 */
export async function seedWorkExperience(prisma: PrismaClient) {
  try {
    logger.info('Iniciando seeder de Work Experience...')

    // Verificar que el modelo existe
    if (!('workExperience' in prisma)) {
      logger.warn('Modelo workExperience no disponible. Ejecuta: npx prisma generate')
      return
    }

    let created = 0
    let skipped = 0

    for (const workData of INITIAL_WORK_EXPERIENCES) {
      try {
        // Verificar si ya existe
        const existing = await (prisma as any).workExperience.findFirst({
          where: {
            company: workData.company,
            period: workData.period,
          },
        })

        if (existing) {
          logger.debug(`Experiencia laboral ya existe: ${workData.company} (${workData.period})`)
          skipped++
          continue
        }

        // Crear la experiencia laboral
        await (prisma as any).workExperience.create({
          data: workData,
        })

        created++
        logger.debug(`Experiencia laboral creada: ${workData.company} (${workData.period})`)
      } catch (error) {
        logger.error(`Error creando experiencia laboral ${workData.company}`, {
          error: error instanceof Error ? error.message : 'Error desconocido',
          data: workData,
        })
      }
    }

    logger.info('Seeder de Work Experience completado', {
      created,
      skipped,
      total: INITIAL_WORK_EXPERIENCES.length,
    })
  } catch (error) {
    logger.error('Error en seeder de Work Experience', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

