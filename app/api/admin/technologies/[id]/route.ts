/**
 * API Route: Technology by ID
 * 
 * CRUD para una tecnología específica
 * GET: Obtiene una tecnología por ID
 * PUT: Actualiza una tecnología
 * DELETE: Elimina una tecnología
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos
 * - Optimización de queries de Prisma
 * - Respuestas consistentes y tipadas
 * - Prevención de duplicados en actualización
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateUpdateTechnology } from "@/lib/validations"
import { logger } from "@/lib/logger"

/**
 * Verifica que el modelo Technology esté disponible
 */
function ensureTechnologyModel() {
  if (!('technology' in prisma)) {
    throw new Error('Modelo technology no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/technologies/[id]
 * 
 * Obtiene una tecnología por ID
 * 
 * @param request - Request
 * @param params - Parámetros de la ruta (id)
 * @returns Tecnología
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/technologies/[id]')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureTechnologyModel()

    const { id } = await params

    // Obtener la tecnología
    const technology = await (prisma as any).technology.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        category: true,
        order: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!technology) {
      logger.warn('Tecnología no encontrada', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Tecnología no encontrada" },
        { status: 404 }
      )
    }

    logger.debug('Tecnología obtenida', { id, userId: session.user.id })
    return NextResponse.json(technology)
  } catch (error) {
    logger.error('Error obteniendo tecnología', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo technology')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Technology no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Error al obtener la tecnología" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/technologies/[id]
 * 
 * Actualiza una tecnología
 * 
 * @param request - Request con los datos a actualizar
 * @param params - Parámetros de la ruta (id)
 * @returns Tecnología actualizada
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de actualización no autorizada de tecnología')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureTechnologyModel()

    const { id } = await params

    // Verificar que la tecnología existe
    const existing = await (prisma as any).technology.findUnique({
      where: { id },
    })

    if (!existing) {
      logger.warn('Intento de actualizar tecnología inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Tecnología no encontrada" },
        { status: 404 }
      )
    }

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en PUT /api/admin/technologies/[id]', { error, id })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateUpdateTechnology(body)
    } catch (error) {
      logger.warn('Error validando datos en PUT /api/admin/technologies/[id]', { error, body, id })
      
      // Si es un error de Zod, devolver detalles específicos
      if (error instanceof Error && 'issues' in (error as any)) {
        const zodError = error as any
        const fieldErrors: Record<string, string> = {}
        
        zodError.issues?.forEach((issue: any) => {
          const path = issue.path.join('.')
          fieldErrors[path] = issue.message
        })
        
        return NextResponse.json(
          { 
            error: "Datos inválidos", 
            message: "Por favor, corrige los errores en el formulario",
            details: fieldErrors
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: "Datos inválidos", message: "Los datos proporcionados no son válidos" },
        { status: 400 }
      )
    }

    // Si se está actualizando el nombre o la categoría, verificar duplicados
    if (validatedData.name || validatedData.category) {
      const nameToCheck = validatedData.name ?? existing.name
      const categoryToCheck = validatedData.category ?? existing.category
      
      const duplicateByName = await (prisma as any).technology.findFirst({
        where: {
          name: nameToCheck,
          category: categoryToCheck,
          id: { not: id }, // Excluir la tecnología actual
        },
      })

      if (duplicateByName) {
        logger.warn('Intento de actualizar tecnología con nombre duplicado', { 
          id,
          name: nameToCheck,
          category: categoryToCheck,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Tecnología duplicada", 
            message: `Ya existe una tecnología llamada "${nameToCheck}" en la categoría "${categoryToCheck}".`
          },
          { status: 400 }
        )
      }
    }

    // Si se está actualizando el orden o la categoría, verificar duplicados de orden (solo para tecnologías activas)
    if (validatedData.order !== undefined || validatedData.category) {
      const orderToCheck = validatedData.order ?? existing.order
      const categoryToCheck = validatedData.category ?? existing.category
      // Solo validar si la tecnología se está creando como activa o se está activando
      const willBeActive = validatedData.active !== undefined ? validatedData.active : existing.active
      
      if (willBeActive) {
        const existingActiveByOrder = await (prisma as any).technology.findFirst({
          where: {
            order: orderToCheck,
            category: categoryToCheck,
            active: true,
            id: { not: id }, // Excluir la tecnología actual
          },
        })

        if (existingActiveByOrder) {
          logger.warn('Intento de actualizar tecnología activa con orden duplicado', { 
            id,
            order: orderToCheck,
            category: categoryToCheck,
            existingId: existingActiveByOrder.id,
            userId: session.user.id 
          })
          return NextResponse.json(
            { 
              error: "Orden duplicado", 
              message: `Ya existe una tecnología activa con el orden ${orderToCheck} en la categoría "${categoryToCheck}". Solo puede haber una tecnología activa por orden dentro de la misma categoría.`
            },
            { status: 400 }
          )
        }
      }
    }

    // También verificar si se está intentando activar una tecnología inactiva que tiene un orden ya ocupado por otra tecnología activa en la misma categoría
    if (validatedData.active === true && existing.active === false) {
      const existingActiveWithOrder = await (prisma as any).technology.findFirst({
        where: {
          order: existing.order,
          category: existing.category,
          active: true,
          id: { not: id }, // Excluir la tecnología actual
        },
      })

      if (existingActiveWithOrder) {
        logger.warn('Intento de activar tecnología con orden ya ocupado por otra tecnología activa', { 
          id,
          order: existing.order,
          category: existing.category,
          existingId: existingActiveWithOrder.id,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Orden duplicado", 
            message: `Ya existe una tecnología activa con el orden ${existing.order} en la categoría "${existing.category}". Solo puede haber una tecnología activa por orden dentro de la misma categoría. Desactiva la otra tecnología primero.`
          },
          { status: 400 }
        )
      }
    }

    // Actualizar la tecnología
    const technology = await (prisma as any).technology.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        category: true,
        order: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logger.info('Tecnología actualizada exitosamente', { 
      id: technology.id,
      userId: session.user.id 
    })

    return NextResponse.json(technology)
  } catch (error) {
    logger.error('Error actualizando tecnología', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo technology')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Technology no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al actualizar la tecnología", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/technologies/[id]
 * 
 * Elimina una tecnología
 * 
 * @param request - Request
 * @param params - Parámetros de la ruta (id)
 * @returns Respuesta vacía
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de eliminación no autorizada de tecnología')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureTechnologyModel()

    const { id } = await params

    // Verificar que la tecnología existe
    const existing = await (prisma as any).technology.findUnique({
      where: { id },
    })

    if (!existing) {
      logger.warn('Intento de eliminar tecnología inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Tecnología no encontrada" },
        { status: 404 }
      )
    }

    // Eliminar la tecnología
    await (prisma as any).technology.delete({
      where: { id },
    })

    logger.info('Tecnología eliminada exitosamente', { 
      id,
      name: existing.name,
      userId: session.user.id 
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error('Error eliminando tecnología', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo technology')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Technology no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al eliminar la tecnología", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

