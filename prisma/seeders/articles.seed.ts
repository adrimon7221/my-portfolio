/**
 * Seeder de Artículos
 * 
 * Crea artículos de ejemplo en la base de datos.
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '@/lib/logger'

// Datos de ejemplo para artículos
const ARTICLES_DATA = [
  {
    title: "The simplest example is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://medium.com/@yourusername/article-1",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 1,
    active: true,
    featured: true,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://dev.to/yourusername/article-2",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 2,
    active: true,
    featured: true,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://hashnode.dev/@yourusername/article-3",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 3,
    active: true,
    featured: false,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://medium.com/@yourusername/article-4",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 4,
    active: true,
    featured: false,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://dev.to/yourusername/article-5",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 5,
    active: true,
    featured: false,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://hashnode.dev/@yourusername/article-6",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 6,
    active: true,
    featured: false,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://medium.com/@yourusername/article-7",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 7,
    active: true,
    featured: false,
  },
  {
    title: "The simplest is Kafka + golang",
    description: "This article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://dev.to/yourusername/article-8",
    image: null, // Sin imagen - usará el fondo predeterminado del portfolio
    order: 8,
    active: true,
    featured: false,
  },
]

export async function seedArticles(prisma: PrismaClient): Promise<void> {
  logger.info('📝 Seeding artículos...')

  try {
    let created = 0
    let skipped = 0

    for (const articleData of ARTICLES_DATA) {
      // Verificar si el artículo ya existe por URL
      const existing = await (prisma as any).article.findFirst({
        where: { url: articleData.url },
        select: { id: true, title: true },
      })

      if (existing) {
        logger.debug(`Artículo "${articleData.title}" ya existe. Saltando...`)
        skipped++
        continue
      }

      // Crear el artículo
      await (prisma as any).article.create({
        data: articleData,
      })

      created++
      logger.debug(`Artículo "${articleData.title}" creado`)
    }

    logger.info('Artículos procesados', {
      created,
      skipped,
      total: ARTICLES_DATA.length,
    })
  } catch (error) {
    logger.error('Error creando artículos', error)
    throw error
  }
}

