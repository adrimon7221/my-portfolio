/**
 * ClipPath Constants
 * 
 * SVG clipPath definitions used in project image collages.
 * All paths use clipPathUnits="objectBoundingBox" (values 0-1).
 */

export const CLIP_PATHS = {
  // Rojo collage - Mobile and Desktop (same path)
  ROJO_MOBILE: `M 0.053 0 
                 L 0.947 0 
                 C 0.976 0 1 0.024 1 0.053 
                 L 1 0.42 
                 C 1 0.452 0.983 0.478 0.962 0.478 
                 L 0.69 0.478 
                 C 0.669 0.478 0.652 0.503 0.652 0.535 
                 L 0.652 0.92 
                 C 0.652 0.964 0.628 1 0.598 1 
                 L 0.053 1 
                 C 0.024 1 0 0.964 0 0.92 
                 L 0 0.08 
                 C 0 0.024 0.024 0 0.053 0 Z`,

  // Rojo collage - Desktop (absolute values)
  ROJO_DESKTOP_OUTER: `path('M 32 0 L 568 0 C 585.673 0 600 14.327 600 32 L 600 168 C 600 180.703 589.703 191 577 191 L 414 191 C 401.297 191 391 201.297 391 214 L 391 368 C 391 385.673 376.673 400 359 400 L 32 400 C 14.327 400 0 385.673 0 368 L 0 32 C 0 14.327 14.327 0 32 0 Z')`,

  ROJO_DESKTOP_INNER: `path('M 34 2 L 566 2 C 583.673 2 598 16.327 598 34 L 598 166 C 598 178.703 587.703 189 575 189 L 412 189 C 399.297 189 389 199.297 389 212 L 389 366 C 389 383.673 374.673 398 357 398 L 34 398 C 16.327 398 2 383.673 2 366 L 2 34 C 2 16.327 16.327 2 34 2 Z')`,

  // Amarillo collage - Mobile
  AMARILLO_MOBILE: `M 0.340 0 
                     C 0.325 0 0.312 0.013 0.312 0.028 
                     L 0.312 0.465 
                     C 0.312 0.497 0.284 0.523 0.284 0.523 
                     L 0.020 0.523 
                     C 0.010 0.523 0 0.540 0 0.562 
                     L 0 0.920 
                     C 0 0.963 0.019 1 0.039 1 
                     L 1 1 
                     L 1 0 
                     L 0.340 0 Z`,

  // Amarillo collage - Desktop
  AMARILLO_DESKTOP_OUTER: `path('M 232 0 C 219.297 0 209 10.297 209 23 L 209 186 C 209 198.703 198.703 209 186 209 L 16 209 C 7.163 209 0 216.163 0 225 L 0 368 C 0 385.673 14.327 400 32 400 L 575 400 C 592.673 400 607 385.673 607 368 L 607 214 C 607 201.297 617.297 191 630 191 L 793 191 C 805.703 191 816 180.703 816 168 L 816 32 C 816 14.327 801.673 0 784 0 L 232 0 C 224.837 0 219 5.837 219 13 L 219 196 C 219 203.837 224.837 209 232 209 L 232 209 C 239.163 209 246 201.837 246 193 L 246 16 C 246 7.163 238.837 0 230 0 L 232 0 Z')`,

  AMARILLO_DESKTOP_INNER: `path('M 230 2 C 217.297 2 207 12.297 207 25 L 207 184 C 207 196.703 196.703 207 184 207 L 18 207 C 9.163 207 2 214.163 2 223 L 2 366 C 2 383.673 16.327 398 34 398 L 573 398 C 590.673 398 605 383.673 605 366 L 605 212 C 605 199.297 615.297 189 628 189 L 791 189 C 803.703 189 814 178.703 814 166 L 814 34 C 814 16.327 799.673 2 782 2 L 230 2 Z')`,
} as const;

/**
 * Image border radius constants
 * NOTE: Use BORDER_RADIUS from styles.ts instead for consistency
 * @deprecated Use BORDER_RADIUS from '@/app/_constants/styles' instead
 */
export const BORDER_RADIUS = {
  SMALL: 'rounded-[16px]',
  MEDIUM: 'rounded-xl',
  LARGE: 'rounded-[21px]',
  PROPORTIONAL: '10.5%', // For responsive images
} as const;

