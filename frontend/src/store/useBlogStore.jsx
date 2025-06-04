// store/useBlogStore.jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { api } from "../axios";

export const useBlogStore = create(
  persist(
    (set, get) => ({
      blogs: [],
      searchResults: [],
      relatedBlogs: [],
      filters: { category: null, tags: [] },
      pagination: { page: 1, limit: 10, total: 0 },

      setBlog: (blog) => set({ blogs: blog }),

      fetchBlogs: async () => {
        try {
          const res = await api.get("/blog");
          set({ blogs: res.data || [] });
        } catch (err) {
          console.error("Failed to fetch blogs:", err);
          toast.error("Failed to load blogs");
        }
      },

      fetchBlogById: async (id) => {
        try {
          const res = await api.get(`/blog/${id}`);
          const blog = res.data;
          set({ blogs: [...get().blogs, blog] });
          return blog;
        } catch (err) {
          toast.error("Failed to load blog");
          console.error(err);
        }
      },

      getBlogById: (id) => get().blogs.find((b) => b._id?.toString() === id),

      loadBlogs: async (params = {}) => {
        try {
          const query = new URLSearchParams(params).toString();
          const res = await api.get(`/blogs${query ? `?${query}` : ""}`);
          set({
            blogs: res.data.blogs || res.data,
            pagination: res.data.pagination || {},
            filters: {
              category: params.category || null,
              tags: params.tags ? params.tags.split(",") : [],
            },
          });
        } catch (err) {
          toast.error("Failed to load blogs");
          console.error(err);
        }
      },

      searchBlogs: (query) => {
        const q = query.toLowerCase();
        const results = get().blogs.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.content?.toLowerCase().includes(q)
        );
        set({ searchResults: results });
      },


      loadRelatedBlogs: async ({ category, tags = [] }) => {
        try {
          const res = await api.get(`/blogs/related`, {
            params: { category, tags: tags.join(',') },
          });
          set({ relatedBlogs: res.data || [] });
        } catch (err) {
          console.error("Failed to load related blogs", err);
          toast.error("Could not load related blogs");
        }
      },


      clearSearch: () => set({ searchResults: [] }),

      updateFilters: (filters) => {
        set({ filters });
        get().loadBlogs(filters);
      },
    }),
    {
      name: "blog-storage", // localStorage key
    }
  )
);
