import React, { useState } from 'react';
import { 
   
  Plus, 
  Trash2, 
  Search } from 'lucide-react';
import { destinationService } from '../../services/destinationService';
import type { Destination } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManageDestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(() => destinationService.getAllDestinations());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New destination form state
  const [name, setName] = useState('');
  const [sinhalaName, setSinhalaName] = useState('');
  const [province, setProvince] = useState('Central Province');
  const [tagline, setTagline] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('November to April');
  const [recommendedDuration, ] = useState('2 - 3 Days');
  const [startingPrice, setStartingPrice] = useState(180);
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80');

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.province.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this destination?')) {
      destinationService.deleteDestination(id);
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  const handleCreateDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const newDest = destinationService.createDestination({
      name,
      sinhalaName,
      province,
      tagline,
      shortDescription,
      overview: shortDescription,
      heroImage,
      gallery: [heroImage],
      bestTimeToVisit,
      recommendedDuration,
      startingPrice: Number(startingPrice),
      popularActivities: ['Guided sightseeing', 'Local cuisine exploration'],
      attractions: [],
      coordinates: { lat: 7.0, lng: 80.5 },
      climate: { temperature: '26°C - 31°C', rainfall: 'Moderate' },
      featured: false
    });

    setDestinations([...destinations, newDest]);
    setIsModalOpen(false);
    setName('');
    setTagline('');
    setShortDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Manage Destinations</h1>
          <p className="text-xs text-stone-500">Manage Sri Lankan regional catalog, seasons, and highlights.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#39A982]" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter destinations by name or province..."
          className="w-full bg-transparent border-none text-xs text-[#062C22] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Destination</th>
                <th className="py-3.5 px-4">Province</th>
                <th className="py-3.5 px-4">Best Season</th>
                <th className="py-3.5 px-4">Suggested Duration</th>
                <th className="py-3.5 px-4">Starting Price</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((dest) => (
                <tr key={dest.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={dest.heroImage} alt={dest.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#062C22]">{dest.name}</h4>
                      <p className="text-[10px] text-stone-400">{dest.tagline}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#176B52]">{dest.province}</td>
                  <td className="py-4 px-4">{dest.bestTimeToVisit}</td>
                  <td className="py-4 px-4">{dest.recommendedDuration}</td>
                  <td className="py-4 px-4 font-bold text-[#062C22]">${dest.startingPrice}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                      title="Delete Destination"
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

      {/* Add Destination Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Sri Lankan Destination"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDestination} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Destination Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jaffna"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Sinhala / Tamil Name</label>
              <input
                type="text"
                value={sinhalaName}
                onChange={(e) => setSinhalaName(e.target.value)}
                placeholder="e.g. යාපනය"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              >
                <option value="Central Province">Central Province</option>
                <option value="Southern Province">Southern Province</option>
                <option value="Western Province">Western Province</option>
                <option value="Uva Province">Uva Province</option>
                <option value="Eastern Province">Eastern Province</option>
                <option value="Northern Province">Northern Province</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Historic Forts & Vibrant Culture"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Short Description</label>
            <textarea
              rows={3}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Overview of region..."
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Best Time to Visit</label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Starting Price ($ USD)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Hero Image URL</label>
            <input
              type="url"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-colors"
          >
            Save Destination to Database
          </button>
        </form>
      </Modal>
    </div>
  );
};
