import React from 'react';

export type BadgeVariant = 
  | 'gold' 
  | 'emerald' 
  | 'blue' 
  | 'green' 
  | 'amber' 
  | 'red' 
  | 'stone';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'stone',
  size = 'md',
  className = ''
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    gold: 'bg-[#176B52]/15 text-[#176B52] border border-[#176B52]/40',
    emerald: 'bg-[#134E3F]/15 text-[#0B3D2E] border border-[#134E3F]/30',
    blue: 'bg-blue-50 text-blue-800 border border-blue-200',
    green: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    red: 'bg-rose-50 text-rose-800 border border-rose-200',
    stone: 'bg-stone-100 text-stone-700 border border-stone-200'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
