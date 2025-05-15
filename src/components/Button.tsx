
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  variant = 'default',
  size = 'default',
  className,
  children,
  type,
  ...props
}: ButtonProps) => {
  // Map custom variants to shadcn variants
  const mappedVariant = variant === 'primary' ? 'default' : variant === 'secondary' ? 'outline' : variant;
  
  return (
    <ShadcnButton
      type={type}
      variant={mappedVariant}
      size={size}
      className={cn(
        'font-medium transition-colors',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        // Ensure white buttons have black text in dark mode
        'dark:bg-white dark:text-black dark:hover:bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
