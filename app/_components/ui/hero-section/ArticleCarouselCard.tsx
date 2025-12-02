'use client'
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ArticleCarouselCardProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const DEFAULT_IMAGE = '/images/img1.jpg';

/**
 * ArticleCarouselCard Component
 * 
 * Card component for displaying individual articles in the carousel.
 * 
 * @param title - Article title
 * @param description - Article description
 * @param url - Article URL
 * @param image - Optional article image (default: '/images/img1.jpg')
 */
const ArticleCarouselCard: React.FC<ArticleCarouselCardProps> = React.memo(({
  title,
  description,
  url,
  image = DEFAULT_IMAGE,
}) => {
  // Validation
  if (!title) {
    console.error('ArticleCarouselCard: title is required');
    return null;
  }

  if (!description) {
    console.warn('ArticleCarouselCard: description is missing');
  }

  if (!url) {
    console.error('ArticleCarouselCard: url is required');
    return null;
  }
  return (
    <article className="group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 h-[300px] md:h-[350px]">
      <div className="absolute inset-0 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${title} - Article background`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
      </div>

      {/* Overlay mitad inferior - solo responsive */}
      <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-black/60 z-10 lg:hidden" />
      
      {/* Overlay mitad derecha - solo desktop */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 bg-black/60 z-10" />

      <div className="relative z-20 h-full flex flex-col lg:flex-row">
        <div className="hidden lg:block w-1/2" />
        
        {/* Contenedor del contenido - en responsive está dentro del overlay inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:h-auto w-full lg:w-1/2 p-4 md:p-6 lg:p-8 flex flex-col justify-end lg:justify-between z-20">
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white mb-2 md:mb-3 leading-tight">
              {title}
            </h3>

            <p className="text-gray-300 text-xs md:text-sm lg:text-base leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6">
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 md:px-6 lg:px-6 text-xs md:text-base lg:py-3 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Read more
            </Link>
            
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Leer artículo"
            >
              <span className="text-base md:text-xl font-semibold">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
});

ArticleCarouselCard.displayName = 'ArticleCarouselCard';

export { ArticleCarouselCard };
export default ArticleCarouselCard;

