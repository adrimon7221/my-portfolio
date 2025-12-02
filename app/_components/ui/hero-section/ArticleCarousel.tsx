'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ArticleCarouselCard from './ArticleCarouselCard';
import { ArticleCarouselProps } from '@/app/_types/carousel';
import { CAROUSEL_CONFIG } from '@/app/_constants/carousel';

const ArticleCarousel: React.FC<ArticleCarouselProps> = ({
  articles,
  autoPlay = CAROUSEL_CONFIG.DEFAULT_AUTO_PLAY,
  autoPlayInterval = CAROUSEL_CONFIG.DEFAULT_AUTO_PLAY_INTERVAL,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSlideChange = useCallback((newIndex: number, pauseAutoPlay = false) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    if (pauseAutoPlay) {
      setIsAutoPlaying(false);
    }
    setTimeout(() => {
      setIsTransitioning(false);
      if (pauseAutoPlay) {
        setIsAutoPlaying(true);
      }
    }, CAROUSEL_CONFIG.TRANSITION_DURATION);
  }, [isTransitioning]);

  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, CAROUSEL_CONFIG.TRANSITION_DURATION);
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length, autoPlayInterval, isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= articles.length) return;
    handleSlideChange(index, true);
  }, [articles.length, handleSlideChange]);

  const goToPrevious = useCallback(() => {
    handleSlideChange(
      (currentIndex - 1 + articles.length) % articles.length,
      true
    );
  }, [currentIndex, articles.length, handleSlideChange]);

  const goToNext = useCallback(() => {
    handleSlideChange(
      (currentIndex + 1) % articles.length,
      true
    );
  }, [currentIndex, articles.length, handleSlideChange]);

  const visible = useMemo(() => {
    if (articles.length === 0) return null;
    const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
    const nextIndex = (currentIndex + 1) % articles.length;
    return {
      prev: articles[prevIndex],
      current: articles[currentIndex],
      next: articles[nextIndex],
    };
  }, [articles, currentIndex]);

  if (articles.length === 0) {
    return (
      <div className="relative w-full text-center py-8">
        <p className="text-gray-400">No hay artículos disponibles</p>
      </div>
    );
  }

  if (!visible) return null;

  return (
    <div className="relative w-full">
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="relative overflow-hidden lg:overflow-visible">
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <div className="hidden lg:block flex-shrink-0 w-full max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] relative z-0">
              <div className={`relative opacity-40 transition-all duration-700 ease-in-out ${
                isTransitioning ? 'opacity-30 scale-95' : 'opacity-40 scale-90'
              }`}>
                <div className="relative overflow-hidden rounded-xl">
                  <ArticleCarouselCard
                    title={visible.prev.title}
                    description={visible.prev.description}
                    url={visible.prev.url}
                    image={visible.prev.image}
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-black/95 via-black/80 to-transparent backdrop-blur-md z-20 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className={`flex-shrink-0 w-full max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] relative z-10 transform transition-all duration-700 ease-in-out ${
              isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
            }`}>
              <ArticleCarouselCard
                title={visible.current.title}
                description={visible.current.description}
                url={visible.current.url}
                image={visible.current.image}
              />
            </div>

            <div className="hidden lg:block flex-shrink-0 w-full max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px] relative z-0">
              <div className={`relative opacity-40 transition-all duration-700 ease-in-out ${
                isTransitioning ? 'opacity-30 scale-95' : 'opacity-40 scale-90'
              }`}>
                <div className="relative overflow-hidden rounded-xl">
                  <ArticleCarouselCard
                    title={visible.next.title}
                    description={visible.next.description}
                    url={visible.next.url}
                    image={visible.next.image}
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-black/95 via-black/80 to-transparent backdrop-blur-md z-20 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {articles.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-1/2 -translate-x-28 lg:left-2 lg:translate-x-0 sm:left-4 md:-left-8 lg:-left-16 xl:-left-20 2xl:-left-24 -bottom-1 lg:top-1/2 lg:-translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-transparent border border-white hover:bg-white/10 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 z-50"
            aria-label="Artículo anterior"
          >
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white">←</span>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-1/2 translate-x-28 lg:right-2 lg:translate-x-0 sm:right-4 md:-right-8 lg:-right-16 xl:-right-20 2xl:-right-24 -bottom-1 lg:top-1/2 lg:-translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-transparent border border-white hover:bg-white/10 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 z-50"
            aria-label="Artículo siguiente"
          >
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white">→</span>
          </button>

          <div className="flex justify-center items-center gap-2 mt-12 lg:mt-5 w-full">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300  ${
                  index === currentIndex
                    ? 'bg-white w-8 h-2 '
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                }`}
                aria-label={`Ir al artículo ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { ArticleCarousel };
export default ArticleCarousel;

