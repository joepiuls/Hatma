import { useEffect, useState } from "react";
import { useBlogStore } from "../../store/useBlogStore";
import { Link } from "react-router-dom";
import image from "../../assets/blog1.jpg";

const BlogSection = () => {
  const { blogs, fetchBlogs } = useBlogStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBlogs();
      setLoading(false);
    };
    load();
  }, []);

  const sortedBlogs = [...blogs]
    .filter(b => filter === "All" || b.category === filter)
    .sort((a, b) =>
      sortBy === "Newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const paginated = sortedBlogs.slice(0, page * postsPerPage);
  const latestPost = blogs[0];

  return (
    <section>
      {/* Featured Section */}
      <div className="bg-[#FFF5E1] py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-secondary font-bold">Latest Post</p>
            <h2 className="text-5xl font-bold text-primary w-[400px] leading-tight mt-2">
              The influence of marketing in Business
            </h2>
            <p className="text-gray-600 mt-4">
              Lorem ipsum dolor sit amet consectetur...
            </p>
            <Link to={`/blog/${latestPost?._id || ""}`}>
              <button className="mt-8 px-20 py-2 bg-primary text-white font-semibold rounded-lg">
                Read Article
              </button>
            </Link>
          </div>
          <div>
            <img
              src={latestPost?.image || image}
              className="rounded-lg w-[550px] h-[450px] object-cover shadow"
              alt="Featured Blog"
            />
          </div>
        </div>
      </div>

      {/* Blog Filters + List */}
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between mb-6">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="select select-bordered">
              <option value="All">All</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select select-bordered">
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>

          {/* Spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-4 border-dashed border-yellow-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginated.map((post) => (
                  <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                    <img src={post.image || image} className="rounded mb-4 h-48 w-full object-cover" alt={post.title} />
                    <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{post?.body?.slice(0, 100)}</p>
                    <Link to={`/blog/${post._id}`} className="text-yellow-600 mt-4 inline-block">Read More</Link>
                  </div>
                ))}
              </div>
              {hasMore && paginated.length < sortedBlogs.length && (
                <div className="text-center mt-8">
                  <button onClick={() => setPage(page + 1)} className="bg-primary text-white px-6 py-2 rounded">
                    See More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
