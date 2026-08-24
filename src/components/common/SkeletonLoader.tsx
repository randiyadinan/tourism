import React from 'react';

export const TourCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm animate-pulse">
      <div className="h-56 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-1/3" />
        <div className="h-6 bg-stone-200 rounded w-4/5" />
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="h-6 bg-stone-200 rounded w-1/4" />
          <div className="h-8 bg-stone-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-stone-100">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-stone-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};
