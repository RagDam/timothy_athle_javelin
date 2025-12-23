'use client';

import { type FC, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-slate-800/50 border-slate-700/50',
  elevated: 'bg-slate-800 shadow-xl shadow-black/20',
  bordered: 'bg-transparent border-2 border-slate-700',
  glass: 'bg-slate-800/30 backdrop-blur-md border-slate-700/30',
};

interface CardProps {
  children: ReactNode;
  variant?: keyof typeof variants;
  hover?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border',
        variants[variant],
        paddings[padding],
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30',
        className
      )}
    >
      {children}
    </div>
  );
};

// Sous-composants pour une meilleure composition
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-xl font-semibold text-white', className)}>{children}</h3>
);

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const CardDescription: FC<CardDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-slate-400 mt-1', className)}>{children}</p>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('mt-4 pt-4 border-t border-slate-700/50', className)}>{children}</div>
);
