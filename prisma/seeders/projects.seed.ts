/**
 * Seeder para Projects
 * 
 * Popula la base de datos con proyectos iniciales basados en
 * los datos estáticos de app/_data/projects.ts
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '../../lib/logger'

/**
 * Datos iniciales de proyectos
 * Basados en app/_data/projects.ts
 */
const INITIAL_PROJECTS = [
  {
    title: 'Gostat',
    description: '**GOStat**: a cutting-edge **microservice-based application** designed to handle **HTTP request authentication and statistics** with finesse.\n\nThis project comprises several **key microservices**, each contributing to its overall functionality and prowess. The architecture leverages **modern design patterns** and ensures **high availability and scalability** across distributed systems.',
    image: '/images/img2.jpg',
    images: [], // Imágenes eliminadas - usar imágenes reales desde el admin
    tags: ['Golang', 'TypeScript', 'Gin', 'NextJs', 'PostgreSQL', 'Redis'],
    demoUrl: null,
    githubUrl: null,
    order: 0,
    active: true,
    collageType: 'first',
  },
  {
    title: 'CloudSync',
    description: '**CloudSync** is a powerful **cloud synchronization platform** that enables **seamless data transfer** across multiple devices and cloud providers. Built with **modern architecture principles**, it ensures **data integrity, security, and real-time synchronization** capabilities for enterprise-level applications.',
    image: '/images/img2.jpg',
    images: [], // Imágenes eliminadas - usar imágenes reales desde el admin
    tags: ['Golang', 'TypeScript', 'Gin', 'NextJs', 'PostgreSQL', 'Redis'],
    demoUrl: null,
    githubUrl: null,
    order: 1,
    active: true,
    collageType: 'second',
  },
  {
    title: 'DataFlow',
    description: '**DataFlow** provides **advanced data processing and analytics solutions**. It streamlines **complex data pipelines**, enabling organizations to transform **raw data into actionable insights** efficiently.',
    image: '/images/img2.jpg',
    images: [], // Imágenes eliminadas - usar imágenes reales desde el admin
    tags: ['Golang', 'TypeScript', 'Gin', 'NextJs', 'PostgreSQL', 'Redis'],
    demoUrl: null,
    githubUrl: null,
    order: 2,
    active: true,
    collageType: 'third',
  },
]

/**
 * Seeder principal
 */
export async function seedProjects(prisma: PrismaClient) {
  try {
    logger.info('Iniciando seeder de Projects...')

    // Verificar que el modelo existe
    if (!('project' in prisma)) {
      logger.warn('Modelo project no disponible. Ejecuta: npx prisma generate')
      return
    }

    let created = 0
    let skipped = 0

    for (const projectData of INITIAL_PROJECTS) {
      try {
        // Verificar si ya existe
        const existing = await (prisma as any).project.findFirst({
          where: {
            title: projectData.title,
          },
        })

        if (existing) {
          // Actualizar proyecto existente - eliminar TODAS las imágenes
          await (prisma as any).project.update({
            where: { id: existing.id },
            data: {
              images: null, // Sin imágenes
              collageType: projectData.collageType || existing.collageType || 'first',
            },
          })
          
          logger.debug(`Proyecto actualizado: ${projectData.title} - imágenes eliminadas`)
          skipped++
          continue
        }

        // Crear el proyecto
        await (prisma as any).project.create({
          data: {
            ...projectData,
            images: projectData.images.length > 0 ? projectData.images : null,
            demoUrl: projectData.demoUrl || null,
            githubUrl: projectData.githubUrl || null,
            collageType: projectData.collageType || 'first',
          },
        })

        created++
        logger.debug(`Proyecto creado: ${projectData.title}`)
      } catch (error) {
        logger.error(`Error creando proyecto ${projectData.title}`, {
          error: error instanceof Error ? error.message : 'Error desconocido',
          data: projectData,
        })
      }
    }

    logger.info('Seeder de Projects completado', {
      created,
      skipped,
      total: INITIAL_PROJECTS.length,
    })
  } catch (error) {
    logger.error('Error en seeder de Projects', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw error
  }
}

