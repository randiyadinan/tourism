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
    <div className="bg-[#FAF8F2] min-h-screen py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-semibold text-[#1F6F54] uppercase tracking-wider">
            Curated Experiences
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A]">
            Sri Lanka Activities & Encounters
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            From 4x4 leopard game drives and whale-watching expeditions to tea estate tastings and traditional cooking classes.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences (e.g. Safari, Cooking)..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF8F2] border border-stone-300 rounded-lg text-xs sm:text-sm font-medium text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#12372A] text-white shadow-xs'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
