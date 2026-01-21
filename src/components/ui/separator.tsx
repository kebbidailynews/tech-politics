// src/components/ui/separator.tsx
import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  return orientation === 'vertical' ? (
    <div className={`w-px h-full bg-gray-300 dark:bg-gray-700 ${className}`} />
  ) : (
    <div className={`h-px w-full bg-gray-300 dark:bg-gray-700 my-4 ${className}`} />
  );
};
