import express from 'express';
import Blog from '../models/Blog.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  return res.json(blog);

});

export default router;
