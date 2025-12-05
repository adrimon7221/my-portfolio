'use client';
import React, { useState } from 'react';
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

  const articles: Article[] = [
    {
      id: 1,
      title: "The simplest is Kafka + golang",
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
  const articlesPerPage = 4;
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const displayedArticles = articles.slice(startIndex, endIndex);

  return (
    <section 
      id="articles" 
      ref={ref}
      className="relative text-white py-12 mt-10 sm:py-16 md:py-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10 bg-red-800 rounded-3xl p-6 sm:p-8">
        <div className="bg-blue-800 rounded-2xl p-4 sm:p-6">
          <h2
            className={`text-5xl sm:text-7xl md:text-8xl font-semibold text-right ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
            style={{ transitionDelay: `${titleDelay}ms` }}
          >
            Articles
          </h2>
          <div className="mt-4 border-t-2 border-white/20 w-full" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="bg-yellow-500 rounded-2xl p-4 sm:p-6 flex flex-col items-start justify-start gap-4 md:w-[15%] pt-6 sm:pt-8">
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 ${currentPage === 1 ? 'ring-2 ring-gray-400' : ''}`}
              aria-label="Página 1"
            >
              <span className="text-base md:text-xl font-semibold">1</span>
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 ${currentPage === 2 ? 'ring-2 ring-gray-400' : ''}`}
              aria-label="Página 2"
            >
              <span className="text-base md:text-xl font-semibold">2</span>
            </button>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 md:w-12 lg:w-12 md:h-12 flex items-center justify-center bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Siguiente"
            >
              <span className="text-base md:text-xl font-semibold">→</span>
            </a>
          </div>

          <div className="md:w-[85%] grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 bg-green-500 rounded-2xl p-4 sm:p-6">
            {displayedArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                description={article.description}
                url={article.url}
                isInView={isInView}
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