import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBlogStore } from '../store/useBlogStore';
import BlogHeader from './blog/BlogHeader';
import BlogContent from './blog/BlogContent';
import EmailSubscription from '../components/EmailSubscription';
import LoadingSpinner from '../components/LoadingSpinner'

const BlogPage = () => {
  const { id } = useParams();
  const { getBlogById, fetchBlogById } = useBlogStore();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const load = async () => {
      let found = getBlogById(id);
      if (!found) {
        const fetched = await fetchBlogById(id);
        setBlog(fetched);
        
      } else {
        setBlog(found);
      }
    };
    if (id) load();
  }, [id]);

  if (!blog) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-white">
      <BlogHeader blog={blog} />
      <BlogContent blog={blog} id={id} />
      <EmailSubscription />
    </div>
  );
};

export default BlogPage;
