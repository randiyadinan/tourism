import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
   
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
   
  Eye } from 'lucide-react';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../types';
import { formatPrice } from '../../utils/formatters';

export const ManageToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>(() => tourService.getAllTours());
  const [search, setSearch] = useState('');

  const filtered = tours.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublished = (id: string) => {
    const updated = tourService.togglePublished(id);
    setTours(tours.map(t => t.id === id ? updated : t));
  };

  const handleToggleFeatured = (id: string) => {
    const updated = tourService.toggleFeatured(id);
    setTours(tours.map(t => t.id === id ? updated : t));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      tourService.deleteTour(id);
      setTours(tours.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Manage Tours & Catalog</h1>
          <p className="text-xs text-stone-500">Create, edit, publish, or feature signature Sri Lankan itineraries.</p>
        </div>

        <Link
          to="/admin/tours/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#39A982]" />
          <span>Add New Tour</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tours by title or category..."
          className="w-full bg-transparent border-none text-xs text-[#062C22] focus:outline-none"
        />
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Tour Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((tour) => (
                <tr key={tour.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={tour.heroImage} alt={tour.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#062C22] line-clamp-1">{tour.title}</h4>
                      <p className="text-[10px] text-stone-400">{tour.destinations.join(' • ')}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#176B52]">{tour.category}</td>
                  <td className="py-4 px-4">{tour.durationDays} Days / {tour.durationNights} Nights</td>
                  <td className="py-4 px-4 font-bold text-[#062C22]">{formatPrice(tour.pricePerPerson)}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleFeatured(tour.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tour.featured ? 'bg-[#176B52] text-[#062C22]' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {tour.featured ? '★ Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePublished(tour.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tour.published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {tour.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/tours/${tour.slug}`}
                        className="p-1.5 text-stone-400 hover:text-[#0B3D2E]"
                        title="View public page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/tours/${tour.id}/edit`}
                        className="p-1.5 text-stone-400 hover:text-[#0B3D2E]"
                        title="Edit Tour"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                        title="Delete Tour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
