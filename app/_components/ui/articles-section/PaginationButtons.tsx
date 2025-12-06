/**
 * PaginationButtons Component
 * 
 * Pagination controls for navigating between article pages.
 * Includes numbered buttons and a next button.
 */

'use client';
import React from 'react';
import { ARTICLES_CONTENT, ARTICLES_CONFIG } from '@/app/_constants/articles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  isInView: boolean;
  onPageChange: (page: number) => void;
  onNext?: () => void;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  currentPage,
  totalPages,
  isInView,
  onPageChange,
  onNext,
}) => {
  const titleDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY : 0;
  const buttonsDelay = titleDelay + ARTICLES_CONFIG.ANIMATION.BUTTONS_DELAY_OFFSET;

  const getButtonClassName = (page: number): string => {
    const baseClasses =
      'w-8 h-8 md:w-12 lg:w-12  md:h-12 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200';
    
    return currentPage === page
      ? `${baseClasses} bg-white text-gray-800`
      : `${baseClasses} bg-[#101011] border border-white text-white`;
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-6  flex flex-row md:flex-col items-end md:items-start justify-end md:justify-start gap-4 md:w-[15%] pt-6 sm:pt-8 order-2 md:order-1 transition-opacity duration-700 ease-out ${isInView ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDelay: `${buttonsDelay}ms` }}
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={getButtonClassName(page)}
          aria-label={`${ARTICLES_CONTENT.PAGINATION.PAGE_1_LABEL.replace('1', page.toString())}`}
        >
          <span className="text-base  md:text-xl font-semibold">{page}</span>
        </button>
      ))}

      {onNext && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="w-8 h-8  md:w-12 lg:w-12 md:h-12 flex items-center justify-center bg-transparent border border-white text-white rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label={ARTICLES_CONTENT.PAGINATION.NEXT_LABEL}
        >
          <span className="text-base md:text-xl font-semibold">→</span>
        </a>
      )}
    </div>
  );
};

