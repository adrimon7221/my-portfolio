/**
 * Utilidades para obtener y transformar enlaces sociales desde la base de datos
 * 
 * Convierte los enlaces sociales de la base de datos al formato
 * usado en el portfolio (SocialLinkItem)
 * 
 * Solo usa react-icons/fa para los iconos
 */

import { prisma } from '@/lib/prisma'
import type { SocialLinkItem } from '@/app/_types/social'

/**
 * Obtiene los enlaces sociales activos desde la base de datos (Server Component)
 * 
 * Esta función debe usarse solo en Server Components.
 * Para Client Components, usa el componente wrapper SocialLinksWrapper.
 * 
 * @returns Array de SocialLinkItem
 */
export async function getSocialLinksFromDB(): Promise<SocialLinkItem[]> {
  try {
    // Verificar que el modelo existe
    if (!('socialLink' in prisma)) {
      console.error('Modelo socialLink no disponible. Ejecuta: npx prisma generate')
      return []
    }

    // Obtener enlaces sociales desde Prisma
    // Usamos type assertion porque Prisma Client se genera dinámicamente
    const socialLinks = await (prisma as any).socialLink.findMany({
      where: {
        active: true, // Solo enlaces activos
      },
      orderBy: {
        order: 'asc', // Ordenados por el campo `order`
      },
      select: {
        id: true,
        label: true,
        url: true,
        icon: true,
        order: true,
      },
    })

    // Importar solo react-icons/fa
    const ReactIconsFa = await import('react-icons/fa')
    const React = await import('react')

    // Transformar a SocialLinkItem
    const transformedLinks: SocialLinkItem[] = []

    for (const link of socialLinks) {
      // Obtener el componente del icono desde react-icons/fa
      // react-icons/fa exporta los iconos directamente como named exports
      // Usamos 'any' temporalmente para evitar problemas de tipos con la importación dinámica
      const IconModule = ReactIconsFa as any
      const IconComponent = IconModule[link.icon] as React.ComponentType<{ className?: string }> | undefined

      if (!IconComponent || typeof IconComponent !== 'function') {
        console.warn(`Icon component not found: ${link.icon} for link: ${link.label}`)
        continue
      }

      transformedLinks.push({
        href: link.url,
        label: link.label,
        svg: React.createElement(IconComponent, { className: "w-4 h-4", "aria-hidden": true } as any),
      })
    }

    return transformedLinks
  } catch (error) {
    console.error('Error obteniendo enlaces sociales de la base de datos:', error)
    return []
  }
}

