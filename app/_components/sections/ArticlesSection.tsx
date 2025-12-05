'use client';
import React, { useState, useEffect } from 'react';
import { useInView } from '@/app/_hooks/useInView';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import ArticleCard from '../ui/ArticleCard';

interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
}

const ArticlesSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const articles: Article[] = [
    {
      id: 1,
      title: "The simplest example is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://medium.com/@yourusername/article-1",
    },
    {
      id: 2,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://dev.to/yourusername/article-2",
    },
    {
      id: 3,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://hashnode.dev/@yourusername/article-3",
    },
    {
      id: 4,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://medium.com/@yourusername/article-4",
    },
    {
      id: 5,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://dev.to/yourusername/article-5",
    },
    {
      id: 6,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://hashnode.dev/@yourusername/article-6",
    },
    {
      id: 7,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://medium.com/@yourusername/article-7",
    },
    {
      id: 8,
      title: "the simplest is Kafka + golang",
      description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
      url: "https://dev.to/yourusername/article-8",
    },
  ];

  const titleDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY : 0;
  const baseArticleDelay = titleDelay + 200;

  // Filtrar artículos según la página actual
  const articlesPerPage = isMobile ? 3 : 4;
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const displayedArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 30);
    }, 150);
  };

  return (
    <section 
      id="articles" 
      ref={ref}
      className="relative text-white py-12 sm:py-16 md:py-20 pb-12 sm:pb-16 md:pb-20 px-2 sm:px-4 md:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10 rounded-3xl p-4 sm:p-6 md:p-8 w-full">
        <div className="rounded-2xl p-4 sm:p-6">
          <h2
            className={`text-5xl sm:text-7xl md:text-8xl font-semibold text-right ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
            style={{ transitionDelay: `${titleDelay}ms` }}
          >
            Articles
          </h2>
          <div 
            className={`mt-4 border-t-2 border-white/20 w-full transition-opacity duration-700 ease-out ${isInView ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${titleDelay + 200}ms` }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-0 md:gap-6 lg:gap-8">
          <div 
            className={`rounded-2xl p-4 sm:p-6 flex flex-row md:flex-col items-end md:items-start justify-end md:justify-start gap-4 md:w-[15%] pt-6 sm:pt-8 order-2 md:order-1 transition-opacity duration-700 ease-out ${isInView ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${titleDelay + 300}ms` }}
          >
            <button
              onClick={() => handlePageChange(1)}
              className={`w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 ${
                currentPage === 1 
                  ? 'bg-white text-gray-800' 
                  : 'bg-transparent border border-white text-white'
              }`}
              aria-label="Página 1"
            >
              <span className="text-base md:text-xl font-semibold">1</span>
            </button>
            <button
              onClick={() => handlePageChange(2)}
              className={`w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 ${
                currentPage === 2 
                  ? 'bg-white text-gray-800' 
                  : 'bg-transparent border border-white text-white'
              }`}
              aria-label="Página 2"
            >
              <span className="text-base md:text-xl font-semibold">2</span>
            </button>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center bg-transparent border border-white text-white rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Siguiente"
            >
              <span className="text-base md:text-xl font-semibold">→</span>
            </a>
          </div>

          <div 
            key={`page-${currentPage}`}
            className={`w-full md:w-[85%] grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 rounded-2xl p-2 sm:p-4 md:p-6 order-1 md:order-2 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          >
            {displayedArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                description={article.description}
                url={article.url}
                isInView={isInView && !isTransitioning}
                transitionDelay={baseArticleDelay + (index * 80)}
                animationDirection={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;