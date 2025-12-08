/**
 * Constantes para Technologies
 * 
 * Centraliza valores constantes relacionados con Technologies
 */

/**
 * Categorías válidas de tecnologías
 */
export const TECHNOLOGY_CATEGORIES = ['frontend', 'styles', 'backend', 'devops'] as const

/**
 * Etiquetas de categorías para mostrar en la UI
 */
export const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Front-end',
  styles: 'Styles',
  backend: 'Back-end',
  devops: 'DevOps',
}

/**
 * Items por página en la tabla
 */
export const ITEMS_PER_PAGE = 10

