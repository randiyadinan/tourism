import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { activityService } from '../../services/activityService';
import { ActivityCard } from '../../components/activities/ActivityCard';
import type { ActivityCategory } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';

export const ActivitiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');

  const activities = activityService.getAllActivities();

  const categories: (ActivityCategory | 'All')[] = [
    'All',
    'Wildlife',
    'Culture & Heritage',
    'Scenic & Leisure',
    'Water Sports',
    'Culinary',
    'Trekking',
    'Wellness'
  ];

  const filtered = useMemo(() => {
    return activities.filter(a => {
      const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activities, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F6F1E7] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0B7A75] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <span>CURATED ENCOUNTERS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
            Sri Lanka Experiences & Encounters
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            From private 4x4 leopard game drives in Yala and scenic blue train observation carriages to Ceylon tea sommelier tastings and whale watching in Mirissa.
          </p>
        </div>

        {/* Filter Bar in Liquid Glass */}
        <div className="bg-[#FCFEFD]/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences (e.g. Safari, Cooking, Whales)..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#F6F1E7] border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-[#173238] focus:outline-none focus:ring-2 focus:ring-[#0B7A75]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#075E63] text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No Activities Found"
            description="Try changing your search terms or select 'All' categories."
            actionText="View All Activities"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
