/**
 * API Route: Article por ID
 * 
 * GET: Obtiene un artículo por ID
 * PUT: Actualiza un artículo
 * DELETE: Elimina un artículo
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos
 * - Optimización de queries de Prisma
 * - Validación de existencia antes de operaciones
 * - Prevención de duplicados en actualizaciones
 * - Validación de límites de negocio
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateUpdateArticle } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { MAX_ACTIVE_ARTICLES } from "@/app/admin/articles/constants/articles.constants"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Verifica que el modelo Article esté disponible
 */
function ensureArticleModel() {
  if (!('article' in prisma)) {
    throw new Error('Modelo article no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/articles/[id]
 * 
 * Obtiene un artículo por ID
 * 
 * @param request - Request object
 * @param params - Parámetros de ruta con el ID
 * @returns Artículo encontrado
 */
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/articles/[id]')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Validar ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    // Verificar que el modelo existe
    ensureArticleModel()

    // Obtener el artículo con select explícito para optimizar
    const article = await (prisma as any).article.findUnique({
      where: { id: id.trim() },
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

    if (!article) {
      logger.warn('Artículo no encontrado', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      )
    }

    logger.debug('Artículo obtenido exitosamente', { id, userId: session.user.id })
    return NextResponse.json(article)
  } catch (error) {
    logger.error('Error obteniendo artículo', {
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
      { error: "Error al obtener artículo" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/articles/[id]
 * 
 * Actualiza un artículo existente
 * 
 * @param request - Request con los datos a actualizar
 * @param params - Parámetros de ruta con el ID
 * @returns Artículo actualizado
 */
export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de actualización no autorizada de artículo')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Validar ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    // Verificar que el modelo existe
    ensureArticleModel()

    // Verificar que el artículo existe
    const existing = await (prisma as any).article.findUnique({
      where: { id: id.trim() },
      select: {
        id: true,
        title: true,
        url: true,
        active: true,
      },
    })

    if (!existing) {
      logger.warn('Intento de actualizar artículo inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      )
    }

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en PUT /api/admin/articles/[id]', { error, id })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }
    
    // Validar con Zod
    let validatedData
    try {
      validatedData = validateUpdateArticle(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.debug('Validación falló al actualizar artículo', { 
          id,
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

    // Verificar si la URL está siendo cambiada y si ya existe
    if (validatedData.url && validatedData.url !== existing.url) {
      const urlExists = await (prisma as any).article.findUnique({
        where: { url: validatedData.url },
        select: { id: true },
      })

      if (urlExists && urlExists.id !== id) {
        logger.warn('Intento de actualizar artículo con URL duplicada', { 
          url: validatedData.url, 
          articleId: id,
          userId: session.user.id 
        })
        return NextResponse.json(
          {
            error: "URL duplicada",
            message: `Ya existe otro artículo con la URL "${validatedData.url}". Por favor, usa una URL diferente.`,
            details: [{
              field: "url",
              message: "Esta URL ya está en uso"
            }]
          },
          { status: 400 }
        )
      }
    }

    // Validar límite de artículos activos (solo si se está intentando activar)
    if (validatedData.active === true && existing.active === false) {
      const activeCount = await (prisma as any).article.count({
        where: { active: true },
      })

      if (activeCount >= MAX_ACTIVE_ARTICLES) {
        logger.warn('Intento de activar artículo cuando ya hay máximo permitido', { 
          activeCount,
          maxAllowed: MAX_ACTIVE_ARTICLES,
          articleId: id,
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

    // Actualizar el artículo
    const article = await (prisma as any).article.update({
      where: { id: id.trim() },
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

    logger.info('Artículo actualizado exitosamente', { 
      id: article.id, 
      title: article.title,
      userId: session.user.id 
    })

    return NextResponse.json(article)
  } catch (error) {
    logger.error('Error actualizando artículo', {
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
        error: "Error al actualizar artículo", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * 
 * Elimina un artículo
 * 
 * @param request - Request object
 * @param params - Parámetros de ruta con el ID
 * @returns Mensaje de confirmación
 */
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de eliminación no autorizada de artículo')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Validar ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    // Verificar que el modelo existe
    ensureArticleModel()

    // Verificar que el artículo existe antes de eliminar
    const existing = await (prisma as any).article.findUnique({
      where: { id: id.trim() },
      select: {
        id: true,
        title: true,
      },
    })

    if (!existing) {
      logger.warn('Intento de eliminar artículo inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Artículo no encontrado" },
        { status: 404 }
      )
    }

    // Eliminar el artículo (sin soft delete)
    await (prisma as any).article.delete({
      where: { id: id.trim() },
    })

    logger.info('Artículo eliminado exitosamente', { 
      id, 
      title: existing.title,
      userId: session.user.id 
    })

    return NextResponse.json({ 
      message: "Artículo eliminado correctamente",
      deletedId: id 
    })
  } catch (error) {
    logger.error('Error eliminando artículo', {
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
      { error: "Error al eliminar artículo" },
      { status: 500 }
    )
  }
}
