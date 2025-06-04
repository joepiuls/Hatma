// store/useAdminProductStore.jsx
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";
import { useProductStore } from "./useProductStore";

export const useAdminProductStore = create(() => ({
  createProduct: async (product) => {
    try {
      const newProduct = { ...product };
      await api.post("/products", newProduct);
      const updated = [...useProductStore.getState().products, newProduct];
      useProductStore.setState({ products: updated });
      toast.success("Product created");
    } catch (err) {
      toast.error("Failed to create product");
      console.error(err);
    }
  },

  updateProduct: async (id, updates) => {
    try {
      await api.put(`/products/${id}`, updates);
      const updated = useProductStore.getState().products.map((product) =>
        product._id === id ? { ...product, ...updates } : product
      );
      useProductStore.setState({ products: updated });
      toast.success("Product updated");
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      const updated = useProductStore.getState().products.filter((product) => product._id !== id);
      useProductStore.setState({ products: updated });
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  },

  generateDummyProducts: async () => {
    const dummy = Array.from({ length: 10 }).map((_, i) => ({
      name: `Product ${i + 1}`,
      description: `This is a dummy product ${i + 1}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      stock: Math.floor(Math.random() * 20) + 1,
      category: i % 2 === 0 ? "Electronics" : "Books",
      tags: ["featured", `tag${i + 1}`],
      image: `https://picsum.photos/seed/product${i}/300/300`,
      isFeatured: i % 3 === 0
    }));
    try {
      await Promise.all(dummy.map(product => api.post("/admin/products", product)));
      useProductStore.setState({ products: dummy });
      toast.success("Dummy products added");
    } catch (err) {
      toast.error("Failed to add dummy products");
      console.error(err);
    }
  }
}));
