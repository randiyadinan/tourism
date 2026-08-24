import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from "../services/wishlistService";
import type { WishlistItem } from '../services/wishlistService';

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  isInWishlist: (targetId: string) => boolean;
  toggleWishlist: (item: WishlistItem) => boolean;
  removeItem: (targetId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const refresh = () => {
    setItems(wishlistService.getWishlist());
  };

  useEffect(() => {
    refresh();
  }, []);

  const isInWishlist = (targetId: string) => {
    return items.some(i => i.targetId === targetId);
  };

  const toggleWishlist = (item: WishlistItem) => {
    const isAdded = wishlistService.toggleItem(item);
    refresh();
    return isAdded;
  };

  const removeItem = (targetId: string) => {
    wishlistService.removeItem(targetId);
    refresh();
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isInWishlist,
        toggleWishlist,
        removeItem
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
