// store/useAdminProductStore.jsx
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";
import { useProductStore } from "./useProductStore";


export const useAdminProductStore = create((set, get) => ({
  loading: false,

  createProduct: async (product) => {
    try {
      set({ loading: true });

      const formData = new FormData();

      // Append regular fields
      for (const key in product) {
        if (key === "variants" && typeof product[key] !== "string") {
          formData.append(key, JSON.stringify(product[key]));
        } else if (key !== "images") {
          formData.append(key, product[key]);
        }
      }

      // Append images
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          formData.append("images", image);
        }
      }

      const response = await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newProduct = response.data;
      const updated = [...useProductStore.getState().products, newProduct];
      useProductStore.setState({ products: updated });

      toast.success("Product created");
    } catch (err) {
      toast.error("Failed to create product");
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ loading: true });
      await api.put(`/admin/products/${id}`, updates);
      const updated = useProductStore.getState().products.map((product) =>
        product._id === id ? { ...product, ...updates } : product
      );
      useProductStore.setState({ products: updated });
      toast.success("Product updated");
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      await api.delete(`/admin/products/${id}`);
      const updated = useProductStore.getState().products.filter((product) => product._id !== id);
      useProductStore.setState({ products: updated });
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
