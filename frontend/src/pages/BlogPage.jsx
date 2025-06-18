import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBlogStore } from '../store/useBlogStore';
import EmailSubscription from '../components/EmailSubscription';
import LoadingSpinner from '../components/LoadingSpinner';
import blog1 from '../assets/blog1.jpg';
import RelatedBlogs from '../components/RelatedBlogs';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const { id } = useParams();
  const {
    blog,
    fetchBlogById,
    loadRelatedBlogs,
    relatedBlogs,
    trackBlogView,
  } = useBlogStore();

  useEffect(() => {
    const load = async () => {
        const fetched = await fetchBlogById(id);
        useBlogStore.setState({ blog: fetched });
        if (fetched) {
          const related = await loadRelatedBlogs({ category: fetched.category, tags: fetched.tags, excludeId: fetched._id });
          useBlogStore.setState({ relatedBlogs: related });
          await trackBlogView(id);
        }

    };

    if (id) load();
  }, [id]);

  if (!blog) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white">
      {/* Blog Header */}
      <div className="bg-[#FFF5E1] py-10 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10 rounded-b-3xl">
        {/* Title and Author */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-[#101828] capitalize leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary flex items-center 
              justify-center text-white text-3xl font-semibold">
                {blog.initials}
              </div>
            <p className="text-lg font-medium text-black">
              {blog?.author?.name}
            </p>
          </div>
        </div>

        {/* Blog Main Image */}
        <div className="flex-1 h-[500px]">
          <img
            src={blog1}
            alt="Blog visual"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Blog Body & Sidebar */}
      <div className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-[#1D1D1D] bg-white">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6 rounded-lg p-10 text-justify border overflow-auto w-fit">
          <h1 className="text-3xl font-bold capitalize">{blog.title}</h1>
          <p className="leading-relaxed text-[17px] whitespace-pre-line">
            {blog.body}
          </p>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 rounded-lg p-10 text-justify border">
          {/* Author Info */}
          <div className="flex flex-col items-center text-center space-y-2">
           <div className="p-2 rounded-full bg-primary flex items-center 
              justify-center text-white text-3xl font-semibold">
                {blog.initials}
              </div>
            <p className="text-sm font-medium uppercase tracking-widest">
              {blog?.author?.name || 'amuda zuliat'}
            </p>
            <span className="text-gray-500 text-sm">Published on {blog?.createdAt}</span>
          </div>

          {/* Related Blogs */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Related Articles</h3>
            <div className="space-y-4">
              {relatedBlogs?.length > 0 ? (
                relatedBlogs.map((relatedBlog) => (
                  <Link to={`/blog/${relatedBlog._id}`} key={relatedBlog._id}>
                    <RelatedBlogs
                      blog={relatedBlog}
                      onClick={() => {
                        useBlogStore.setState({ blog: relatedBlog });
                      }}
                    />
                  </Link>
                ))
              ) : (
                <div>No related blogs</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <EmailSubscription />
    </div>
  );
};

export default BlogPage;
