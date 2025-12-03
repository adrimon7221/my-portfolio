import React from 'react';

interface DecorativeCircleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customSize?: { width: string; height: string };
  className?: string;
}

const SIZE_STYLES: Record<NonNullable<DecorativeCircleProps['size']>, { width: string; height: string }> = {
  sm: { width: '320px', height: '320px' },
  md: { width: '400px', height: '400px' },
  lg: { width: '600px', height: '600px' },
  xl: { width: '800px', height: '800px' },
} as const;

/**
 * DecorativeCircle Component
 * 
 * Displays a decorative circle with configurable size.
 * 
 * @param size - Size of the circle ('sm', 'md', 'lg', or 'xl')
 * @param className - Additional CSS classes
 */
const DecorativeCircle: React.FC<DecorativeCircleProps> = React.memo(({ 
  size = 'lg', 
  customSize,
  className = '' 
}) => {
  // Use customSize if provided, otherwise use predefined size
  const styles = customSize || (size ? SIZE_STYLES[size] : SIZE_STYLES.lg);

  if (!styles) {
    console.warn(`DecorativeCircle: Invalid size "${size}", using default "lg"`);
    return (
      <div 
        style={SIZE_STYLES.lg}
        className={`rounded-full border-2 border-white/20 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      style={styles}
      className={`rounded-full border-2 border-white/20 ${className}`}
      aria-hidden="true"
    />
  );
});

DecorativeCircle.displayName = 'DecorativeCircle';

export { DecorativeCircle };
export default DecorativeCircle;

