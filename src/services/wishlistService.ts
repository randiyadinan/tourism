export interface WishlistItem {
  id: string;
  type: 'tour' | 'destination' | 'activity';
  targetId: string;
  title: string;
  subtitle?: string;
  image: string;
  price?: number;
  duration?: string;
  location?: string;
  slug: string;
}

const WISHLIST_KEY = 'lv_wishlist';

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'wl-1',
    type: 'tour',
    targetId: 'tour-sri-lanka-highlights',
    title: 'Sri Lanka Grand Highlights & Heritage',
    subtitle: 'Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Galle',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
    price: 1290,
    duration: '10 Days',
    slug: 'sri-lanka-classic-highlights'
  },
  {
    id: 'wl-2',
    type: 'activity',
    targetId: 'act-yala-safari',
    title: 'Private Yala 4x4 Leopard Safari',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    price: 85,
    duration: '4 - 5 Hours',
    slug: 'yala-leopard-safari'
  },
  {
    id: 'wl-3',
    type: 'destination',
    targetId: 'dest-ella',
    title: 'Ella',
    subtitle: 'Misty Peaks, Tea Hills & The Nine Arches Bridge',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    price: 220,
    slug: 'ella'
  }
];

export const wishlistService = {
  getWishlist(): WishlistItem[] {
    const data = localStorage.getItem(WISHLIST_KEY);
    if (!data) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(INITIAL_WISHLIST));
      return INITIAL_WISHLIST;
    }
    return JSON.parse(data);
  },

  addItem(item: WishlistItem): void {
    const list = this.getWishlist();
    if (!list.some(i => i.targetId === item.targetId)) {
      list.unshift(item);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    }
  },

  removeItem(targetId: string): void {
    const list = this.getWishlist().filter(i => i.targetId !== targetId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  },

  toggleItem(item: WishlistItem): boolean {
    if (this.isInWishlist(item.targetId)) {
      this.removeItem(item.targetId);
      return false;
    } else {
      this.addItem(item);
      return true;
    }
  },

  isInWishlist(targetId: string): boolean {
    return this.getWishlist().some(i => i.targetId === targetId);
  }
};
