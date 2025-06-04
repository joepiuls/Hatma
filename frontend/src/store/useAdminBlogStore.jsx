// store/useAdminBlogStore.jsx
import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";
import { useBlogStore } from "./useBlogStore";
import { faker } from '@faker-js/faker';

export const useAdminBlogStore = create((set, get) => ({
  blogs: useBlogStore.getState().blogs || [],

  createBlog: async (blog) => {
    try {
      const newBlog = { ...blog, _id: uuid() };
      await api.post("/blogs", newBlog);
      const updated = [...useBlogStore.getState().blogs, newBlog];
      useBlogStore.setState({ blogs: updated });
      toast.success("Blog created");
    } catch (err) {
      toast.error("Failed to create blog");
      console.error(err);
    }
  },

  updateBlog: async (id, updates) => {
    try {
      await api.put(`/blogs/${id}`, updates);
      const updated = useBlogStore.getState().blogs.map((b) =>
        b._id === id ? { ...b, ...updates } : b
      );
      useBlogStore.setState({ blogs: updated });
      toast.success("Blog updated");
    } catch (err) {
      toast.error("Failed to update blog");
      console.error(err);
    }
  },

  deleteBlog: async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      const updated = useBlogStore.getState().blogs.filter((b) => b._id !== id);
      useBlogStore.setState({ blogs: updated });
      toast.success("Blog deleted");
    } catch (err) {
      toast.error("Failed to delete blog");
      console.error(err);
    }
  },

  generateDummyBlogs: async () => {
    const dummy = Array.from({ length: 10 }).map(() => ({
      title: faker.lorem.sentence(6),
      heading: faker.lorem.words(3),
      content: faker.lorem.paragraphs(3),
      author: faker.name.fullName(),
      tags: Array.from({ length: 3 }, () => faker.lorem.word()),
      category: faker.helpers.arrayElement(['Tech', 'Design', 'Development', 'AI']),
      image: faker.image.urlPicsumPhotos(),
      createdAt: faker.date.recent().toISOString()
    }));

    try {
      await Promise.all(dummy.map(blog => api.post("/admin/blogs", blog)));
      set({ blogs: dummy });
      toast.success("Fake blogs added");
    } catch (err) {
      toast.error("Failed to add fake blogs");
      console.error(err);
    }
  }
}));
