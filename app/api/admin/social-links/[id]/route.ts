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
    const validatedData = validateUpdateSocialLink(body)

    // Actualizar el enlace social
    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: validatedData,
    })

    logger.info('Enlace social actualizado', { id: socialLink.id, label: socialLink.label })
    return NextResponse.json(socialLink)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      logger.debug('Validación falló al actualizar enlace social', { error: error.message })
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }
    logger.error('Error actualizando enlace social', error)
    return NextResponse.json(
      { error: "Error al actualizar enlace social" },
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

