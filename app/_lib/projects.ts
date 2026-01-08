/**
 * Utilidades para obtener Projects desde la base de datos
 * 
 * Server Component utility para obtener los proyectos
 * desde Prisma y transformarlos al formato esperado por los componentes.
 * 
 * Mejoras implementadas:
 * - Logging estructurado con logger
 * - Manejo robusto de errores (nunca lanza errores, siempre retorna valores seguros)
 * - Validación de tipos
 * - Optimización de queries (solo campos necesarios)
 * - Ordenamiento por orden
 * - Transformación de JSON a arrays
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { Project } from '@/app/_types'

/**
 * Verifica que el modelo Project esté disponible
 * 
 * @returns true si el modelo está disponible, false si no
 */
function ensureProjectModel(): boolean {
  if (!('project' in prisma)) {
    logger.warn('Modelo project no disponible. Ejecuta: npx prisma generate y reinicia el servidor')
    return false
  }
  return true
}

/**
 * Proyecto activo desde la base de datos
 * Compatible con el tipo Project de app/_types
 */
export type ProjectData = Project

/**
 * Obtiene todos los proyectos activos desde la base de datos
 * 
 * Esta función nunca lanza errores. Siempre retorna un array válido,
 * incluso si hay errores de base de datos o el modelo no está disponible.
 * 
 * @returns Array de proyectos activos ordenados por orden
 */
export async function getProjectsFromDB(): Promise<ProjectData[]> {
  try {
    // Verificar que el modelo existe
    if (!ensureProjectModel()) {
      logger.debug('Modelo project no disponible, retornando array vacío')
      return []
    }

    logger.debug('Buscando proyectos activos en la base de datos')

    // Query optimizada: solo campos necesarios y solo activos
    const projects = await (prisma as any).project.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        images: true,
        tags: true,
        demoUrl: true,
        githubUrl: true,
        collageType: true,
      },
    })

    // Transformar CUID a número y JSON a arrays para compatibilidad con el frontend
    const transformed = projects.map((project: any, index: number) => {
      // Parsear JSON si es necesario
      let images: string[] | undefined = undefined
      if (project.images) {
        if (Array.isArray(project.images)) {
          images = project.images
        } else {
          try {
            const parsed = JSON.parse(project.images)
            images = Array.isArray(parsed) ? parsed : undefined
          } catch (error) {
            logger.warn('Error parseando images JSON', { 
              projectId: project.id,
              error: error instanceof Error ? error.message : 'Error desconocido',
              rawImages: project.images
            })
          }
        }
      }

      let tags: string[] = []
      if (project.tags) {
        if (Array.isArray(project.tags)) {
          tags = project.tags
        } else {
          try {
            tags = JSON.parse(project.tags)
          } catch {
            logger.warn('Error parseando tags JSON', { projectId: project.id })
          }
        }
      }

      return {
        id: index + 1, // Usar índice + 1 como ID numérico para compatibilidad
        title: project.title,
        description: project.description,
        image: '', // Campo image ya no se usa, pero se mantiene para compatibilidad
        images: images && images.length > 0 ? images as readonly string[] : undefined,
        tags: tags as readonly string[],
        demoUrl: project.demoUrl || undefined,
        githubUrl: project.githubUrl || undefined,
        collageType: (project.collageType || 'first') as 'first' | 'second' | 'third',
      }
    })

    logger.info('Proyectos obtenidos exitosamente', { 
      count: transformed.length 
    })
    
    return transformed as Project[]
  } catch (error) {
    logger.error('Error obteniendo proyectos de la base de datos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // En caso de error, retornar array vacío
    // Esto asegura que la aplicación nunca se rompa por errores de BD
    return []
  }
}

