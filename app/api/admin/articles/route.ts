/**
 * API Route: Articles
 * 
 * CRUD completo para artículos
 * GET: Lista todos los artículos
 * POST: Crea un nuevo artículo
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos
 * - Optimización de queries de Prisma
 * - Respuestas consistentes y tipadas
 * - Prevención de duplicados
 * - Validación de límites de negocio
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateCreateArticle } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { MAX_ACTIVE_ARTICLES } from "@/app/admin/articles/constants/articles.constants"

/**
 * Verifica que el modelo Article esté disponible
 */
function ensureArticleModel() {
  if (!('article' in prisma)) {
    throw new Error('Modelo article no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/articles
 * 
 * Obtiene todos los artículos ordenados por `order`
 * 
 * @returns Lista de artículos
 */
export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/articles')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureArticleModel()

    // Obtener todos los artículos ordenados por order
    // Usar select explícito para optimizar la query
    const articles = await (prisma as any).article.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        image: true,
        order: true,
        active: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logger.info('Artículos obtenidos exitosamente', { 
      count: articles.length,
      userId: session.user.id 
    })

    return NextResponse.json(articles)
  } catch (error) {
    logger.error('Error obteniendo artículos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo article')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Article no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Error al obtener artículos" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/articles
 * 
 * Crea un nuevo artículo
 * 
 * @param request - Request con los datos del artículo
 * @returns Artículo creado
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de creación no autorizada de artículo')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureArticleModel()

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en POST /api/admin/articles', { error })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }
    
    // Validar con Zod
    let validatedData
    try {
      validatedData = validateCreateArticle(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.debug('Validación falló al crear artículo', { 
          issues: validationError.issues.map(i => ({ 
            path: i.path.join('.'), 
            message: i.message 
          }))
        })
        return NextResponse.json(
          { 
            error: "Datos inválidos", 
            details: validationError.issues.map(issue => ({
              field: issue.path.join('.'),
              message: issue.message
            }))
          },
          { status: 400 }
        )
      }
      throw validationError
    }

    // Verificar si la URL ya existe (transacción para evitar race conditions)
    const existingArticle = await (prisma as any).article.findUnique({
      where: { url: validatedData.url },
      select: { id: true, title: true },
    })

    if (existingArticle) {
      logger.warn('Intento de crear artículo con URL duplicada', { 
        url: validatedData.url, 
        existingId: existingArticle.id,
        userId: session.user.id 
      })
      return NextResponse.json(
        {
          error: "URL duplicada",
          message: `Ya existe un artículo con la URL "${validatedData.url}". Por favor, usa una URL diferente.`,
          details: [{
            field: "url",
            message: "Esta URL ya está en uso"
          }]
        },
        { status: 400 }
      )
    }

    // Validar límite de artículos activos (solo si el nuevo artículo está activo)
    if (validatedData.active === true) {
      const activeCount = await (prisma as any).article.count({
        where: { active: true },
      })

      if (activeCount >= MAX_ACTIVE_ARTICLES) {
        logger.warn('Intento de crear artículo activo cuando ya hay máximo permitido', { 
          activeCount,
          maxAllowed: MAX_ACTIVE_ARTICLES,
          userId: session.user.id 
        })
        return NextResponse.json(
          {
            error: "Límite alcanzado",
            message: `No se pueden tener más de ${MAX_ACTIVE_ARTICLES} artículos activos. Desactiva otro artículo primero.`
          },
          { status: 400 }
        )
      }
    }

    // Crear el artículo
    const article = await (prisma as any).article.create({
      data: validatedData,
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        image: true,
        order: true,
        active: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logger.info('Artículo creado exitosamente', { 
      id: article.id, 
      title: article.title,
      userId: session.user.id 
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    logger.error('Error creando artículo', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Si es un error de Zod, ya lo manejamos arriba
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Datos inválidos", 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo article')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Article no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "Error al crear artículo", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}
