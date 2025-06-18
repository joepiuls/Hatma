// store/useProductStore.jsx
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";

export const useProductStore = create((set, get) => ({
  products: [],
  searchResults: [],

  searchProducts: (query) => {
  if (typeof query !== "string") query = "";

  const lowerQuery = query.toLowerCase();

  const results = get().products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";

    return name.includes(lowerQuery) || description.includes(lowerQuery);
  });

  set({ searchResults: results });
},

  clearSearch: () => set({ searchResults: [] }),

  getProductById: (id) => get().products.find((p) => p._id === id),

  getProductsByCategory: (category, excludeId) =>
  get().products.filter(
    (p) => p.category === category && p.id !== excludeId
  ),


  loadProducts: async () => {
    try {
      const res = await api.get("/user/products");
      set({ products: res.data });
    } catch (err) {
      toast.error("Failed to load products");
      console.error(err);
    }
  },
}));
