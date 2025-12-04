/**
 * Helper functions for identifying collage types
 */

export type CollageType = 'first' | 'second' | 'third' | 'generic';

/**
 * Determines the collage type based on images array
 */
export const getCollageType = (images: readonly string[]): CollageType => {
  if (images.length === 4 && images[0].includes('rojo')) {
    return 'first';
  }
  if (images.length === 3 && images[0].includes('amarillo')) {
    return 'second';
  }
  if (images.length === 4 && images[0].includes('blanco')) {
    return 'third';
  }
  return 'generic';
};

