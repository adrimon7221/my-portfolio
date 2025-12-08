/**
 * API Route: Technologies
 * 
 * CRUD completo para tecnologías
 * GET: Lista todas las tecnologías
 * POST: Crea una nueva tecnología
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos
 * - Optimización de queries de Prisma
 * - Respuestas consistentes y tipadas
 * - Prevención de duplicados
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateCreateTechnology } from "@/lib/validations"
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
 * GET /api/admin/technologies
 * 
 * Obtiene todas las tecnologías ordenadas por categoría y orden
 * 
 * @returns Lista de tecnologías
 */
export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/technologies')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureTechnologyModel()

    // Obtener todas las tecnologías ordenadas por categoría y orden
    // Usar select explícito para optimizar la query
    const technologies = await (prisma as any).technology.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
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

    logger.info('Tecnologías obtenidas exitosamente', { 
      count: technologies.length,
      userId: session.user.id 
    })

    return NextResponse.json(technologies)
  } catch (error) {
    logger.error('Error obteniendo tecnologías', {
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
      { error: "Error al obtener las tecnologías" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/technologies
 * 
 * Crea una nueva tecnología
 * 
 * @param request - Request con los datos de la tecnología
 * @returns Tecnología creada
 */
export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de creación no autorizada de tecnología')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureTechnologyModel()

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en POST /api/admin/technologies', { error })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateCreateTechnology(body)
    } catch (error) {
      logger.warn('Error validando datos en POST /api/admin/technologies', { error, body })
      
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

    // Verificar si ya existe una tecnología con el mismo nombre en la misma categoría
    const existingByName = await (prisma as any).technology.findFirst({
      where: {
        name: validatedData.name,
        category: validatedData.category,
      },
    })

    if (existingByName) {
      logger.warn('Intento de crear tecnología duplicada', { 
        name: validatedData.name,
        category: validatedData.category,
        userId: session.user.id 
      })
      return NextResponse.json(
        { 
          error: "Tecnología duplicada", 
          message: `Ya existe una tecnología llamada "${validatedData.name}" en la categoría "${validatedData.category}".`
        },
        { status: 400 }
      )
    }

    // Verificar si ya existe una tecnología con el mismo orden en la misma categoría
    const existingByOrder = await (prisma as any).technology.findFirst({
      where: {
        order: validatedData.order,
        category: validatedData.category,
      },
    })

    if (existingByOrder) {
      logger.warn('Intento de crear tecnología con orden duplicado', { 
        order: validatedData.order,
        category: validatedData.category,
        userId: session.user.id 
      })
      return NextResponse.json(
        { 
          error: "Orden duplicado", 
          message: `Ya existe una tecnología con el orden ${validatedData.order} en la categoría "${validatedData.category}". El orden no puede repetirse dentro de la misma categoría.`
        },
        { status: 400 }
      )
    }

    // Crear la tecnología
    const technology = await (prisma as any).technology.create({
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

    logger.info('Tecnología creada exitosamente', { 
      id: technology.id,
      name: technology.name,
      category: technology.category,
      userId: session.user.id 
    })

    return NextResponse.json(technology, { status: 201 })
  } catch (error) {
    logger.error('Error creando tecnología', {
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
        error: "Error al crear la tecnología", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

