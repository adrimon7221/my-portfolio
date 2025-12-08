/**
 * API Route: Work Experience by ID
 * 
 * CRUD para una experiencia laboral específica
 * GET: Obtiene una experiencia laboral por ID
 * PUT: Actualiza una experiencia laboral
 * DELETE: Elimina una experiencia laboral
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos
 * - Optimización de queries de Prisma
 * - Respuestas consistentes y tipadas
 * - Prevención de duplicados de orden en actualización
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateUpdateWorkExperience } from "@/lib/validations"
import { logger } from "@/lib/logger"

/**
 * Verifica que el modelo WorkExperience esté disponible
 */
function ensureWorkExperienceModel() {
  if (!('workExperience' in prisma)) {
    throw new Error('Modelo workExperience no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/work-experience/[id]
 * 
 * Obtiene una experiencia laboral por ID
 * 
 * @param request - Request
 * @param params - Parámetros de la ruta (id)
 * @returns Experiencia laboral
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/work-experience/[id]')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureWorkExperienceModel()

    const { id } = await params

    // Obtener la experiencia laboral
    const workExperience = await (prisma as any).workExperience.findUnique({
      where: { id },
      select: {
        id: true,
        period: true,
        duration: true,
        company: true,
        position: true,
        order: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!workExperience) {
      logger.warn('Experiencia laboral no encontrada', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Experiencia laboral no encontrada" },
        { status: 404 }
      )
    }

    logger.debug('Experiencia laboral obtenida', { id, userId: session.user.id })
    return NextResponse.json(workExperience)
  } catch (error) {
    logger.error('Error obteniendo experiencia laboral', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo workExperience')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo WorkExperience no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Error al obtener la experiencia laboral" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/work-experience/[id]
 * 
 * Actualiza una experiencia laboral
 * 
 * @param request - Request con los datos a actualizar
 * @param params - Parámetros de la ruta (id)
 * @returns Experiencia laboral actualizada
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de actualización no autorizada de experiencia laboral')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureWorkExperienceModel()

    const { id } = await params

    // Verificar que la experiencia laboral existe
    const existing = await (prisma as any).workExperience.findUnique({
      where: { id },
    })

    if (!existing) {
      logger.warn('Intento de actualizar experiencia laboral inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Experiencia laboral no encontrada" },
        { status: 404 }
      )
    }

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en PUT /api/admin/work-experience/[id]', { error, id })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateUpdateWorkExperience(body)
    } catch (error) {
      logger.warn('Error validando datos en PUT /api/admin/work-experience/[id]', { error, body, id })
      
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

    // Si se está actualizando el orden, verificar duplicados (solo para experiencias activas)
    if (validatedData.order !== undefined && validatedData.order !== existing.order) {
      const orderToCheck = validatedData.order
      // Solo validar si la experiencia se está creando como activa o se está activando
      const willBeActive = validatedData.active !== undefined ? validatedData.active : existing.active
      
      if (willBeActive) {
        const existingActiveWithOrder = await (prisma as any).workExperience.findFirst({
          where: {
            order: orderToCheck,
            active: true,
            id: { not: id }, // Excluir la experiencia actual
          },
        })

        if (existingActiveWithOrder) {
          logger.warn('Intento de actualizar experiencia laboral activa con orden duplicado', { 
            id,
            order: orderToCheck,
            existingId: existingActiveWithOrder.id,
            userId: session.user.id 
          })
          return NextResponse.json(
            { 
              error: "Orden duplicado", 
              message: `Ya existe una experiencia laboral activa con el orden ${orderToCheck}. Solo puede haber una experiencia activa por posición.`
            },
            { status: 400 }
          )
        }
      }
    }

    // También verificar si se está intentando activar una experiencia inactiva que tiene un orden ya ocupado por otra experiencia activa
    if (validatedData.active === true && existing.active === false) {
      const existingActiveWithOrder = await (prisma as any).workExperience.findFirst({
        where: {
          order: existing.order,
          active: true,
          id: { not: id }, // Excluir la experiencia actual
        },
      })

      if (existingActiveWithOrder) {
        logger.warn('Intento de activar experiencia laboral con orden ya ocupado por otra experiencia activa', { 
          id,
          order: existing.order,
          existingId: existingActiveWithOrder.id,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Orden duplicado", 
            message: `Ya existe una experiencia laboral activa con el orden ${existing.order}. Solo puede haber una experiencia activa por posición. Desactiva la otra experiencia primero.`
          },
          { status: 400 }
        )
      }
    }

    // Actualizar la experiencia laboral
    const workExperience = await (prisma as any).workExperience.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        period: true,
        duration: true,
        company: true,
        position: true,
        order: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logger.info('Experiencia laboral actualizada exitosamente', { 
      id: workExperience.id,
      userId: session.user.id 
    })

    return NextResponse.json(workExperience)
  } catch (error) {
    logger.error('Error actualizando experiencia laboral', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo workExperience')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo WorkExperience no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al actualizar la experiencia laboral", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/work-experience/[id]
 * 
 * Elimina una experiencia laboral
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
      logger.warn('Intento de eliminación no autorizada de experiencia laboral')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureWorkExperienceModel()

    const { id } = await params

    // Verificar que la experiencia laboral existe
    const existing = await (prisma as any).workExperience.findUnique({
      where: { id },
    })

    if (!existing) {
      logger.warn('Intento de eliminar experiencia laboral inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Experiencia laboral no encontrada" },
        { status: 404 }
      )
    }

    // Eliminar la experiencia laboral
    await (prisma as any).workExperience.delete({
      where: { id },
    })

    logger.info('Experiencia laboral eliminada exitosamente', { 
      id,
      company: existing.company,
      userId: session.user.id 
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error('Error eliminando experiencia laboral', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo workExperience')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo WorkExperience no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al eliminar la experiencia laboral", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

