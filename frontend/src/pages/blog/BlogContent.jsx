import { useState, useEffect } from 'react';
import user2 from '../../assets/user2.jpg'
import RelatedBlogs from '../../components/RelatedBlogs';
import { useBlogStore } from '../../store/useBlogStore';


const BlogContent = (blog, id) => {

const [blogs, setBlog] = useState();
const { loadRelatedBlogs, relatedBlogs, getBlogById, fetchBlogById } = useBlogStore();

useEffect(() => {
  const load = async () => {
    let found = getBlogById(id);
    if (!found) {
      const fetched = await fetchBlogById(id);
      setBlog(fetched);
      if (fetched) loadRelatedBlogs({ category: fetched.category, tags: fetched.tags });
    } else {
      setBlog(found);
      loadRelatedBlogs({ category: found.category, tags: found.tags });
    }
  };
  if (id) load();
}, [id]);

 
  return (
    <div className="px-6 md:px-20 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-[#1D1D1D] bg-white">
      {/* === Left (Main Blog Content) === */}
      <div className="md:col-span-2 space-y-6 rounded-lg 
      p-10 text-justify border overflow-auto w-fit">
        <h1 className='text-3xl font-bold capitalize'>{blog?.blog?.title}</h1>
        <p className="leading-relaxed text-[17px]">
         {blog?.blog?.body}
        </p>
      </div>

      {/* === Right Sidebar === */}
      <aside className="space-y-6 rounded-lg p-10 text-justify border">
        {/* Author */}
        <div className="flex flex-col items-center text-center space-y-2">
          <img
            src={user2}
            alt="Author"
            className="w-20 h-20 rounded-full border-2 border-[#4FC3F7]"
          />
          <p className="text-sm font-medium uppercase tracking-widest">{blog?.blog?.author?.name}</p>
          <span className="text-gray-500 text-sm">Published on 18 June, 2024</span>
        </div>

        {/* Related Articles */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Related Articles</h3>

          <div className="space-y-4">
            
            {
              relatedBlogs.length>0 ? (
                <RelatedBlogs blogs={relatedBlogs} />
              ): (
                <div>
                  No related blogs
                </div>
              )
            }

          </div>
        </div>
      </aside>
    </div>
  );
};

export default BlogContent;
