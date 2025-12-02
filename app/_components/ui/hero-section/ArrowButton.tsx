import React from 'react';
import Link from 'next/link';

interface ArrowButtonProps {
  href: string;
  mounted: boolean;
  transitionDelay?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ARIA_LABELS = {
  GO_TO_PROJECTS: 'Ir a Projects',
} as const;

const sizeClasses: Record<NonNullable<ArrowButtonProps['size']>, string> = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl',
  lg: 'w-12 h-12 text-xl',
} as const;

export const ArrowButton: React.FC<ArrowButtonProps> = React.memo(({
  href,
  mounted,
  transitionDelay = 300,
  className = '',
  size = 'md',
}) => {
  if (!href) {
    console.error('ArrowButton: href es requerido');
    return null;
  }

  const validSize = size || 'md';
  const sizeClass = sizeClasses[validSize];

  return (
    <Link
      href={href}
      aria-label={ARIA_LABELS.GO_TO_PROJECTS}
      className={`arrow-btn ${sizeClass} flex items-center justify-center rounded-full bg-white text-black transform transition-transform duration-300 shadow-md ${
        mounted
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6 scale-95'
      } hover:-translate-y-1 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20 ${className}`}
      style={{ transitionDelay: mounted ? `${transitionDelay}ms` : '0ms' }}
    >
      <span className="sr-only">{ARIA_LABELS.GO_TO_PROJECTS}</span>
      <span className="pointer-events-none arrow">→</span>
    </Link>
  );
});

ArrowButton.displayName = 'ArrowButton';

