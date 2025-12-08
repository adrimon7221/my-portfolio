/**
 * Seeder de Enlaces Sociales
 * 
 * Crea enlaces sociales de ejemplo en la base de datos.
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '@/lib/logger'

// Datos de ejemplo para social links
const SOCIAL_LINKS_DATA = [
  {
    label: 'GitHub',
    url: 'https://github.com/your-username',
    icon: 'FaGithub',
    order: 1,
    active: true,
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/your-username',
    icon: 'FaLinkedin',
    order: 2,
    active: true,
  },
  {
    label: 'Telegram',
    url: 'https://t.me/your-username',
    icon: 'FaTelegram',
    order: 3,
    active: true,
  },
  {
    label: 'Facebook',
    url: 'https://facebook.com/your-username',
    icon: 'FaFacebook',
    order: 4,
    active: false,
  },
  {
    label: 'Instagram',
    url: 'https://instagram.com/your-username',
    icon: 'FaInstagram',
    order: 5,
    active: true,
  },
]

export async function seedSocialLinks(prisma: PrismaClient): Promise<void> {
  logger.info('🔗 Seeding enlaces sociales...')

  try {
    let created = 0
    let skipped = 0

    for (const linkData of SOCIAL_LINKS_DATA) {
      // Verificar si el enlace ya existe por label
      const existing = await prisma.socialLink.findFirst({
        where: { label: linkData.label },
        select: { id: true, label: true },
      })

      if (existing) {
        logger.debug(`Enlace social "${linkData.label}" ya existe. Saltando...`)
        skipped++
        continue
      }

      // Crear el enlace social
      await prisma.socialLink.create({
        data: linkData,
      })

      created++
      logger.debug(`Enlace social "${linkData.label}" creado`)
    }

    logger.info('Enlaces sociales procesados', {
      created,
      skipped,
      total: SOCIAL_LINKS_DATA.length,
    })
  } catch (error) {
    logger.error('Error creando enlaces sociales', error)
    throw error
  }
}

