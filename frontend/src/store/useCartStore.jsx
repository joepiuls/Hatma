// store/useCartStore.jsx
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";
import useAuthStore from "./useAuthStore";
import { useOrderStore } from "./useOrderStore";
import { trackError, trackPurchase } from "../utils/trackEvent";
import { useProductStore } from "./useProductStore";

const localStorageKey = "cart_items";
let syncTimeout = null;
let relatedProductsTimeout = null;

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(localStorageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(localStorageKey, JSON.stringify(cartItems));
  } catch {}
};

const debounceSync = () => {
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    const user = useAuthStore.getState().user;
    if (user && user._id) {
      useCartStore.getState().syncCartToServer();
    }
  }, 1000);
};

const debounceRelatedProducts = () => {
  clearTimeout(relatedProductsTimeout);
  relatedProductsTimeout = setTimeout(() => {
    useCartStore.getState().fetchRelatedProducts();
  }, 500);
};

export const useCartStore = create((set, get) => ({
  cartItems: loadCartFromStorage(),
  syncStatus: "idle", // idle | syncing | synced | failed
  relatedProducts: [], // Array of related products
  relatedProductsStatus: "idle", // idle | loading | loaded | error

  addToCart: (product) => {
    if (!product || !product._id || !product.name || typeof product.price !== "number") {
      toast.error("Invalid product cannot be added to cart");
      return;
    }

    const existing = get().cartItems.find((item) => item._id === product._id);
    let updated;

    if (existing) {
      updated = get().cartItems.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      toast.success("Increased product quantity");
    } else {
      updated = [...get().cartItems, { ...product, quantity: 1 }];
      toast.success("Added product to cart");
    }

    saveCartToStorage(updated);
    set({ cartItems: updated });
    debounceSync();
    debounceRelatedProducts(); // Fetch related products when cart changes
  },

  removeFromCart: (id) => {
    const updated = get().cartItems.filter((item) => item._id !== id);
    saveCartToStorage(updated);
    set({ cartItems: updated });
    toast.success("Removed item from cart");
    debounceSync();
    debounceRelatedProducts(); // Fetch related products when cart changes
  },

  incrementQuantity: (id) => {
    const updated = get().cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCartToStorage(updated);
    set({ cartItems: updated });
    toast.success("Increased quantity");
    debounceSync();
  },

  decrementQuantity: (id) => {
    const item = get().cartItems.find((item) => item._id === id);
    if (!item) return;
    let updated;
    if (item.quantity === 1) {
      updated = get().cartItems.filter((item) => item._id !== id);
      toast.success("Removed item from cart");
    } else {
      updated = get().cartItems.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      toast.success("Decreased quantity");
    }
    saveCartToStorage(updated);
    set({ cartItems: updated });
    debounceSync();
    debounceRelatedProducts(); // Fetch related products when cart changes
  },

  clearCart: () => {
    saveCartToStorage([]);
    set({ cartItems: [], relatedProducts: [] });
    toast.success("Cart cleared");
    debounceSync();
  },

  getCartTotal: () => {
    const items = get().cartItems;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + Math.floor(item.price || 0) * item.quantity, 0);
    return { totalQuantity, totalPrice };
  },

  syncCartToServer: async () => {
    const user = useAuthStore.getState().user;
    if (!user || !user._id) return;

    try {
      set({ syncStatus: "syncing" });

      // Filter only valid cart items
      const validItems = get().cartItems
        .filter(
          (item) =>
            item &&
            typeof item._id === "string" &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            item.quantity > 0
        )
        .map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || ""
        }));

      if (validItems.length === 0) {
        return;
      }

      await api.post("/user/cart", { cart: validItems });
      set({ syncStatus: "synced" });
    } catch (err) {
      set({ syncStatus: "failed" });
      toast.error("Failed to sync cart with server");
      trackError("Cart sync error", {
        action: "syncCartToServer",
        userId: user._id,
        additionalInfo: {
          error: err.message || "Unknown error"
        }
      });
      console.error("Cart sync error:", err);
    }
  },

  loadCartFromServer: async () => {
    const user = useAuthStore.getState().user;
    if (!user || !user._id) return;

    try {
      const res = await api.get("/user/cart");
      const items = res.data.cart || [];

      const prevItems = get().cartItems;
      const isDifferent = JSON.stringify(prevItems) !== JSON.stringify(items);

      saveCartToStorage(items);
      set({ cartItems: items });

      if (isDifferent && items.length > 0) {
        toast.success("Cart loaded from server");
      }
    } catch (err) {
      toast.error("Failed to load cart from server");
      trackError("Cart load error", {
        action: "loadCartFromServer",
        userId: user._id,
        additionalInfo: {
          error: err.message || "Unknown error"
        }
      });
      console.error(err);
    }
  },

  fetchRelatedProducts: async () => {
    const cartItems = get().cartItems;
    if (cartItems.length === 0) {
      set({ relatedProducts: [], relatedProductsStatus: "idle" });
      return;
    }

    try {
      set({ relatedProductsStatus: "loading" });
      
      // Get all categories from cart items
      const allCategories = cartItems.flatMap(item => 
        item.categories || item.category ? [item.category] : []
      );
      
      // Get all tags from cart items
      const allTags = cartItems.flatMap(item => item.tags || []);
      
      // Get product IDs already in cart to exclude
      const cartProductIds = cartItems.map(item => item._id);
      
      // Get products from product store
      const { products } = useProductStore.getState();
      
      // Find related products based on categories and tags
      const related = products.filter(product => {
        // Skip products already in cart
        if (cartProductIds.includes(product._id)) return false;
        
        // Check category match
        const categoryMatch = allCategories.includes(product.category);
        
        // Check tag match (at least one common tag)
        const tagMatch = product.tags && product.tags.some(tag => allTags.includes(tag));
        
        return categoryMatch || tagMatch;
      });
      
      // Limit to 6 related products
      set({ 
        relatedProducts: related.slice(0, 6),
        relatedProductsStatus: "loaded"
      });
    } catch (err) {
      console.error("Failed to fetch related products", err);
      set({ relatedProductsStatus: "error" });
    }
  },

  checkout: async ({ items, totalAmount, paymentMethod, transactionId, additionalInfo = "", address, phoneNumber }) => {
    const user = useAuthStore.getState().user;
    if (!user || !user._id) {
      toast.error("User not authenticated");
      return;
    }

    if (!items?.length || !totalAmount || !paymentMethod || !transactionId) {
      toast.error("Missing checkout data");
      return;
    }

    try {
      const res = await api.post("/user/checkout", {
        items,
        totalAmount,
        paymentMethod,
        transactionId,
        additionalInfo,
        address: address || user.address.find(a => a.isDefault) || {},
        phoneNumber: phoneNumber || user.phoneNumber,
      });

      toast.success('Payment successful');
      useCartStore.getState().clearCart();
      return res.data;
    } catch (err) {
      console.error("Checkout failed:", err);
      trackError("Checkout error", {
        action: "checkout",
        userId: user._id,
        additionalInfo: {
          error: err.message || "Unknown error",
          items,
          totalAmount,
          paymentMethod,
          transactionId
        }
      });
      toast.error("Checkout failed");
    }
  }

}));

// Initialize related products on store creation
const initializeRelatedProducts = () => {
  const cartItems = useCartStore.getState().cartItems;
  if (cartItems.length > 0) {
    setTimeout(() => {
      useCartStore.getState().fetchRelatedProducts();
    }, 1000);
  }
};

// Run initialization
initializeRelatedProducts();

// Sync cart before unload if user is authenticated
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    const user = useAuthStore.getState().user;
    if (user && user._id) {
      useCartStore.getState().syncCartToServer();
    }
  });
}