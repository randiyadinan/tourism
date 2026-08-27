import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Ticket, 
  Save, 
  CheckCircle2, 
  Edit3
} from 'lucide-react';
import { destinationTicketService, type DestinationTicketRecord } from '../../services/destinationTicketService';
import { adminService } from '../../services/adminService';
import { Modal } from '../../components/common/Modal';
import { formatPrice } from '../../utils/formatters';

export const ManageDestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<DestinationTicketRecord[]>(() => destinationTicketService.getAllDestinations());
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  
  // Modal state for creating/editing destination
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [region, setRegion] = useState('Central Cultural Triangle');
  const [adultTicketPrice, setAdultTicketPrice] = useState<number>(6500);
  const [childTicketPrice, setChildTicketPrice] = useState<number>(3250);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80');

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.region.toLowerCase().includes(search.toLowerCase()) ||
    d.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNewModal = () => {
    setEditingId(null);
    setName('');
    setSubtitle('');
    setRegion('Central Cultural Triangle');
    setAdultTicketPrice(6500);
    setChildTicketPrice(3250);
    setImage('https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dest: DestinationTicketRecord) => {
    setEditingId(dest.id);
    setName(dest.name);
    setSubtitle(dest.subtitle);
    setRegion(dest.region);
    setAdultTicketPrice(dest.adultTicketPrice);
    setChildTicketPrice(dest.childTicketPrice);
    setImage(dest.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, destName: string) => {
    if (confirm(`Are you sure you want to delete "${destName}" from destination catalog?`)) {
      destinationTicketService.deleteDestination(id);
      await adminService.deleteDestination(id).catch(() => {});
      setDestinations(destinationTicketService.getAllDestinations());
      setStatusMsg(`Deleted "${destName}".`);
      setTimeout(() => setStatusMsg(''), 3500);
    }
  };

  const handleToggleActive = async (id: string) => {
    const updated = destinationTicketService.toggleActive(id);
    await adminService.updateDestination(id, { active: updated.active } as any).catch(() => {});
    setDestinations(destinationTicketService.getAllDestinations());
    setStatusMsg(`Destination "${updated.name}" is now ${updated.active ? 'Active' : 'Inactive'}.`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  // Quick inline price update for table
  const handleQuickPriceChange = (id: string, field: 'adultTicketPrice' | 'childTicketPrice', val: number) => {
    setDestinations(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, [field]: Math.max(0, val) };
      }
      return d;
    }));
  };

  const handleSaveInlinePrices = async (dest: DestinationTicketRecord) => {
    destinationTicketService.updateDestination(dest.id, {
      adultTicketPrice: Number(dest.adultTicketPrice),
      childTicketPrice: Number(dest.childTicketPrice)
    });
    await adminService.updateDestination(dest.id, {
      adultTicketPrice: Number(dest.adultTicketPrice),
      childTicketPrice: Number(dest.childTicketPrice)
    } as any).catch(() => {});
    setStatusMsg(`Saved ticket rates for ${dest.name}: Adult ${formatPrice(dest.adultTicketPrice)}, Child ${formatPrice(dest.childTicketPrice)}.`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      destinationTicketService.updateDestination(editingId, {
        name,
        subtitle,
        region,
        adultTicketPrice: Math.max(0, Number(adultTicketPrice)),
        childTicketPrice: Math.max(0, Number(childTicketPrice)),
        image
      });
      await adminService.updateDestination(editingId, {
        name,
        subtitle,
        region,
        adultTicketPrice: Math.max(0, Number(adultTicketPrice)),
        childTicketPrice: Math.max(0, Number(childTicketPrice)),
        heroImage: image
      } as any).catch(() => {});
      setStatusMsg(`Updated "${name}" ticket rates.`);
    } else {
      destinationTicketService.createDestination({
        name,
        subtitle,
        region,
        adultTicketPrice: Math.max(0, Number(adultTicketPrice)),
        childTicketPrice: Math.max(0, Number(childTicketPrice)),
        image,
        active: true
      });
      await adminService.createDestination({
        name,
        subtitle,
        region,
        adultTicketPrice: Math.max(0, Number(adultTicketPrice)),
        childTicketPrice: Math.max(0, Number(childTicketPrice)),
        heroImage: image,
        active: true
      }).catch(() => {});
      setStatusMsg(`Added new destination "${name}".`);
    }

    setDestinations(destinationTicketService.getAllDestinations());
    setIsModalOpen(false);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Destinations & Ticket Rates</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage ticket admission rates in <strong>Sri Lankan Rupees (LKR)</strong> for iconic attractions across Sri Lanka.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-[#39A982]" />
          <span>Add Attraction Destination</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by destination name, region, or attraction..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-[#062C22] font-medium"
        />
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-6">Destination Attraction</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Adult Rate (LKR)</th>
                <th className="py-3 px-4">Child Rate (LKR)</th>
                <th className="py-3 px-4">Home Display</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((dest) => (
                <tr key={dest.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#062C22]">{dest.name}</h4>
                      <p className="text-[10px] text-stone-400 max-w-[220px] truncate">{dest.subtitle}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#176B52]">{dest.region}</td>
                  
                  {/* Editable Adult Ticket Rate */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-400 text-[11px]">LKR</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={dest.adultTicketPrice}
                        onChange={(e) => handleQuickPriceChange(dest.id, 'adultTicketPrice', Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-[#F8F7F2] border border-stone-300 rounded-lg font-bold text-xs text-[#0B3D2E] focus:ring-2 focus:ring-[#176B52]"
                      />
                    </div>
                  </td>

                  {/* Editable Child Ticket Rate */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-400 text-[11px]">LKR</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={dest.childTicketPrice}
                        onChange={(e) => handleQuickPriceChange(dest.id, 'childTicketPrice', Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-[#F8F7F2] border border-stone-300 rounded-lg font-bold text-xs text-[#0B3D2E] focus:ring-2 focus:ring-[#176B52]"
                      />
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(dest.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        dest.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {dest.active ? 'Active on Home' : 'Hidden'}
                    </button>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSaveInlinePrices(dest)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                        title="Save Prices"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(dest)}
                        className="p-1.5 text-stone-400 hover:text-[#0B3D2E]"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dest.id, dest.name)}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                        title="Delete Destination"
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

      {/* Add / Edit Destination Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Destination: ${name}` : 'Add New Sri Lankan Destination'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700">Destination Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anuradhapura"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Region Tag</label>
            <input
              type="text"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. North Central Ancient Kingdom"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Short Subtitle / Description</label>
            <input
              type="text"
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Ancient Sacred Bodhi Tree & Monasteries"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
            />
          </div>

          {/* Ticket Rates in LKR */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#DDEFE8]/50 rounded-2xl border border-stone-200">
            <div className="space-y-1">
              <label className="font-bold text-[#0B3D2E] flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-[#176B52]" />
                Adult Ticket (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={adultTicketPrice}
                onChange={(e) => setAdultTicketPrice(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-[#0B3D2E]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0B3D2E] flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-[#176B52]" />
                Child Ticket (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={childTicketPrice}
                onChange={(e) => setChildTicketPrice(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-[#0B3D2E]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Hero Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-[#062C22]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-colors"
          >
            {editingId ? 'Save Destination Changes' : 'Create Destination with Ticket Rates'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
