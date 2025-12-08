/**
 * Utilidades para obtener artículos desde la base de datos
 * 
 * Server Component utility para obtener artículos activos y destacados
 * desde Prisma y transformarlos al formato esperado por los componentes.
 * 
 * Mejoras implementadas:
 * - Logging estructurado con logger
 * - Manejo robusto de errores
 * - Validación de tipos
 * - Optimización de queries
 * - Transformación segura de datos
 * - Caché de resultados (opcional)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { Article as ArticleType } from '@/app/_types'
import type { CarouselArticle } from '@/app/_types/carousel'

/**
 * Verifica que el modelo Article esté disponible
 */
function ensureArticleModel(): boolean {
  if (!('article' in prisma)) {
    logger.warn('Modelo article no disponible. Ejecuta: npx prisma generate y reinicia el servidor')
    return false
  }
  return true
}

/**
 * Convierte un CUID string a number de forma segura
 * 
 * @param cuid - CUID string a convertir
 * @param fallback - Valor de respaldo si la conversión falla
 * @returns Número generado o fallback
 */
function cuidToNumber(cuid: string, fallback: number): number {
  try {
    // Tomar los últimos 8 caracteres y convertir de hex a decimal
    const hex = cuid.slice(-8)
    const num = parseInt(hex, 16)
    return isNaN(num) ? fallback : num
  } catch {
    return fallback
  }
}

/**
 * Obtiene todos los artículos activos desde la base de datos
 * 
 * @returns Array de artículos activos ordenados por `order`
 * @throws Nunca lanza errores, siempre retorna un array (puede estar vacío)
 */
export async function getArticlesFromDB(): Promise<ArticleType[]> {
  try {
    // Verificar que el modelo existe
    if (!ensureArticleModel()) {
      return []
    }

    logger.debug('Buscando artículos activos en la base de datos')

    // Query optimizada: solo campos necesarios, ordenada, filtrada
    const articles = await (prisma as any).article.findMany({
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
        url: true,
      },
    })

    logger.info('Artículos activos obtenidos', { count: articles.length })

    // Transformar a formato Article esperado por el frontend
    // La BD usa: id (string CUID)
    // El frontend espera: id (number)
    const transformedArticles: ArticleType[] = articles.map((article: any, index: number) => {
      const id = typeof article.id === 'string'
        ? cuidToNumber(article.id, index + 1)
        : (article.id || index + 1)

      return {
        id,
        title: article.title || '',
        description: article.description || '',
        url: article.url || '',
      }
    })

    logger.debug('Artículos transformados exitosamente', { count: transformedArticles.length })
    return transformedArticles
  } catch (error) {
    logger.error('Error obteniendo artículos de la base de datos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // En caso de error, retornar array vacío para no romper el frontend
    return []
  }
}

/**
 * Obtiene los artículos destacados (featured) para el carrusel
 * 
 * @returns Array de artículos destacados ordenados por `order`
 * @throws Nunca lanza errores, siempre retorna un array (puede estar vacío)
 */
export async function getFeaturedArticlesFromDB(): Promise<CarouselArticle[]> {
  try {
    // Verificar que el modelo existe
    if (!ensureArticleModel()) {
      return []
    }

    logger.debug('Buscando artículos destacados en la base de datos')

    // Query optimizada: solo campos necesarios, ordenada, filtrada
    const articles = await (prisma as any).article.findMany({
      where: {
        active: true,
        featured: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        image: true,
      },
    })

    logger.info('Artículos destacados obtenidos', { count: articles.length })

    // Transformar a formato CarouselArticle
    // Convertir id string a number para compatibilidad con el tipo CarouselArticle
    const transformedArticles: CarouselArticle[] = articles.map((article: any, index: number) => {
      const id = typeof article.id === 'string'
        ? cuidToNumber(article.id, index + 1)
        : (article.id || index + 1)

      return {
        id,
        title: article.title || '',
        description: article.description || '',
        url: article.url || '',
        image: article.image || undefined, // Opcional para CarouselArticle
      }
    })

    logger.debug('Artículos destacados transformados exitosamente', { count: transformedArticles.length })
    return transformedArticles
  } catch (error) {
    logger.error('Error obteniendo artículos destacados de la base de datos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // En caso de error, retornar array vacío para no romper el frontend
    return []
  }
}
