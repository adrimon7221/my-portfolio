/**
 * API Route: Work Experience
 * 
 * CRUD completo para experiencias laborales
 * GET: Lista todas las experiencias laborales
 * POST: Crea una nueva experiencia laboral
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
import { validateCreateWorkExperience } from "@/lib/validations"
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
 * GET /api/admin/work-experience
 * 
 * Obtiene todas las experiencias laborales ordenadas por orden
 * 
 * @returns Lista de experiencias laborales
 */
export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/work-experience')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureWorkExperienceModel()

    // Obtener todas las experiencias laborales ordenadas por orden
    // Usar select explícito para optimizar la query
    const workExperiences = await (prisma as any).workExperience.findMany({
      orderBy: { order: 'asc' },
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

    logger.info('Experiencias laborales obtenidas exitosamente', { 
      count: workExperiences.length,
      userId: session.user.id 
    })

    return NextResponse.json(workExperiences)
  } catch (error) {
    logger.error('Error obteniendo experiencias laborales', {
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
      { error: "Error al obtener las experiencias laborales" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/work-experience
 * 
 * Crea una nueva experiencia laboral
 * 
 * @param request - Request con los datos de la experiencia laboral
 * @returns Experiencia laboral creada
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de creación no autorizada de experiencia laboral')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureWorkExperienceModel()

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en POST /api/admin/work-experience', { error })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateCreateWorkExperience(body)
    } catch (error) {
      logger.warn('Error validando datos en POST /api/admin/work-experience', { error, body })
      
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

    // Verificar si ya existe una experiencia con el mismo orden
    const existingByOrder = await (prisma as any).workExperience.findFirst({
      where: {
        order: validatedData.order,
      },
    })

    if (existingByOrder) {
      logger.warn('Intento de crear experiencia laboral con orden duplicado', { 
        order: validatedData.order,
        userId: session.user.id 
      })
      return NextResponse.json(
        { 
          error: "Orden duplicado", 
          message: `Ya existe una experiencia laboral con el orden ${validatedData.order}. El orden no puede repetirse.`
        },
        { status: 400 }
      )
    }

    // Crear la experiencia laboral
    const workExperience = await (prisma as any).workExperience.create({
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

    logger.info('Experiencia laboral creada exitosamente', { 
      id: workExperience.id,
      company: workExperience.company,
      userId: session.user.id 
    })

    return NextResponse.json(workExperience, { status: 201 })
  } catch (error) {
    logger.error('Error creando experiencia laboral', {
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
        error: "Error al crear la experiencia laboral", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

