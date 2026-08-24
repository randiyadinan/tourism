import React, { useState, useMemo } from 'react';
import { Search, Compass } from 'lucide-react';
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
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            Signature Experiences
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Unforgettable Sri Lankan Encounters
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Private 4x4 leopard game drives, tea sommelier masterclasses, Blue Whale catamarans, and Ayurvedic wellness rituals led by expert naturalists and local masters.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences (e.g. Safari, Whale, Train, Tea)..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs font-medium text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0D3B2E] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No Activities Found"
            description="We couldn't find any activities matching your search. Please try another keyword or category."
            actionText="Clear Filters"
            onAction={() => { setSearchQuery(''); setSelectedCategory('All'); }}
          />
        )}

      </div>
    </div>
  );
};
