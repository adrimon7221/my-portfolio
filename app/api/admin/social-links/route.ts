/**
 * API Route: Social Links
 * 
 * CRUD completo para enlaces sociales
 * GET: Lista todos los enlaces sociales
 * POST: Crea un nuevo enlace social
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateCreateSocialLink } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { MAX_ACTIVE_SOCIAL_LINKS } from "@/app/admin/social/constants/social-links.constants"

export async function GET() {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Obtener todos los enlaces sociales ordenados por order
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    })

    logger.info('Enlaces sociales obtenidos', { count: socialLinks.length })
    return NextResponse.json(socialLinks)
  } catch (error) {
    logger.error('Error obteniendo enlaces sociales', error)
    return NextResponse.json(
      { error: "Error al obtener enlaces sociales" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Parsear y validar el body
    const body = await request.json()
    
    // Validar con Zod
    let validatedData
    try {
      validatedData = validateCreateSocialLink(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.debug('Validación falló al crear enlace social', { 
          issues: validationError.issues.map(i => ({ path: i.path, message: i.message }))
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

    // Verificar que el modelo existe (si no, el Prisma Client no se regeneró)
    if (!('socialLink' in prisma)) {
      logger.error('Modelo socialLink no disponible. Ejecuta: npx prisma generate')
      return NextResponse.json(
        { 
          error: "Error de configuración", 
          message: "El modelo SocialLink no está disponible. Ejecuta 'npx prisma generate' y reinicia el servidor."
        },
        { status: 500 }
      )
    }

    // Validar límite de enlaces activos (solo si el nuevo enlace está activo)
    if (validatedData.active === true) {
      const activeCount = await prisma.socialLink.count({
        where: { active: true },
      })

      if (activeCount >= MAX_ACTIVE_SOCIAL_LINKS) {
        logger.warn('Intento de crear enlace activo cuando ya hay 5 activos', { activeCount })
        return NextResponse.json(
          { 
            error: "Límite alcanzado", 
            message: `No se pueden tener más de ${MAX_ACTIVE_SOCIAL_LINKS} enlaces sociales activos. Desactiva otro enlace primero.`
          },
          { status: 400 }
        )
      }
    }

    // Crear el enlace social
    const socialLink = await prisma.socialLink.create({
      data: validatedData,
    })

    logger.info('Enlace social creado', { id: socialLink.id, label: socialLink.label })
    return NextResponse.json(socialLink, { status: 201 })
  } catch (error) {
    logger.error('Error creando enlace social', error)
    
    // Si es un error de Zod, ya lo manejamos arriba
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error al crear enlace social", message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    )
  }
}

