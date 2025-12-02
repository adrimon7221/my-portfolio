import React from 'react';

interface DecorativeCircleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const DecorativeCircle: React.FC<DecorativeCircleProps> = ({ size = 'lg', className = '' }) => {
  const sizeStyles: Record<NonNullable<DecorativeCircleProps['size']>, { width: string; height: string }> = {
    sm: { width: '320px', height: '320px' },
    md: { width: '400px', height: '400px' },
    lg: { width: '600px', height: '600px' },
    xl: { width: '800px', height: '800px' },
  };

  const validSize = size || 'lg';
  const styles = sizeStyles[validSize];

  return (
    <div 
      style={styles}
      className={`rounded-full border-2 border-white/20 ${className}`}
      aria-hidden="true"
    />
  );
};

export { DecorativeCircle };
export default DecorativeCircle;

