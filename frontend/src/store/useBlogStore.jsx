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

  
      setBlog: (blogs) => set({ blogs }),

      // Fetch all blogs
      fetchBlogs: async () => {
        try {
          const res = await api.get("/blog");
          set({ blogs: res.data || [] });
        } catch (err) {
          console.error("Failed to fetch blogs:", err);
          toast.error("Failed to load blogs");
        }
      },

      // Fetch single blog by ID
      fetchBlogById: async (id) => {
        try {
          const res = await api.get(`/blog/${id}`);
          const blog = res.data;
          set((state) => ({
            blogs: state.blogs.some((b) => b._id === blog._id)
              ? state.blogs
              : [...state.blogs, blog],
          }));
          return blog;
        } catch (err) {
          toast.error("Failed to load blog");
          console.error(err);
          return null;
        }
      },

      // Get from cache
      getBlogById: (id) => get().blogs.find((b) => b._id?.toString() === id),

      // Load with pagination + filters
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

      // Local search
      searchBlogs: (query) => {
        const q = query.toLowerCase();
        const results = get().blogs.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.body?.toLowerCase().includes(q)
        );
        set({ searchResults: results });
      },

      // Clear search results
      clearSearch: () => set({ searchResults: [] }),

      // Load related blogs from API
      loadRelatedBlogs: ({ category, tags = [], excludeId }) => {
      const allBlogs = get().blogs || [];

      const related = allBlogs.filter((blog) => {
        if (blog._id === excludeId) return false; // Exclude current blog

        const matchesCategory = blog.category === category;

        const blogTags = blog.tags || [];
        const matchesTags = tags.some((tag) => blogTags.includes(tag));

        return matchesCategory || matchesTags;
      });

      set({ relatedBlogs: related });
    },

      // Update filters and reload
      updateFilters: (filters) => {
        set({ filters });
        get().loadBlogs(filters);
      },

      // Track blog visit (view + analytics)
      trackBlogView: async (id) => {
        try {
          const res = await api.patch(`/blog/${id}/view`);
          if (res.status === 200) {
            // Optional: update view count in local store
            set((state) => ({
              blogs: state.blogs.map((b) =>
                b._id === id ? { ...b, views: res.data.views } : b
              ),
            }));
          }
        } catch (err) {
          console.error("Failed to track blog view", err);
        }
      },
    }),
    {
      name: "blog-storage",
    }
  )
);
