import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { INITIAL_HOTELS } from '../../data/hotels';
import type { Hotel } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManageHotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>(INITIAL_HOTELS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('Sigiriya');
  const [starCategory, setStarCategory] = useState<3 | 4 | 5 | 'Boutique Luxury'>(5);
  const [pricePerNightUSD, setPricePerNightUSD] = useState(180);
  const [image, ] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.destination.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Remove hotel from partner catalog?')) {
      setHotels(hotels.filter(h => h.id !== id));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newH: Hotel = {
      id: `hotel-${Date.now()}`,
      name,
      destination,
      starCategory,
      pricePerNightUSD: Number(pricePerNightUSD),
      image,
      description,
      amenities: ['Pool', 'Spa', 'Restaurant', 'Wi-Fi'],
      rating: 4.9
    };
    setHotels([...hotels, newH]);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Manage Partner Hotels & Villas</h1>
          <p className="text-xs text-stone-500">Contracted luxury rates, boutique tea bungalows, and 5-star inventory.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#39A982]" />
          <span>Add Hotel Partner</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter hotels by name or region..."
          className="w-full bg-transparent border-none text-xs text-[#062C22] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Hotel Property</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Contract Rate</th>
                <th className="py-3.5 px-4">Key Amenities</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={h.image} alt={h.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#062C22]">{h.name}</h4>
                      <p className="text-[10px] text-stone-400">{h.rating} ★ Rating</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#176B52]">{h.destination}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F7F2] border border-stone-200 text-[#062C22]">
                      {h.starCategory === 'Boutique Luxury' ? 'Boutique' : `${h.starCategory} `}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#062C22]">${h.pricePerNightUSD} / night</td>
                  <td className="py-4 px-4 truncate max-w-[200px]">{h.amenities.join(', ')}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                      title="Remove Hotel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Partner Property"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Hotel Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ceylon Tea Trails"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Hatton"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Tier</label>
              <select
                value={starCategory}
                onChange={(e) => setStarCategory(e.target.value as any)}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              >
                <option value={3}>3 </option>
                <option value={4}>4 </option>
                <option value={5}>5 </option>
                <option value="Boutique Luxury">Boutique Luxury / Relais</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Contract Rate ($ USD/night)</label>
            <input
              type="number"
              required
              value={pricePerNightUSD}
              onChange={(e) => setPricePerNightUSD(Number(e.target.value))}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Hotel Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-colors"
          >
            Save Hotel Partner
          </button>
        </form>
      </Modal>
    </div>
  );
};
