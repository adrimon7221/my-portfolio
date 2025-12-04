'use client';
import React from 'react';
import { DecorativeCircle } from '../hero-section';
import { DESKTOP_CONFIG, MOBILE_CONFIG } from '@/app/_constants/projects';

/**
 * ProjectImageCollage Component
 * 
 * Displays a collage of project images with decorative circle background.
 * 
 * @param images - Array of image source URLs
 * @param alt - Alt text for the images
 * @param isInView - Whether the component is in view (for animations)
 * @param transitionDelay - Animation delay in milliseconds
 * @param isReversed - Whether this is a reversed layout (for desktop)
 * @param isMobile - Whether this is the mobile layout
 * @param circlePosition - Position of the circle (for mobile: 'left' | 'right')
 */
interface ProjectImageCollageProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  transitionDelay?: number;
  isReversed?: boolean;
  isMobile?: boolean;
  circlePosition?: 'left' | 'right';
}

const ProjectImageCollage: React.FC<ProjectImageCollageProps> = React.memo(({
  images,
  alt,
  isInView = true,
  transitionDelay = 0,
  isReversed = false,
  isMobile = false,
  circlePosition,
}) => {
  if (isMobile) {
    const positionClasses = circlePosition === 'right'
      ? 'right-0 translate-x-1/2'
      : 'left-0 -translate-x-1/2';

    // Primer collage en mobile: solo mostrar rojo y verde (ocultar azul y morado)
    if (images.length === 4 && images[0].includes('rojo')) {
      return (
        <div className="relative mb-6 rounded-3xl overflow-visible">
          {/* Decorative Circle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out z-0 ${positionClasses} ${
              isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <DecorativeCircle 
              customSize={MOBILE_CONFIG.CIRCLE.SIZE} 
              className="!border !border-white/10" 
            />
          </div>
          
          {/* Image Collage - Mobile Layout - Rojo, verde y azul (morado oculto) */}
          <div className="relative z-10 flex flex-col gap-4">
            {/* Main large image in L shape - Rojo */}
            <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden">
              <svg className="absolute inset-0 w-0 h-0">
                <defs>
                  <clipPath id="rojo-mobile-clip" clipPathUnits="objectBoundingBox">
                    <path d="M 0.0 0 
                             L 0.94 0 
                             C 0.97 0 1 0.03 1 0.06 
                             L 1 0.42 
                             C 1 0.452 0.983 0.478 0.962 0.478 
                             L 0.705 0.478 
                             C 0.675 0.478 0.655 0.505 0.655 0.535 
                             L 0.655 0.92 
                             C 0.655 0.97 0.63 1 0.59 1 
                             L 0.03 1 
                             C 0.01 1 0 0.97 0 0.92 
                             L 0 0.08 
                             C 0 0.03 0.01 0 0.03 0 Z" />
                  </clipPath>
                </defs>
              </svg>
              <div 
                className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl"
                style={{ clipPath: 'url(#rojo-mobile-clip)' }}
              >
                <img 
                  src={images[0]} 
                  alt={`${alt} 1`} 
                  className="w-full h-full object-cover" 
                />
              </div>

              
              {/* Small image in bottom-right corner - Verde */}
              <div className="absolute bottom-0 right-0 w-[30%] aspect-square overflow-hidden rounded-xl z-10 -translate-x-2">
                <img 
                  src={images[1]} 
                  alt={`${alt} 2`} 
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
            </div>
            
            {/* Azul image - debajo del rojo y verde, centrada, un poco más arriba */}
            <div className="flex justify-center -mt-[11px]">
              <div className="w-[30%] aspect-square overflow-hidden rounded-xl">
                <img 
                  src={images[3]} 
                  alt={`${alt} 4`} 
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
            </div>
            {/* Morado NO se muestra en mobile */}
          </div>
        </div>
      );
    }

    // Layout móvil genérico para otros collages
    return (
      <div className="relative mb-6 rounded-3xl overflow-visible">
        {/* Decorative Circle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out z-0 ${positionClasses} ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <DecorativeCircle 
            customSize={MOBILE_CONFIG.CIRCLE.SIZE} 
            className="!border !border-white/10" 
          />
        </div>
        
        {/* Image Collage - Mobile Layout */}
        <div className="relative z-10 h-[400px]">
          {/* Main large image in L shape */}
          <div className="absolute top-0 left-0 overflow-visible rounded-xl" 
               style={{ 
                 width: '100%', 
                 height: '100%',
                 clipPath: 'polygon(0 0, 100% 0, 100% 68%, 68% 68%, 68% 100%, 0 100%)'
               }}>
            <div className="absolute inset-[2px] overflow-hidden rounded-xl"
                 style={{ 
                   clipPath: 'polygon(0 0, 100% 0, 100% calc(68% - 2px), calc(68% - 2px) calc(68% - 2px), calc(68% - 2px) calc(100% - 2px), 0 calc(100% - 2px))'
                 }}>
              <img 
                src={images[0]} 
                alt={`${alt} 1`} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          {/* Small image in bottom-right corner */}
          <div className="absolute bottom-0 right-0 w-[30%] aspect-square overflow-hidden rounded-lg">
            <img 
              src={images[1]} 
              alt={`${alt} 2`} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  const circleStyle = isReversed
    ? {
        top: DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.top,
        right: DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.right,
        transform: `translate(${DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.translateX}, -50%)`,
      }
    : {
        top: DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.top,
        left: DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.left,
        transform: `translate(${DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.translateX}, -50%)`,
      };

  return (
    <div className="relative flex items-start justify-end min-h-[600px]">
      {/* Decorative Circle */}
      <div
        className="absolute pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          ...circleStyle,
          opacity: isInView ? 1 : 0,
          transform: `${circleStyle.transform} scale(${isInView ? 1 : 0.95})`,
        }}
      >
        <DecorativeCircle 
          customSize={DESKTOP_CONFIG.CIRCLE.SIZE} 
          className="border-white/10" 
        />
      </div>

      {/* Image Collage - Desktop Layout */}
      <div
        className="relative z-10 transition-all duration-700 flex gap-4 bg-green-500"
        style={{
          opacity: isInView ? 1 : 0,
          transform: `scale(${isInView ? 1 : 0.95})`,
          transitionDelay: isInView ? `${transitionDelay}ms` : '0ms',
        }}
      >
        {images.length === 4 && images[0].includes('rojo') ? (
          <>
            {/* PRIMER COLLAGE - NO TOCAR - Del documento original */}
            <div className="relative w-[600px] h-[608px] flex-shrink-0">
<div className="absolute top-0 left-0 w-full h-[400px] overflow-visible rounded-[16px] bg-red-500"
     style={{ 
       clipPath: `path('M 32 0 L 568 0 C 585.673 0 600 14.327 600 32 L 600 168 C 600 180.703 589.703 191 577 191 L 414 191 C 401.297 191 391 201.297 391 214 L 391 368 C 391 385.673 376.673 400 359 400 L 32 400 C 14.327 400 0 385.673 0 368 L 0 32 C 0 14.327 14.327 0 32 0 Z')`
     }}>
  <div className="absolute inset-0 overflow-hidden rounded-[16px] bg-red-600"
       style={{ 
         clipPath: `path('M 34 2 L 566 2 C 583.673 2 598 16.327 598 34 L 598 166 C 598 178.703 587.703 189 575 189 L 412 189 C 399.297 189 389 199.297 389 212 L 389 366 C 389 383.673 374.673 398 357 398 L 34 398 C 16.327 398 2 383.673 2 366 L 2 34 C 2 16.327 16.327 2 34 2 Z')`
       }}>
    <img 
      src={images[0]} 
      alt={`${alt} 1`} 
      className="w-full h-full object-cover" 
    />
  </div>
</div>

<div className="absolute bottom-[calc(200px+8px)] right-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all bg-green-500">
  <img 
    src={images[1]} 
    alt={`${alt} 2`} 
    className="w-full h-full object-cover rounded-[21px]" 
  />
</div>

<div className="absolute bottom-0 right-[210px] w-[220px] h-[200px] overflow-hidden rounded-[16px] transition-all bg-blue-500">
  <img 
    src={images[3]} 
    alt={`${alt} 4`} 
    className="w-full h-full object-cover rounded-[21px]" 
  />
</div>
</div>

<div className="w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all flex-shrink-0 bg-purple-500">
<img 
  src={images[2]} 
  alt={`${alt} 3`} 
  className="w-full h-full object-cover rounded-[21px]" 
/>
</div>
</>
) : images.length === 3 ? (
          <>
            {/* SEGUNDO COLLAGE - 3 imágenes: amarillo con recortes, celeste, gris */}
            <div className="relative w-[816px] h-[605px] flex-shrink-0 ">
              {/* Yellow image - with cutouts in top-left and bottom-right corners */}
              <div className="absolute bottom-0 left-0 w-full h-[400px] overflow-visible rounded-[16px]"
                   style={{ 
                     clipPath: `path('M 232 0 C 219.297 0 209 10.297 209 23 L 209 186 C 209 198.703 198.703 209 186 209 L 16 209 C 7.163 209 0 216.163 0 225 L 0 368 C 0 385.673 14.327 400 32 400 L 575 400 C 592.673 400 607 385.673 607 368 L 607 214 C 607 201.297 617.297 191 630 191 L 793 191 C 805.703 191 816 180.703 816 168 L 816 32 C 816 14.327 801.673 0 784 0 L 232 0 C 224.837 0 219 5.837 219 13 L 219 196 C 219 203.837 224.837 209 232 209 L 232 209 C 239.163 209 246 201.837 246 193 L 246 16 C 246 7.163 238.837 0 230 0 L 232 0 Z')`
                   }}>
                <div className="absolute inset-0 overflow-hidden rounded-[16px]"
                     style={{ 
                       clipPath: `path('M 230 2 C 217.297 2 207 12.297 207 25 L 207 184 C 207 196.703 196.703 207 184 207 L 18 207 C 9.163 207 2 214.163 2 223 L 2 366 C 2 383.673 16.327 398 34 398 L 573 398 C 590.673 398 605 383.673 605 366 L 605 212 C 605 199.297 615.297 189 628 189 L 791 189 C 803.703 189 814 178.703 814 166 L 814 34 C 814 16.327 799.673 2 782 2 L 230 2 Z')`
                     }}>
                  <img 
                    src={images[0]} 
                    alt={`${alt} 1`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              
              {/* Gris image - top-left corner */}
              <div className="absolute top-[205px] left-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
                <img 
                  src={images[2]} 
                  alt={`${alt} 3`} 
                  className="w-full h-full object-cover rounded-[21px]" 
                />
              </div>
              
              {/* Celeste image - bottom-right corner */}
              <div className="absolute top-0 left-[210px] w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
                <img 
                  src={images[1]} 
                  alt={`${alt} 2`} 
                  className="w-full h-full object-cover rounded-[21px]" 
                />
              </div>
            </div>
          </>
        ) : images.length === 4 && images[0].includes('blanco') ? (
          <>
            {/* TERCER COLLAGE - 4 imágenes: blanco, lima, naranja, rosado */}
            <div className="flex gap-4 items-start h-[815px]">
              {/* Columna izquierda: Lima y Rosado */}
              <div className="flex flex-col gap-4 self-end">
                {/* Lima image - top */}
                <div className="w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
                  <img 
                    src={images[1]} 
                    alt={`${alt} 2`} 
                    className="w-full h-full object-cover rounded-[21px]" 
                  />
                </div>
                {/* Rosado image - bottom */}
                <div className="w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all">
                  <img 
                    src={images[3]} 
                    alt={`${alt} 4`} 
                    className="w-full h-full object-cover rounded-[21px]" 
                  />
                </div>
              </div>

              {/* Centro: Blanco image - sin clipPath */}
              <div className="w-[400px] h-[400px] overflow-hidden rounded-[16px] transition-all  mt-[200px]">
                <img 
                  src={images[0]} 
                  alt={`${alt} 1`} 
                  className="w-full h-full object-cover rounded-[21px]" 
                />
              </div>

              {/* Derecha: Naranja image */}
              <div className="w-[200px] h-[600px] overflow-hidden rounded-[16px] transition-all self-start">
                <img 
                  src={images[2]} 
                  alt={`${alt} 3`} 
                  className="w-full h-full object-cover rounded-[21px]" 
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
});

ProjectImageCollage.displayName = 'ProjectImageCollage';

export { ProjectImageCollage };