import React from 'react';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const DecorativeCircle: React.FC<Props> = ({ size = 'lg', className = '' }) => {
  const sizeStyles = {
    sm: { width: '320px', height: '320px' },
    md: { width: '400px', height: '400px' },
    lg: { width: '600px', height: '600px' },
    xl: { width: '800px', height: '800px' },
  };

  return (
    <div 
      style={sizeStyles[size]}
      className={`rounded-full border-2 border-white/20 ${className}`} 
    />
  );
};

export default DecorativeCircle;