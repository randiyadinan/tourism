import React from 'react';
import { Compass, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Compass,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-stone-200 shadow-sm ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#062C22]/5 border border-[#176B52]/30 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#0B3D2E]" />
      </div>
      <h3 className="font-serif text-xl font-bold text-[#062C22] mb-2">{title}</h3>
      <p className="text-sm text-stone-500 max-w-md mb-6">{description}</p>
      
      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-sm font-semibold rounded-xl transition-all shadow-md"
        >
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-sm font-semibold rounded-xl transition-all shadow-md"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
