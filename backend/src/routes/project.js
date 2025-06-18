import express from 'express';
const router = express.Router();
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';


// Project routes
router.post('/', createProject);
router.get('/',  getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);



export default router;