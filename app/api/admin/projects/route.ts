/**
 * API Route: Projects
 * 
 * CRUD completo para proyectos
 * GET: Lista todos los proyectos
 * POST: Crea un nuevo proyecto
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos
 * - Optimización de queries de Prisma
 * - Respuestas consistentes y tipadas
 * - Prevención de duplicados de orden
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateCreateProject } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { MAX_ACTIVE_PROJECTS, getProjectImagesLimitByCollageType } from "../../../admin/projects/constants/projects.constants"

/**
 * Verifica que el modelo Project esté disponible
 */
function ensureProjectModel() {
  if (!('project' in prisma)) {
    throw new Error('Modelo project no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/projects
 * 
 * Obtiene todos los proyectos ordenados por orden
 * 
 * @returns Lista de proyectos
 */
export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/projects')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureProjectModel()

    // Obtener todos los proyectos ordenados por orden
    // Usar select explícito para optimizar la query
    const projects = await (prisma as any).project.findMany({
      orderBy: { order: 'asc' },
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
    const transformedProjects = projects.map((project: any) => ({
      ...project,
      images: project.images ? (Array.isArray(project.images) ? project.images : JSON.parse(project.images)) : null,
      tags: Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags),
    }))

    logger.info('Proyectos obtenidos exitosamente', { 
      count: transformedProjects.length,
      userId: session.user.id 
    })

    return NextResponse.json(transformedProjects)
  } catch (error) {
    logger.error('Error obteniendo proyectos', {
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
      { error: "Error al obtener los proyectos" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/projects
 * 
 * Crea un nuevo proyecto
 * 
 * @param request - Request con los datos del proyecto
 * @returns Proyecto creado
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de creación no autorizada de proyecto')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureProjectModel()

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en POST /api/admin/projects', { error })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateCreateProject(body)
    } catch (error) {
      logger.warn('Error validando datos en POST /api/admin/projects', { error, body })
      
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

    // Verificar límite de proyectos activos (solo si se está creando como activo)
    if (validatedData.active !== false) {
      const activeCount = await (prisma as any).project.count({
        where: {
          active: true,
        },
      })

      if (activeCount >= MAX_ACTIVE_PROJECTS) {
        logger.warn('Intento de crear proyecto activo cuando ya hay máximo permitido', { 
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

    // Verificar si ya existe un proyecto activo con el mismo orden (solo si se está creando como activo)
    if (validatedData.active !== false) {
      const existingActiveByOrder = await (prisma as any).project.findFirst({
        where: {
          order: validatedData.order,
          active: true,
        },
      })

      if (existingActiveByOrder) {
        logger.warn('Intento de crear proyecto activo con orden duplicado', { 
          order: validatedData.order,
          existingId: existingActiveByOrder.id,
          userId: session.user.id 
        })
        return NextResponse.json(
          { 
            error: "Orden duplicado", 
            message: `Ya existe un proyecto activo con el orden ${validatedData.order}. Solo puede haber un proyecto activo por posición.`
          },
          { status: 400 }
        )
      }
    }

    // Validar que tenga exactamente el número de imágenes requerido según el tipo de collage
    const collageType = validatedData.collageType || 'first'
    const imagesLimit = getProjectImagesLimitByCollageType(collageType)
    const imagesCount = validatedData.images?.length || 0
    if (imagesCount !== imagesLimit) {
      logger.warn('Intento de crear proyecto con número incorrecto de imágenes', { 
        collageType,
        imagesCount,
        required: imagesLimit,
        userId: session.user.id 
      })
      return NextResponse.json(
        { 
          error: "Número de imágenes incorrecto", 
          message: `El proyecto con collage tipo "${collageType}" debe tener exactamente ${imagesLimit} imágenes adicionales (actualmente tiene ${imagesCount}).`
        },
        { status: 400 }
      )
    }

    // Validar que el orden esté en el rango permitido (0-2)
    if (validatedData.order < 0 || validatedData.order > 2) {
      logger.warn('Intento de crear proyecto con orden inválido', { 
        order: validatedData.order,
        userId: session.user.id 
      })
      return NextResponse.json(
        { 
          error: "Orden inválido", 
          message: "El orden debe ser 0, 1 o 2 (correspondiente a la primera, segunda o tercera posición)."
        },
        { status: 400 }
      )
    }

    // Preparar datos para Prisma (convertir arrays a JSON)
    const prismaData = {
      ...validatedData,
      images: validatedData.images && validatedData.images.length > 0 ? validatedData.images : null,
      tags: validatedData.tags,
      demoUrl: validatedData.demoUrl || null,
      githubUrl: validatedData.githubUrl || null,
    }

    // Crear el proyecto
    const project = await (prisma as any).project.create({
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

    logger.info('Proyecto creado exitosamente', { 
      id: transformedProject.id,
      title: transformedProject.title,
      userId: session.user.id 
    })

    return NextResponse.json(transformedProject, { status: 201 })
  } catch (error) {
    logger.error('Error creando proyecto', {
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
        error: "Error al crear el proyecto", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

