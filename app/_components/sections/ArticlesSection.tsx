/**
 * ArticlesSection Component
 * 
 * Main section displaying paginated articles with smooth transitions.
 * Features responsive design, pagination controls, and scroll-triggered animations.
 * 
 * Architecture:
 * - Separated data, constants, and hooks for maintainability
 * - Reusable components for header and pagination
 * - Custom hooks for mobile detection and pagination logic
 * - Type-safe with TypeScript interfaces
 */

'use client';
import React from 'react';
import { useInView } from '@/app/_hooks/useInView';
import { useMobile } from '@/app/_hooks/useMobile';
import { usePagination } from '@/app/_hooks/usePagination';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ARTICLES_CONFIG } from '@/app/_constants/articles';
import { ARTICLES } from '@/app/_data/articles';
import { ArticlesHeader, PaginationButtons } from '../ui/articles-section';
import ArticleCard from '../ui/ArticleCard';
import { Article } from '@/app/_types';

const ArticlesSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const isMobile = useMobile({ breakpoint: ARTICLES_CONFIG.PAGINATION.MOBILE_BREAKPOINT });

  const itemsPerPage = isMobile
    ? ARTICLES_CONFIG.PAGINATION.MOBILE_ITEMS_PER_PAGE
    : ARTICLES_CONFIG.PAGINATION.DESKTOP_ITEMS_PER_PAGE;

  const {
    currentPage,
    isTransitioning,
    displayedItems,
    totalPages,
    handlePageChange,
    goToNextPage,
  } = usePagination<Article>(ARTICLES, {
    itemsPerPage,
    transitionDuration: ARTICLES_CONFIG.ANIMATION.TRANSITION_DURATION,
    transitionResetDelay: ARTICLES_CONFIG.ANIMATION.TRANSITION_RESET_DELAY,
  });

  const titleDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY : 0;
  const baseArticleDelay = titleDelay + ARTICLES_CONFIG.ANIMATION.TITLE_DELAY_OFFSET;

  return (
    <section
      id="articles"
      ref={ref}
      className="relative text-white py-12 sm:py-16 md:py-20 pb-12 sm:pb-16 md:pb-20 px-2 sm:px-4 md:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10 rounded-3xl p-4 sm:p-6 md:p-8 w-full">
        <ArticlesHeader isInView={isInView} />

        <div className="flex flex-col md:flex-row gap-0 md:gap-6 lg:gap-8">
          <PaginationButtons
            currentPage={currentPage}
            totalPages={totalPages}
            isInView={isInView}
            onPageChange={handlePageChange}
            onNext={goToNextPage}
          />

          <div
            key={`page-${currentPage}`}
            className={`w-full md:w-[85%] grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 rounded-2xl p-2 sm:p-4 md:p-6 order-1 md:order-2 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          >
            {(displayedItems as Article[]).map((article, index) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                description={article.description}
                url={article.url}
                isInView={isInView && !isTransitioning}
                transitionDelay={baseArticleDelay + (index * ARTICLES_CONFIG.ANIMATION.ARTICLE_DELAY_INCREMENT)}
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
