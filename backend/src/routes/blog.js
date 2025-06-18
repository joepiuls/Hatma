import express from 'express';
import Blog from '../models/Blog.js';
const router = express.Router();
import AnalyticsEvents from '../models/AnalyticsEvents.js';

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('author', 'name')
      .sort({ createdAt: -1 }); // Optional: sort by newest first


    const formattedBlogs = blogs.map(blog => ({
      _id: blog._id,
      title: blog.title,
      category: blog.category,
      duration: blog.duration,
      industry: blog.industry,
      body: blog.body,
      featured: blog.featured,
      images: blog.images,
      views: blog.views,
      author: blog.author,
      createdAt: blog.createdAt.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
      updatedAt: blog.updatedAt.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    }));

    res.json(formattedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    let initials = '';
    if (blog.author?.name) {
      const nameParts = blog.author.name.trim().split(' ');
      if (nameParts.length >= 2) {
        initials = nameParts[0][0] + nameParts[1][0];
      } else {
        initials = nameParts[0].slice(0, 2);
      }
      initials = initials.toUpperCase();
    }

    const formattedBlog = {
      _id: blog._id,
      title: blog.title,
      category: blog.category,
      duration: blog.duration,
      industry: blog.industry,
      body: blog.body,
      featured: blog.featured,
      images: blog.images,
      views: blog.views,
      author: blog.author,
      initials: initials,
       createdAt: blog.createdAt.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
      updatedAt: blog.updatedAt.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    };

    return res.json(formattedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog', error });
  }
});


router.patch('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    await AnalyticsEvents.create({
      type: 'page_visit',
      metadata: {
        page: `/blogs/${id}`,
        source: req.get('Referer') || 'direct',
      },
      timestamp: new Date()
    });

    res.status(200).json({ views: blog.views });
  } catch (error) {
    res.status(500).json({ message: 'Failed to track view', error });
  }
});


export default router;
