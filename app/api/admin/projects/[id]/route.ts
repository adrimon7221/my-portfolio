/**
 * API Route: Project by ID
 * 
 * CRUD para un proyecto específico
 * GET: Obtiene un proyecto por ID
 * PUT: Actualiza un proyecto
 * DELETE: Elimina un proyecto
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
import { validateUpdateProject } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { MAX_ACTIVE_PROJECTS, getProjectImagesLimitByCollageType } from "../../../../admin/projects/constants/projects.constants"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

/**
 * Verifica que el modelo Project esté disponible
 */
function ensureProjectModel() {
  if (!('project' in prisma)) {
    throw new Error('Modelo project no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/projects/[id]
 * 
 * Obtiene un proyecto por ID
 * 
 * @param request - Request
 * @param params - Parámetros de la ruta (id)
 * @returns Proyecto
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/projects/[id]')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureProjectModel()

    const { id } = await params

    // Obtener el proyecto
    const project = await (prisma as any).project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        images: true,
        tags: true,
        demoUrl: true,
        githubUrl: true,
        order: true,
        collageType: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!project) {
      logger.warn('Proyecto no encontrado', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    // Transformar JSON a arrays de strings
    const transformedProject = {
      ...project,
      images: project.images ? (Array.isArray(project.images) ? project.images : JSON.parse(project.images)) : null,
      tags: Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags),
    }

    logger.debug('Proyecto obtenido', { id, userId: session.user.id })
    return NextResponse.json(transformedProject)
  } catch (error) {
    logger.error('Error obteniendo proyecto', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo project')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Project no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Error al obtener el proyecto" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/projects/[id]
 * 
 * Actualiza un proyecto
 * 
 * @param request - Request con los datos a actualizar
 * @param params - Parámetros de la ruta (id)
 * @returns Proyecto actualizado
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de actualización no autorizada de proyecto')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureProjectModel()

    const { id } = await params

    // Verificar que el proyecto existe
    const existing = await (prisma as any).project.findUnique({
      where: { id },
    })

    if (!existing) {
      logger.warn('Intento de actualizar proyecto inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en PUT /api/admin/projects/[id]', { error, id })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateUpdateProject(body)
    } catch (error) {
      logger.warn('Error validando datos en PUT /api/admin/projects/[id]', { error, body, id })
      
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

    // Verificar límite de proyectos activos si se está intentando activar
    if (validatedData.active === true && existing.active === false) {
      const activeCount = await (prisma as any).project.count({
        where: {
          active: true,
        },
      })

      if (activeCount >= MAX_ACTIVE_PROJECTS) {
        logger.warn('Intento de activar proyecto cuando ya hay máximo permitido', { 
          id,
          activeCount,
          maxAllowed: MAX_ACTIVE_PROJECTS,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Límite de proyectos activos alcanzado", 
            message: `No se pueden tener más de ${MAX_ACTIVE_PROJECTS} proyectos activos. Desactiva otro proyecto primero.`
          },
          { status: 400 }
        )
      }
    }

    // Si se está actualizando el orden, verificar duplicados (solo para proyectos activos)
    // Nota: El orden no se puede cambiar después de crear, pero mantenemos esta validación por seguridad
    if (validatedData.order !== undefined && validatedData.order !== existing.order) {
      const orderToCheck = validatedData.order
      // Solo validar si el proyecto se está creando como activo o se está activando
      const willBeActive = validatedData.active !== undefined ? validatedData.active : existing.active
      
      if (willBeActive) {
        const existingActiveWithOrder = await (prisma as any).project.findFirst({
          where: {
            order: orderToCheck,
            active: true,
            id: { not: id }, // Excluir el proyecto actual
          },
        })

        if (existingActiveWithOrder) {
          logger.warn('Intento de actualizar proyecto activo con orden duplicado', { 
            id,
            order: orderToCheck,
            existingId: existingActiveWithOrder.id,
            userId: session.user.id 
          })
          return NextResponse.json(
            { 
              error: "Orden duplicado", 
              message: `Ya existe un proyecto activo con el orden ${orderToCheck}. Solo puede haber un proyecto activo por posición.`
            },
            { status: 400 }
          )
        }
      }
    }
    
    // También verificar si se está intentando activar un proyecto inactivo que tiene un orden ya ocupado por otro proyecto activo
    if (validatedData.active === true && existing.active === false) {
      const existingActiveWithOrder = await (prisma as any).project.findFirst({
        where: {
          order: existing.order,
          active: true,
          id: { not: id }, // Excluir el proyecto actual
        },
        select: {
          id: true,
          title: true,
          order: true,
        },
      })

      if (existingActiveWithOrder) {
        logger.warn('Intento de activar proyecto con orden ya ocupado por otro proyecto activo', { 
          id,
          order: existing.order,
          existingId: existingActiveWithOrder.id,
          existingTitle: existingActiveWithOrder.title,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Orden duplicado", 
            message: `Ya existe un proyecto activo con el orden ${existing.order} (${existingActiveWithOrder.title}). Solo puede haber un proyecto activo por posición. Desactiva el proyecto "${existingActiveWithOrder.title}" primero o cambia el orden de este proyecto.`
          },
          { status: 400 }
        )
      }
    }

    // El orden no se puede cambiar después de crear el proyecto
    if (validatedData.order !== undefined && validatedData.order !== existing.order) {
      logger.warn('Intento de cambiar el orden de un proyecto existente', { 
        id,
        oldOrder: existing.order,
        newOrder: validatedData.order,
        userId: session.user.id 
      })
      return NextResponse.json(
        { 
          error: "Orden no modificable", 
          message: "El orden (posición) del proyecto no se puede cambiar después de crearlo."
        },
        { status: 400 }
      )
    }

    // Validar que tenga exactamente el número de imágenes requerido según el tipo de collage
    // CRÍTICO: Siempre usar el collageType del formulario (body/validatedData) porque es el valor que el usuario ve y seleccionó.
    // Si no viene en validatedData (puede pasar con .partial() de Zod), verificar el body original antes de validar.
    // Finalmente usar el existente como fallback.
    const collageType = validatedData.collageType ?? (body.collageType ?? (existing.collageType ?? 'first'))
    const imagesLimit = getProjectImagesLimitByCollageType(collageType as 'first' | 'second' | 'third')
    
    // Usar las imágenes del formulario si se están actualizando, sino parsear las existentes
    let imagesCount = 0
    if (validatedData.images !== undefined) {
      imagesCount = validatedData.images.length
    } else {
      // Parsear las imágenes existentes de la BD
      if (existing.images) {
        if (Array.isArray(existing.images)) {
          imagesCount = existing.images.length
        } else if (typeof existing.images === 'string') {
          try {
            const parsed = JSON.parse(existing.images)
            imagesCount = Array.isArray(parsed) ? parsed.length : 0
          } catch {
            imagesCount = 0
          }
        }
      }
    }
    
    // Validar siempre que se actualice el proyecto (imágenes o collageType)
    // Esto asegura que el número de imágenes coincida con el collageType actual del formulario
    if (validatedData.images !== undefined || validatedData.collageType !== undefined) {
      if (imagesCount !== imagesLimit) {
        logger.warn('Intento de actualizar proyecto con número incorrecto de imágenes', { 
          id,
          collageType,
          imagesCount,
          required: imagesLimit,
          existingCollageType: existing.collageType,
          validatedCollageType: validatedData.collageType,
          bodyCollageType: body.collageType,
          updatingImages: validatedData.images !== undefined,
          updatingCollageType: validatedData.collageType !== undefined,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Número de imágenes incorrecto", 
            message: `Este proyecto con collage tipo "${collageType}" debe tener exactamente ${imagesLimit} imágenes adicionales (actualmente tiene ${imagesCount}).`
          },
          { status: 400 }
        )
      }
    }

    // Preparar datos para Prisma (convertir arrays a JSON si es necesario)
    // No incluir order en la actualización
    const prismaData: any = { ...validatedData }
    delete prismaData.order // El orden no se puede cambiar
    
    // Si se están actualizando las imágenes, eliminar archivos físicos de imágenes que ya no están en la lista
    if (validatedData.images !== undefined) {
      // Parsear imágenes existentes
      let existingImages: string[] = []
      if (existing.images) {
        if (Array.isArray(existing.images)) {
          existingImages = existing.images
        } else if (typeof existing.images === 'string') {
          try {
            existingImages = JSON.parse(existing.images)
          } catch {
            existingImages = []
          }
        }
      }
      
      // Identificar imágenes eliminadas (están en existingImages pero no en validatedData.images)
      const newImages = validatedData.images || []
      const deletedImages = existingImages.filter(img => !newImages.includes(img))
      
      // Eliminar archivos físicos de imágenes eliminadas
      for (const deletedImage of deletedImages) {
        if (deletedImage && deletedImage.startsWith('/images/projects/')) {
          try {
            const imagePath = join(process.cwd(), "public", deletedImage)
            if (existsSync(imagePath)) {
              await unlink(imagePath)
              logger.info('Imagen eliminada del sistema de archivos', { 
                imageUrl: deletedImage,
                projectId: id,
                userId: session.user.id 
              })
            }
          } catch (error) {
            // No fallar si no se puede eliminar la imagen
            logger.warn('No se pudo eliminar la imagen del sistema de archivos', { 
              imageUrl: deletedImage,
              error: error instanceof Error ? error.message : 'Error desconocido',
              projectId: id 
            })
          }
        }
      }
      
      prismaData.images = validatedData.images && validatedData.images.length > 0 ? validatedData.images : null
    }
    if (validatedData.demoUrl !== undefined) {
      prismaData.demoUrl = validatedData.demoUrl || null
    }
    if (validatedData.githubUrl !== undefined) {
      prismaData.githubUrl = validatedData.githubUrl || null
    }

    // Actualizar el proyecto
    const project = await (prisma as any).project.update({
      where: { id },
      data: prismaData,
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        images: true,
        tags: true,
        demoUrl: true,
        githubUrl: true,
        order: true,
        collageType: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Transformar JSON a arrays de strings
    const transformedProject = {
      ...project,
      images: project.images ? (Array.isArray(project.images) ? project.images : JSON.parse(project.images)) : null,
      tags: Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags),
    }

    logger.info('Proyecto actualizado exitosamente', { 
      id: transformedProject.id,
      userId: session.user.id 
    })

    return NextResponse.json(transformedProject)
  } catch (error) {
    logger.error('Error actualizando proyecto', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo project')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Project no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al actualizar el proyecto", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/projects/[id]
 * 
 * Elimina un proyecto
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
      logger.warn('Intento de eliminación no autorizada de proyecto')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureProjectModel()

    const { id } = await params

    // Verificar que el proyecto existe y obtener sus imágenes
    const existing = await (prisma as any).project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        images: true,
      },
    })

    if (!existing) {
      logger.warn('Intento de eliminar proyecto inexistente', { id, userId: session.user.id })
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      )
    }

    // Parsear imágenes para eliminarlas del sistema de archivos
    let imagesToDelete: string[] = []
    if (existing.images) {
      try {
        if (Array.isArray(existing.images)) {
          imagesToDelete = existing.images
        } else if (typeof existing.images === 'string') {
          imagesToDelete = JSON.parse(existing.images)
        }
      } catch (error) {
        logger.warn('Error parseando imágenes al eliminar proyecto', { id, error })
      }
    }

    // Eliminar el proyecto de la base de datos
    await (prisma as any).project.delete({
      where: { id },
    })

    // Eliminar imágenes físicas del sistema de archivos
    for (const imageUrl of imagesToDelete) {
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('/images/projects/')) {
        try {
          const imagePath = join(process.cwd(), "public", imageUrl)
          if (existsSync(imagePath)) {
            await unlink(imagePath)
            logger.info('Imagen eliminada del sistema de archivos', { 
              imageUrl,
              projectId: id 
            })
          }
        } catch (error) {
          // No fallar si no se puede eliminar la imagen
          logger.warn('No se pudo eliminar la imagen del sistema de archivos', { 
            imageUrl,
            error: error instanceof Error ? error.message : 'Error desconocido',
            projectId: id 
          })
        }
      }
    }

    logger.info('Proyecto eliminado exitosamente', { 
      id,
      title: existing.title,
      imagesDeleted: imagesToDelete.length,
      userId: session.user.id 
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error('Error eliminando proyecto', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo project')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo Project no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al eliminar el proyecto", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

