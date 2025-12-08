/**
 * Utilidades para obtener información del About Me desde la base de datos
 * 
 * Server Component utility para obtener la información del About Me
 * desde Prisma y transformarla al formato esperado por los componentes.
 * 
 * Mejoras implementadas:
 * - Logging estructurado con logger
 * - Manejo robusto de errores (nunca lanza errores, siempre retorna valores seguros)
 * - Validación de tipos
 * - Fallback a imagen por defecto
 * - Cache busting opcional
 * - Optimización de queries (solo campos necesarios)
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Verifica que el modelo AboutMe esté disponible
 * 
 * @returns true si el modelo está disponible, false si no
 */
function ensureAboutMeModel(): boolean {
  if (!('aboutMe' in prisma)) {
    logger.warn('Modelo aboutMe no disponible. Ejecuta: npx prisma generate y reinicia el servidor')
    return false
  }
  return true
}

/**
 * Interfaz para la información del About Me
 */
export interface AboutMeData {
  profileImage: string | null
}

/**
 * Obtiene la información del About Me desde la base de datos
 * 
 * Esta función nunca lanza errores. Siempre retorna un objeto válido,
 * incluso si hay errores de base de datos o el modelo no está disponible.
 * 
 * @returns Información del About Me con la imagen de perfil
 *          Si hay un error, retorna { profileImage: null }
 */
export async function getAboutMeFromDB(): Promise<AboutMeData> {
  try {
    // Verificar que el modelo existe
    if (!ensureAboutMeModel()) {
      logger.debug('Modelo aboutMe no disponible, retornando valores por defecto')
      return { profileImage: null }
    }

    logger.debug('Buscando información del About Me en la base de datos')

    // Query optimizada: solo campos necesarios
    const aboutMe = await (prisma as any).aboutMe.findFirst({
      select: {
        profileImage: true,
      },
    })

    if (!aboutMe) {
      logger.debug('No se encontró información del About Me en la BD, usando valores por defecto')
      return { profileImage: null }
    }

    logger.info('About Me obtenido exitosamente', { 
      hasProfileImage: !!aboutMe.profileImage 
    })
    
    return {
      profileImage: aboutMe.profileImage || null,
    }
  } catch (error) {
    logger.error('Error obteniendo About Me de la base de datos', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // En caso de error, retornar null para usar imagen por defecto
    // Esto asegura que la aplicación nunca se rompa por errores de BD
    return { profileImage: null }
  }
}

/**
 * Obtiene la URL de la imagen de perfil
 * 
 * Si hay una imagen en la base de datos, la retorna.
 * Si no, retorna la ruta por defecto.
 * 
 * @param useCacheBusting - Si es true, agrega un timestamp para forzar recarga (default: false)
 * @returns URL de la imagen de perfil (desde BD o por defecto)
 */
export async function getProfileImageUrl(useCacheBusting: boolean = false): Promise<string> {
  const aboutMe = await getAboutMeFromDB()
  
  // Si hay imagen en BD, usarla; si no, usar la ruta por defecto
  const imageUrl = aboutMe.profileImage || '/images/profile/profile.jpg'
  
  // Si se solicita cache busting, agregar timestamp
  if (useCacheBusting) {
    const separator = imageUrl.includes('?') ? '&' : '?'
    return `${imageUrl}${separator}t=${Date.now()}`
  }
  
  return imageUrl
}

