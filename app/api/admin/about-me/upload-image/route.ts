/**
 * API Route: Upload Profile Image
 * 
 * Maneja la subida de la imagen de perfil del About Me
 * Guarda la imagen en public/images/profile/profile.jpg
 * Reemplaza la imagen anterior si existe
 * 
 * Mejoras implementadas:
 * - Validación exhaustiva de archivos
 * - Manejo robusto de errores con logging estructurado
 * - Limpieza automática de archivos antiguos
 * - Validación de tipos MIME
 * - Límites de tamaño de archivo
 */

import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

/**
 * Configuración de la subida de archivos
 */
const UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  UPLOAD_DIR: join(process.cwd(), 'public', 'images', 'profile'),
  FILE_NAME: 'profile.jpg',
} as const

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

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!(UPLOAD_CONFIG.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      logger.warn('Tipo de archivo no permitido en upload de perfil', { 
        type: file.type,
        userId: session.user.id 
      })
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se permiten JPG y PNG" },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > UPLOAD_CONFIG.MAX_SIZE) {
      logger.warn('Archivo demasiado grande en upload de perfil', { 
        size: file.size,
        maxSize: UPLOAD_CONFIG.MAX_SIZE,
        userId: session.user.id 
      })
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      )
    }

    // Crear directorio si no existe
    if (!existsSync(UPLOAD_CONFIG.UPLOAD_DIR)) {
      await mkdir(UPLOAD_CONFIG.UPLOAD_DIR, { recursive: true })
      logger.debug('Directorio de upload creado', { dir: UPLOAD_CONFIG.UPLOAD_DIR })
    }

    // Eliminar imagen anterior si existe (siempre se reemplaza)
    const previousImagePath = join(UPLOAD_CONFIG.UPLOAD_DIR, UPLOAD_CONFIG.FILE_NAME)
    if (existsSync(previousImagePath)) {
      try {
        await unlink(previousImagePath)
        logger.info('Imagen anterior de perfil eliminada', { path: previousImagePath })
      } catch (error) {
        // No fallar si no se puede eliminar la imagen anterior
        logger.warn('No se pudo eliminar la imagen anterior de perfil', { 
          error: error instanceof Error ? error.message : 'Error desconocido',
          path: previousImagePath 
        })
      }
    }

    // El nombre siempre será profile.jpg
    const filePath = join(UPLOAD_CONFIG.UPLOAD_DIR, UPLOAD_CONFIG.FILE_NAME)

    // Convertir File a Buffer y guardar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Devolver la ruta relativa para usar en el frontend
    const imageUrl = `/images/profile/${UPLOAD_CONFIG.FILE_NAME}`

    logger.info('Imagen de perfil subida exitosamente', { 
      fileName: UPLOAD_CONFIG.FILE_NAME, 
      size: file.size, 
      type: file.type,
      userId: session.user.id 
    })
    
    return NextResponse.json({ 
      success: true,
      imageUrl,
      fileName: UPLOAD_CONFIG.FILE_NAME
    })
  } catch (error) {
    logger.error('Error subiendo imagen de perfil', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: "Error al subir la imagen", 
        message: error instanceof Error ? error.message : "Error desconocido" 
      },
      { status: 500 }
    )
  }
}

