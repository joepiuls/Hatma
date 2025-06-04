import blog1 from '../../assets/blog1.jpg'
import user2 from '../../assets/user2.jpg'
import { useBlogStore } from '../../store/useBlogStore';

const BlogHeader = (blog) => {
  
  
  
  return (
    <div className="bg-[#FFF5E1] py-10 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10 rounded-b-3xl">
      {/* Text */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-[#101828] capitalize leading-tight mb-6">
          {blog.blog.title}
        </h1>
        <div className="flex items-center gap-3">
          <img
            src={user2}
            alt="Author"
            className="w-12 h-12 rounded-full border-2 border-[#4FC3F7]"
          />
          <p className="text-lg font-medium text-black">By amuda zuliat</p>
        </div>
      </div>

      {/* Image */}
      <div className="flex-1 h-[500px]">
            <img
            src={blog1}
            alt="Blog visual"
            className="w-full h-full object-cover rounded-2xl"
            />
        </div>
    </div>
  );
};

export default BlogHeader;
