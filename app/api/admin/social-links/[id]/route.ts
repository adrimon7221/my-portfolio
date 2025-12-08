/**
 * API Route: Social Link por ID
 * 
 * GET: Obtiene un enlace social por ID
 * PUT: Actualiza un enlace social
 * DELETE: Elimina un enlace social
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateUpdateSocialLink } from "@/lib/validations"
import { logger } from "@/lib/logger"
import { z } from "zod"
import { MAX_ACTIVE_SOCIAL_LINKS } from "@/app/admin/social/constants/social-links.constants"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Obtener el enlace social
    const socialLink = await prisma.socialLink.findUnique({
      where: { id },
    })

    if (!socialLink) {
      return NextResponse.json(
        { error: "Enlace social no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(socialLink)
  } catch (error) {
    logger.error('Error obteniendo enlace social', error)
    return NextResponse.json(
      { error: "Error al obtener enlace social" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verificar que existe
    const existing = await prisma.socialLink.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Enlace social no encontrado" },
        { status: 404 }
      )
    }

    // Parsear y validar el body
    const body = await request.json()
    
    // Validar con Zod
    let validatedData
    try {
      validatedData = validateUpdateSocialLink(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.debug('Validación falló al actualizar enlace social', { 
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

    // Validar límite de enlaces activos (solo si se está intentando activar)
    if (validatedData.active === true && existing.active === false) {
      const activeCount = await prisma.socialLink.count({
        where: { active: true },
      })

      if (activeCount >= MAX_ACTIVE_SOCIAL_LINKS) {
        logger.warn('Intento de activar enlace cuando ya hay 5 activos', { activeCount, linkId: id })
        return NextResponse.json(
          { 
            error: "Límite alcanzado", 
            message: `No se pueden tener más de ${MAX_ACTIVE_SOCIAL_LINKS} enlaces sociales activos. Desactiva otro enlace primero.`
          },
          { status: 400 }
        )
      }
    }

    // Actualizar el enlace social
    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: validatedData,
    })

    logger.info('Enlace social actualizado', { id: socialLink.id, label: socialLink.label })
    return NextResponse.json(socialLink)
  } catch (error) {
    logger.error('Error actualizando enlace social', error)
    
    // Si es un error de Zod, ya lo manejamos arriba
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error al actualizar enlace social", message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Verificar autenticación
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verificar que existe
    const existing = await prisma.socialLink.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Enlace social no encontrado" },
        { status: 404 }
      )
    }

    // Eliminar el enlace social (sin soft delete)
    await prisma.socialLink.delete({
      where: { id },
    })

    logger.info('Enlace social eliminado', { id, label: existing.label })
    return NextResponse.json({ message: "Enlace social eliminado correctamente" })
  } catch (error) {
    logger.error('Error eliminando enlace social', error)
    return NextResponse.json(
      { error: "Error al eliminar enlace social" },
      { status: 500 }
    )
  }
}

