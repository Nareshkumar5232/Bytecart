import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadWishlist() {
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
    }
    loadWishlist();
  }, []);

  const addToWishlist = async (product) => {
    const updated = await wishlistService.addToWishlist(product);
    setWishlistItems(updated);
    addToast(`Saved "${product.name}" to your wishlist.`, 'success');
  };

  const removeFromWishlist = async (productId) => {
    const updated = await wishlistService.removeFromWishlist(productId);
    setWishlistItems(updated);
    addToast('Removed piece from wishlist.', 'info');
  };

  const toggleWishlist = async (product) => {
    const exists = wishlistItems.some((i) => i.id === product.id);
    if (exists) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((i) => i.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
