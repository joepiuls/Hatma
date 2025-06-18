import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";
import { useBlogStore } from "./useBlogStore";

export const useAdminBlogStore = create((set, get) => ({
  blogs: useBlogStore.getState().blogs || [],
  loading:false,

  createBlog: async (formData) => {
    try {
      set({ loading: true });

      const response = await api.post('/admin/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });

      toast.success('Blog created');
    } catch (error) {
      console.error('Create blog error:', error.response?.data || error.message);
        toast.error(error.message)
    } finally {
      set({ loading: false });
    }
  },

  updateBlog: async (id, blogData) => {
  set({ loading: true });
  try {
    const formData = new FormData();

    Object.entries(blogData).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((file) => formData.append('images', file));
      } else {
        formData.append(key, value);
      }
    });

    const { data: updatedBlog } = await api.put(`/admin/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const updated = useBlogStore.getState().blogs.map((b) =>
      b._id === id ? updatedBlog : b
    );
    useBlogStore.setState({ blogs: updated });
    toast.success('Blog updated');
  } catch (err) {
    toast.error('Failed to update blog');
    console.error(err);
  } finally {
    set({ loading: false });
  }
},


  deleteBlog: async (id) => {
    set({loading:true})
    try {
      await api.delete(`/admin/blogs/${id}`);
      const updated = useBlogStore.getState().blogs.filter((b) => b._id !== id);
      useBlogStore.setState({ blogs: updated });
      toast.success("Blog deleted");
      set({loading:false})
    } catch (err) {
      toast.error("Failed to delete blog");
      set({loading:false})
      console.error(err);
    }
  },
}));
