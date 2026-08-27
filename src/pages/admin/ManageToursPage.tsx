import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { tourService } from '../../services/tourService';
import type { Tour } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { handleImageError } from '../../utils/imageFallback';

export const ManageToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadTours = async () => {
    setLoading(true);
    try {
      const serverTours = await adminService.fetchTours();
      setTours(serverTours);
    } catch {
      setTours(tourService.getAllTours());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const filtered = tours.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      tourService.togglePublished(id);
      await adminService.updateTour(id, { published: !currentPublished }).catch(() => {});
      setTours(tours.map(t => t.id === id ? { ...t, published: !currentPublished } : t));
      setStatusMsg({ type: 'success', text: `Tour visibility updated to ${!currentPublished ? 'Published' : 'Draft'}.` });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update visibility.' });
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      tourService.toggleFeatured(id);
      await adminService.updateTour(id, { featured: !currentFeatured }).catch(() => {});
      setTours(tours.map(t => t.id === id ? { ...t, featured: !currentFeatured } : t));
      setStatusMsg({ type: 'success', text: `Tour is now ${!currentFeatured ? 'Featured on Homepage' : 'Standard'}.` });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update featured state.' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete tour "${title}"?`)) {
      try {
        tourService.deleteTour(id);
        const res = await adminService.deleteTour(id).catch(() => ({ success: true, message: 'Deleted locally.' }));
        setTours(tours.filter(t => t.id !== id));
        setStatusMsg({ type: 'success', text: res.message || `Deleted "${title}".` });
        setTimeout(() => setStatusMsg(null), 3500);
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err.message || 'Failed to delete tour.' });
      }
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

        <div className="flex items-center gap-2">
          <button
            onClick={loadTours}
            disabled={loading}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/tours/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-[#39A982]" />
            <span>Add New Tour</span>
          </Link>
        </div>
      </div>

      {/* Status Alert */}
      {statusMsg && (
        <div className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold animate-scale-in ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tours by title or category..."
          className="w-full bg-transparent border-none text-xs text-[#062C22] focus:outline-none font-medium"
        />
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
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
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-12 h-12 rounded-xl object-cover"
                      onError={(e) => handleImageError(e, 'tour')}
                    />
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
                      onClick={() => handleToggleFeatured(tour.id, !!tour.featured)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tour.featured ? 'bg-[#176B52] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {tour.featured ? '★ Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePublished(tour.id, !!tour.published)}
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
                        onClick={() => handleDelete(tour.id, tour.title)}
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
