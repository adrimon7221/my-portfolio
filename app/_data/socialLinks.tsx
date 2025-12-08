/**
 * Enlaces sociales desde la base de datos
 * 
 * Este archivo ahora obtiene los enlaces sociales dinámicamente desde la base de datos.
 * Los datos se obtienen en el servidor y se pasan a los componentes client.
 * 
 * Para usar en Server Components, importa getSocialLinksFromDB directamente.
 * Para Client Components, usa el componente wrapper que obtiene los datos.
 */

import { getSocialLinksFromDB } from '@/app/_lib/social-links'
import type { SocialLinkItem } from '@/app/_types/social'

/**
 * Obtiene los enlaces sociales activos desde la base de datos
 * 
 * Esta función es async y debe usarse en Server Components.
 * Para Client Components, usa el componente SocialLinksProvider.
 * 
 * @returns Array de SocialLinkItem
 */
export async function getSocialLinks(): Promise<SocialLinkItem[]> {
  return getSocialLinksFromDB()
}

/**
 * Exportación por compatibilidad con código existente
 * 
 * NOTA: Esta constante ya no se usa directamente.
 * Los componentes deben usar getSocialLinks() o el componente wrapper.
 * 
 * @deprecated Usa getSocialLinks() en su lugar
 */
export const SOCIAL_LINKS: SocialLinkItem[] = []
