export interface DestinationTicketRecord {
  id: string;
  name: string;
  subtitle: string;
  adultTicketPrice: number;
  childTicketPrice: number;
  image: string;
  region: string;
  active: boolean;
}

export const INITIAL_DESTINATION_TICKETS: DestinationTicketRecord[] = [
  {
    id: 'dest-sigiriya',
    name: 'Sigiriya',
    subtitle: 'Ancient Lion Rock Citadel & UNESCO Frescoes',
    adultTicketPrice: 11000,
    childTicketPrice: 5500,
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    region: 'Central Cultural Triangle',
    active: true
  },
  {
    id: 'dest-kandy',
    name: 'Kandy',
    subtitle: 'Sacred Temple of the Tooth & Botanical Gardens',
    adultTicketPrice: 6500,
    childTicketPrice: 3250,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    region: 'Central Highlands',
    active: true
  },
  {
    id: 'dest-ella',
    name: 'Ella',
    subtitle: 'Nine Arches Bridge & Little Adam’s Peak',
    adultTicketPrice: 6500,
    childTicketPrice: 3250,
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    region: 'Uva Mountain Range',
    active: true
  },
  {
    id: 'dest-nuwara-eliya',
    name: 'Nuwara Eliya',
    subtitle: 'Highland Tea Factory & Victoria Park',
    adultTicketPrice: 4800,
    childTicketPrice: 2400,
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    region: 'Highland Tea Valleys',
    active: true
  },
  {
    id: 'dest-galle',
    name: 'Galle',
    subtitle: 'UNESCO Dutch Fort Ramparts & Maritime Museum',
    adultTicketPrice: 3800,
    childTicketPrice: 1900,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    region: 'South Coast',
    active: true
  },
  {
    id: 'dest-yala',
    name: 'Yala',
    subtitle: 'National Park Wildlife Safari Entrance',
    adultTicketPrice: 14500,
    childTicketPrice: 7250,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    region: 'Southern Wildlife Reserve',
    active: true
  },
  {
    id: 'dest-colombo',
    name: 'Colombo',
    subtitle: 'National Museum, Lotus Tower & City Sights',
    adultTicketPrice: 3200,
    childTicketPrice: 1600,
    image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    region: 'Western Province Hub',
    active: true
  },
  {
    id: 'dest-mirissa',
    name: 'Mirissa',
    subtitle: 'Whale Watching & Marine Sanctuary',
    adultTicketPrice: 12500,
    childTicketPrice: 6250,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    region: 'Southern Beachline',
    active: true
  }
];

const DESTINATION_TICKETS_KEY = 'lv_destination_tickets_v2';

export const destinationTicketService = {
  getAllDestinations(): DestinationTicketRecord[] {
    const data = localStorage.getItem(DESTINATION_TICKETS_KEY);
    if (!data) {
      localStorage.setItem(DESTINATION_TICKETS_KEY, JSON.stringify(INITIAL_DESTINATION_TICKETS));
      return INITIAL_DESTINATION_TICKETS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DESTINATION_TICKETS;
    }
  },

  getActiveDestinations(): DestinationTicketRecord[] {
    return this.getAllDestinations().filter(d => d.active);
  },

  getDestinationById(id: string): DestinationTicketRecord | undefined {
    return this.getAllDestinations().find(d => d.id === id);
  },

  createDestination(dest: Omit<DestinationTicketRecord, 'id'>): DestinationTicketRecord {
    const list = this.getAllDestinations();
    const id = `dest-${dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const newRecord: DestinationTicketRecord = {
      ...dest,
      id
    };
    list.push(newRecord);
    localStorage.setItem(DESTINATION_TICKETS_KEY, JSON.stringify(list));
    return newRecord;
  },

  updateDestination(id: string, updates: Partial<DestinationTicketRecord>): DestinationTicketRecord {
    const list = this.getAllDestinations();
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) throw new Error(`Destination ${id} not found`);

    list[idx] = {
      ...list[idx],
      ...updates
    };

    localStorage.setItem(DESTINATION_TICKETS_KEY, JSON.stringify(list));
    return list[idx];
  },

  deleteDestination(id: string): void {
    const list = this.getAllDestinations().filter(d => d.id !== id);
    localStorage.setItem(DESTINATION_TICKETS_KEY, JSON.stringify(list));
  },

  toggleActive(id: string): DestinationTicketRecord {
    const item = this.getDestinationById(id);
    if (!item) throw new Error(`Destination ${id} not found`);
    return this.updateDestination(id, { active: !item.active });
  },

  calculateTicketsTotal(adultPrice: number, adultQty: number, childPrice: number, childQty: number): number {
    return (Math.max(0, adultPrice) * Math.max(0, adultQty)) + (Math.max(0, childPrice) * Math.max(0, childQty));
  }
};
