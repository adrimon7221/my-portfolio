/**
 * Utilidades para obtener Work Experience desde la base de datos
 * 
 * Server Component utility para obtener las experiencias laborales
 * desde Prisma y transformarlas al formato esperado por los componentes.
 * 
 * Mejoras implementadas:
 * - Logging estructurado con logger
 * - Manejo robusto de errores (nunca lanza errores, siempre retorna valores seguros)
 * - Validación de tipos
 * - Optimización de queries (solo campos necesarios)
 * - Ordenamiento por orden
 * - Cálculo automático del resumen (total años y meses)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Verifica que el modelo WorkExperience esté disponible
 * 
 * @returns true si el modelo está disponible, false si no
 */
function ensureWorkExperienceModel(): boolean {
  if (!('workExperience' in prisma)) {
    logger.warn('Modelo workExperience no disponible. Ejecuta: npx prisma generate y reinicia el servidor')
    return false
  }
  return true
}

/**
 * Experiencia laboral activa desde la base de datos
 */
export interface WorkExperienceData {
  id: number
  period: string
  duration: string
  company: string
  position: string
}

/**
 * Resumen de experiencia laboral
 */
export interface WorkExperienceSummary {
  totalYears: number
  totalMonths: number
}

/**
 * Parsea la duración de una experiencia laboral (ej: "1 year 5 months") a meses
 * 
 * @param duration - Duración en formato legible (ej: "1 year 5 months", "8 months")
 * @returns Número total de meses
 */
function parseDurationToMonths(duration: string): number {
  let totalMonths = 0
  
  // Buscar años
  const yearMatch = duration.match(/(\d+)\s*year/i)
  if (yearMatch) {
    totalMonths += parseInt(yearMatch[1]) * 12
  }
  
  // Buscar meses
  const monthMatch = duration.match(/(\d+)\s*month/i)
  if (monthMatch) {
    totalMonths += parseInt(monthMatch[1])
  }
  
  return totalMonths
}

/**
 * Calcula el resumen total de experiencia laboral
 * 
 * @param workExperiences - Array de experiencias laborales
 * @returns Resumen con total de años y meses
 */
function calculateSummary(workExperiences: WorkExperienceData[]): WorkExperienceSummary {
  const totalMonths = workExperiences.reduce((acc, we) => {
    return acc + parseDurationToMonths(we.duration)
  }, 0)
  
  const totalYears = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12
  
  return {
    totalYears,
    totalMonths: remainingMonths,
  }
}

/**
 * Obtiene todas las experiencias laborales activas desde la base de datos
 * 
 * Esta función nunca lanza errores. Siempre retorna un array válido,
 * incluso si hay errores de base de datos o el modelo no está disponible.
 * 
 * @returns Array de experiencias laborales activas ordenadas por orden
 */
export async function getWorkExperiencesFromDB(): Promise<WorkExperienceData[]> {
  try {
    // Verificar que el modelo existe
    if (!ensureWorkExperienceModel()) {
      logger.debug('Modelo workExperience no disponible, retornando array vacío')
      return []
    }

    logger.debug('Buscando experiencias laborales activas en la base de datos')

    // Query optimizada: solo campos necesarios y solo activas
    const workExperiences = await (prisma as any).workExperience.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        period: true,
        duration: true,
        company: true,
        position: true,
      },
    })

    // Transformar CUID a número para compatibilidad con el frontend
    const transformed = workExperiences.map((we: any, index: number) => ({
      id: index + 1, // Usar índice + 1 como ID numérico para compatibilidad
      period: we.period,
      duration: we.duration,
      company: we.company,
      position: we.position,
    }))

    logger.info('Experiencias laborales obtenidas exitosamente', { 
      count: transformed.length 
    })
    
    return transformed as WorkExperienceData[]
  } catch (error) {
    logger.error('Error obteniendo experiencias laborales de la base de datos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // En caso de error, retornar array vacío
    // Esto asegura que la aplicación nunca se rompa por errores de BD
    return []
  }
}

/**
 * Obtiene el resumen de experiencia laboral (total años y meses)
 * 
 * @returns Resumen con total de años y meses
 */
export async function getWorkExperienceSummary(): Promise<WorkExperienceSummary> {
  const workExperiences = await getWorkExperiencesFromDB()
  return calculateSummary(workExperiences)
}

