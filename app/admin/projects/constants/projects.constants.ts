/**
 * Constantes para Projects
 * 
 * Centraliza valores constantes relacionados con Projects
 */

/**
 * Máximo número de proyectos activos permitidos
 */
export const MAX_ACTIVE_PROJECTS = 3

/**
 * Items por página en la tabla
 */
export const ITEMS_PER_PAGE = 10

/**
 * Límites de imágenes adicionales según el tipo de collage
 */
export const COLLAGE_IMAGES_LIMITS: Record<'first' | 'second' | 'third', number> = {
  first: 4,  // Primer collage: 4 imágenes
  second: 3, // Segundo collage: 3 imágenes
  third: 4,  // Tercer collage: 4 imágenes
}

/**
 * Obtiene el límite de imágenes para un proyecto según su tipo de collage
 * 
 * @param collageType - Tipo de collage ('first', 'second', 'third')
 * @returns Límite de imágenes o 0 si no hay límite definido
 */
export function getProjectImagesLimitByCollageType(collageType: 'first' | 'second' | 'third'): number {
  return COLLAGE_IMAGES_LIMITS[collageType] ?? 0
}

/**
 * @deprecated Usa getProjectImagesLimitByCollageType en su lugar
 * Límites de imágenes adicionales según la posición del proyecto
 * El índice corresponde al order del proyecto (0 = primer proyecto, 1 = segundo, etc.)
 */
export const PROJECT_IMAGES_LIMITS: Record<number, number> = {
  0: 4, // Primer proyecto: máximo 4 imágenes
  1: 3, // Segundo proyecto: máximo 3 imágenes
  2: 4, // Tercer proyecto: máximo 4 imágenes
}

/**
 * @deprecated Usa getProjectImagesLimitByCollageType en su lugar
 * Obtiene el límite de imágenes para un proyecto según su orden
 * 
 * @param order - Orden del proyecto (0, 1, 2)
 * @returns Límite de imágenes o 0 si no hay límite definido
 */
export function getProjectImagesLimit(order: number): number {
  return PROJECT_IMAGES_LIMITS[order] ?? 0
}

/**
 * Opciones de collage disponibles
 */
export const COLLAGE_TYPES = ['first', 'second', 'third'] as const

/**
 * Etiquetas para los tipos de collage
 */
export const COLLAGE_TYPE_LABELS: Record<'first' | 'second' | 'third', string> = {
  first: 'Primer Collage (4 imágenes)',
  second: 'Segundo Collage (3 imágenes)',
  third: 'Tercer Collage (4 imágenes)',
}
