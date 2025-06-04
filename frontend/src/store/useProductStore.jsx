// store/useProductStore.jsx
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";

export const useProductStore = create((set, get) => ({
  products: [],
  searchResults: [],

  searchProducts: (query) => {
    const lowerQuery = query.toLowerCase();
    const results = get().products.filter((product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery)
    );
    set({ searchResults: results });
  },

  clearSearch: () => set({ searchResults: [] }),

  getProductById: (id) => get().products.find((p) => p._id === id),

  loadProducts: async () => {
    try {
      const res = await api.get("user/products");
      set({ products: res.data });
    } catch (err) {
      toast.error("Failed to load products");
      console.error(err);
    }
  },
}));
