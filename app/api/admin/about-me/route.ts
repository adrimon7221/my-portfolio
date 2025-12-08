/**
 * API Route: About Me
 * 
 * GET: Obtiene la información del About Me
 * PUT: Actualiza la información del About Me
 * 
 * Modelo singleton: solo hay un registro de About Me
 * 
 * Mejoras implementadas:
 * - Manejo robusto de errores con logging estructurado
 * - Validación exhaustiva de datos con Zod
 * - Optimización de queries de Prisma
 * - Respuestas consistentes y tipadas
 * - Validación de tipos de datos
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { validateUpdateAboutMe } from "@/lib/validations"

/**
 * Verifica que el modelo AboutMe esté disponible
 */
function ensureAboutMeModel() {
  if (!('aboutMe' in prisma)) {
    throw new Error('Modelo aboutMe no disponible. Ejecuta: npx prisma generate')
  }
}

/**
 * GET /api/admin/about-me
 * 
 * Obtiene la información del About Me
 * Si no existe, retorna null
 * 
 * @returns Información del About Me o null
 */
export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de acceso no autorizado a GET /api/admin/about-me')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureAboutMeModel()

    // Obtener el primer registro (singleton)
    const aboutMe = await (prisma as any).aboutMe.findFirst({
      select: {
        id: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    logger.debug('About Me obtenido', { exists: !!aboutMe, userId: session.user.id })
    return NextResponse.json(aboutMe)
  } catch (error) {
    logger.error('Error obteniendo About Me', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo aboutMe')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo AboutMe no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Error al obtener About Me" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/about-me
 * 
 * Actualiza o crea la información del About Me
 * Como es un singleton, si no existe lo crea, si existe lo actualiza
 * 
 * @param request - Request con los datos a actualizar
 * @returns About Me actualizado o creado
 */
export async function PUT(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      logger.warn('Intento de actualización no autorizada de About Me')
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Verificar que el modelo existe
    ensureAboutMeModel()

    // Parsear el body
    let body
    try {
      body = await request.json()
    } catch (error) {
      logger.warn('Error parseando JSON en PUT /api/admin/about-me', { error })
      return NextResponse.json(
        { error: "Datos inválidos", message: "El cuerpo de la petición no es un JSON válido" },
        { status: 400 }
      )
    }

    // Validar datos con Zod
    let validatedData
    try {
      validatedData = validateUpdateAboutMe(body)
    } catch (error) {
      logger.warn('Error validando datos en PUT /api/admin/about-me', { error, body })
      
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

    // Buscar si ya existe un registro
    const existing = await (prisma as any).aboutMe.findFirst()

    let aboutMe
    if (existing) {
      // Actualizar el registro existente
      aboutMe = await (prisma as any).aboutMe.update({
        where: { id: existing.id },
        data: {
          profileImage: validatedData.profileImage ?? null,
        },
        select: {
          id: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      logger.info('About Me actualizado', { id: aboutMe.id, userId: session.user.id })
    } else {
      // Crear nuevo registro
      aboutMe = await (prisma as any).aboutMe.create({
        data: {
          profileImage: validatedData.profileImage ?? null,
        },
        select: {
          id: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      logger.info('About Me creado', { id: aboutMe.id, userId: session.user.id })
    }

    return NextResponse.json(aboutMe)
  } catch (error) {
    logger.error('Error actualizando About Me', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Si es un error del modelo, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Modelo aboutMe')) {
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo AboutMe no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Error al actualizar About Me", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

