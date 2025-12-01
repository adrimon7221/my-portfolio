'use client'
import React, { useState, useEffect } from 'react';
import ArticleCarouselCard from './ArticleCarouselCard';

interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  gradientColors?: string[];
}

interface ArticleCarouselProps {
  articles: Article[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ArticleCarousel: React.FC<ArticleCarouselProps> = ({
  articles,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev + 1) % articles.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 600);
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles.length, autoPlayInterval, isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, 600);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, 600);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsAutoPlaying(true);
    }, 600);
  };

  if (articles.length === 0) return null;

  const getVisibleArticles = () => {
    const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
    const nextIndex = (currentIndex + 1) % articles.length;
    return {
      prev: articles[prevIndex],
      current: articles[currentIndex],
      next: articles[nextIndex],
    };
  };

  const visible = getVisibleArticles();

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
                    gradientColors={visible.prev.gradientColors}
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
                gradientColors={visible.current.gradientColors}
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
                    gradientColors={visible.next.gradientColors}
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
            className="absolute left-2 sm:left-4 md:-left-8 lg:-left-16 xl:-left-20 2xl:-left-24 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white hover:bg-gray-50 text-gray-900 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 z-50"
            aria-label="Artículo anterior"
          >
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold">←</span>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 md:-right-8 lg:-right-16 xl:-right-20 2xl:-right-24 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white hover:bg-gray-50 text-gray-900 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 z-50"
            aria-label="Artículo siguiente"
          >
            <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold">→</span>
          </button>

          <div className="flex justify-center items-center gap-2 mt-8">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-8 h-2'
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

export default ArticleCarousel;
