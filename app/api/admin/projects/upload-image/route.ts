/**
 * API Route: Upload Project Image
 * 
 * Maneja la subida de imágenes para proyectos
 * Guarda las imágenes en public/images/projects/
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

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

    // Parsear el FormData
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const previousImageUrl = formData.get("previousImageUrl") as string | null

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    // Eliminar imagen anterior si existe
    if (previousImageUrl && previousImageUrl.startsWith('/images/projects/')) {
      try {
        const previousImagePath = join(process.cwd(), "public", previousImageUrl)
        if (existsSync(previousImagePath)) {
          await unlink(previousImagePath)
          logger.info('Imagen anterior eliminada', { previousImageUrl })
        }
      } catch (error) {
        // No fallar si no se puede eliminar la imagen anterior
        logger.warn('No se pudo eliminar la imagen anterior', { previousImageUrl, error })
      }
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se permiten JPG y PNG" },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      )
    }

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), "public", "images", "projects")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
      logger.info('Directorio de proyectos creado', { uploadDir })
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `project-${timestamp}-${randomString}.${extension}`
    const filePath = join(uploadDir, fileName)

    // Convertir File a Buffer y guardar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Devolver la ruta relativa para usar en el frontend
    const imageUrl = `/images/projects/${fileName}`

    logger.info('Imagen de proyecto subida', { fileName, size: file.size, userId: session.user.id })
    
    return NextResponse.json({ 
      success: true,
      imageUrl,
      fileName 
    })
  } catch (error) {
    logger.error('Error subiendo imagen de proyecto', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: "Error al subir la imagen", message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    )
  }
}

