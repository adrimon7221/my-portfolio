/**
 * Utilidades para obtener Technologies desde la base de datos
 * 
 * Server Component utility para obtener las tecnologías
 * desde Prisma y transformarlas al formato esperado por los componentes.
 * 
 * Mejoras implementadas:
 * - Logging estructurado con logger
 * - Manejo robusto de errores (nunca lanza errores, siempre retorna valores seguros)
 * - Validación de tipos
 * - Agrupación por categoría
 * - Optimización de queries (solo campos necesarios)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Verifica que el modelo Technology esté disponible
 * 
 * @returns true si el modelo está disponible, false si no
 */
function ensureTechnologyModel(): boolean {
  if (!('technology' in prisma)) {
    logger.warn('Modelo technology no disponible. Ejecuta: npx prisma generate y reinicia el servidor')
    return false
  }
  return true
}

/**
 * Tecnología activa desde la base de datos
 */
export interface TechnologyData {
  name: string
  category: 'frontend' | 'styles' | 'backend' | 'devops'
}

/**
 * Tecnologías agrupadas por categoría
 */
export interface TechnologiesByCategory {
  frontend: string[]
  styles: string[]
  backend: string[]
  devops: string[]
}

/**
 * Obtiene todas las tecnologías activas desde la base de datos
 * 
 * Esta función nunca lanza errores. Siempre retorna un array válido,
 * incluso si hay errores de base de datos o el modelo no está disponible.
 * 
 * @returns Array de tecnologías activas
 */
export async function getTechnologiesFromDB(): Promise<TechnologyData[]> {
  try {
    // Verificar que el modelo existe
    if (!ensureTechnologyModel()) {
      logger.debug('Modelo technology no disponible, retornando array vacío')
      return []
    }

    logger.debug('Buscando tecnologías activas en la base de datos')

    // Query optimizada: solo campos necesarios y solo activas
    const technologies = await (prisma as any).technology.findMany({
      where: {
        active: true,
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
      select: {
        name: true,
        category: true,
      },
    })

    logger.info('Tecnologías obtenidas exitosamente', { 
      count: technologies.length 
    })
    
    return technologies as TechnologyData[]
  } catch (error) {
    logger.error('Error obteniendo tecnologías de la base de datos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // En caso de error, retornar array vacío
    // Esto asegura que la aplicación nunca se rompa por errores de BD
    return []
  }
}

/**
 * Obtiene las tecnologías agrupadas por categoría
 * 
 * @returns Tecnologías agrupadas por categoría (solo nombres como strings)
 */
export async function getTechnologiesByCategoryFromDB(): Promise<TechnologiesByCategory> {
  const technologies = await getTechnologiesFromDB()
  
  return {
    frontend: technologies
      .filter(t => t.category === 'frontend')
      .map(t => t.name),
    styles: technologies
      .filter(t => t.category === 'styles')
      .map(t => t.name),
    backend: technologies
      .filter(t => t.category === 'backend')
      .map(t => t.name),
    devops: technologies
      .filter(t => t.category === 'devops')
      .map(t => t.name),
  }
}

