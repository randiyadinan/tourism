import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { activityService } from '../../services/activityService';
import type { Activity, ActivityCategory } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManageActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(() => activityService.getAllActivities());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Activity form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Wildlife');
  const [destination, setDestination] = useState('Yala National Park');
  const [duration, setDuration] = useState('3 - 4 Hours');
  const [pricePerPerson, setPricePerPerson] = useState(65);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Strenuous'>('Easy');
  const [image, ] = useState('https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80');
  const [shortDescription, setShortDescription] = useState('');

  const filtered = activities.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.destination.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this activity?')) {
      activityService.deleteActivity(id);
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct = activityService.createActivity({
      title,
      category,
      destination,
      duration,
      pricePerPerson: Number(pricePerPerson),
      difficulty,
      image,
      shortDescription,
      description: shortDescription,
      highlights: ['Expert local instruction', 'All equipment provided'],
      included: ['Guide fees', 'Bottled water'],
      whatToBring: ['Sun protection', 'Camera'],
      meetingPoint: `${destination} Activity Base`,
      featured: false
    });

    setActivities([...activities, newAct]);
    setIsModalOpen(false);
    setTitle('');
    setShortDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Manage Experiences & Activities</h1>
          <p className="text-xs text-stone-500">Configure signature wildlife safaris, water sports, and wellness packages.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#E5C378]" />
          <span>Add New Activity</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter activities by name or destination..."
          className="w-full bg-transparent border-none text-xs text-[#082F24] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Activity Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Price / Person</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((act) => (
                <tr key={act.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={act.image} alt={act.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#082F24] line-clamp-1">{act.title}</h4>
                      <p className="text-[10px] text-stone-400">{act.meetingPoint}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#8C6D2B]">{act.category}</td>
                  <td className="py-4 px-4">{act.destination}</td>
                  <td className="py-4 px-4">{act.duration}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 font-medium">
                      {act.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#082F24]">${act.pricePerPerson}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(act.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                      title="Delete Activity"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Activity / Experience"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ella Mountain Bike Trail"
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              >
                <option value="Wildlife">Wildlife</option>
                <option value="Culture & Heritage">Culture & Heritage</option>
                <option value="Scenic & Leisure">Scenic & Leisure</option>
                <option value="Water Sports">Water Sports</option>
                <option value="Culinary">Culinary</option>
                <option value="Trekking">Trekking</option>
                <option value="Wellness">Wellness</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Ella"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Hours"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Price / Pax ($)</label>
              <input
                type="number"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Strenuous">Strenuous</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Description</label>
            <textarea
              rows={3}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Detailed activity description..."
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0D3B2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-colors"
          >
            Save Activity to Catalog
          </button>
        </form>
      </Modal>
    </div>
  );
};
