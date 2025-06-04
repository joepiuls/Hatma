import { Link } from 'react-router-dom';
import { useBlogStore } from '../store/useBlogStore';
import { useEffect, useState } from 'react';

export default function BlogSection() {
  const { blogs, fetchBlogs, searchBlogs, clearSearch, searchResults } = useBlogStore();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) searchBlogs(value);
    else clearSearch();
  };

  const filteredBlogs = (searchResults.length > 0 ? searchResults : blogs).filter(blog =>
    categoryFilter === 'All' || blog.category === categoryFilter
  );

  const recentBlog = blogs[0];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        {/* Featured Blog */}
        {recentBlog && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4 text-primary">Featured Blog</h2>
            <Link to={`/blog/${recentBlog._id}`} className="block group">
              <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={recentBlog.image}
                  alt={recentBlog.title}
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 rounded text-sm">
                  {recentBlog.category}
                </div>
              </div>
              <h3 className="text-2xl mt-4 font-bold text-gray-800">{recentBlog.title}</h3>
              <p className="text-gray-600 mt-2">{recentBlog.content?.slice(0, 120)}...</p>
            </Link>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-8">
          <input
            type="text"
            placeholder="Search blogs..."
            value={query}
            onChange={handleSearch}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-yellow-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:ring-yellow-500"
          >
            <option value="All">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
          </select>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link key={blog._id} to={`/blog/${blog._id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-500">{blog.category}</p>
                  <h3 className="text-lg font-bold text-gray-900">{blog.title}</h3>
                  <p className="text-gray-700 mt-1">{blog.content?.slice(0, 80)}...</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
