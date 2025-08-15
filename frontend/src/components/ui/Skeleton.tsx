import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div 
      className={cn("animate-pulse bg-gray-300 rounded-md", className)} 
      {...props}
    />
  );
};

export { Skeleton };