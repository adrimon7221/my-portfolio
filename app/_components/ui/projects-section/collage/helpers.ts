/**
 * Helper functions for identifying collage types
 */

export type CollageType = 'first' | 'second' | 'third' | 'generic';

/**
 * Determines the collage type based on project index (position)
 * 
 * - Primer proyecto (índice 0) = siempre 'first' collage
 * - Segundo proyecto (índice 1) = siempre 'second' collage
 * - Tercer proyecto (índice 2) = siempre 'first' collage (mismo que el primero)
 * 
 * @param images - Array of image URLs
 * @param projectIndex - Index of the project (0 = first, 1 = second, 2 = third)
 * @returns Collage type
 */
export const getCollageType = (images: readonly string[], projectIndex?: number): CollageType => {
  // El primer proyecto (índice 0) siempre usa el primer collage
  if (projectIndex === 0) {
    return 'first';
  }
  
  // El segundo proyecto (índice 1) siempre usa el segundo collage
  if (projectIndex === 1) {
    return 'second';
  }
  
  // El tercer proyecto (índice 2) usa el tercer collage
  if (projectIndex === 2) {
    return 'third';
  }
  
  // Fallback: determinar por número de imágenes si no hay índice
  if (images.length === 4) {
    return 'first';
  }
  
  if (images.length === 3) {
    return 'second';
  }
  
  return 'generic';
};

