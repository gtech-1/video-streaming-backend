import express, { RequestHandler } from 'express';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { upload } from '../config/cloudinary';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const courseRouter = express.Router();

// All routes require authentication
courseRouter.use(authenticateToken as RequestHandler);

// Get all courses - accessible to both members and admins
courseRouter.get('/', getAllCourses as RequestHandler);

// Admin only routes
// Create a new course
courseRouter.post('/', 
  requireAdmin as RequestHandler,
  upload.single('courseImage'), 
  createCourse as RequestHandler
);

// Update a course
courseRouter.put('/:id', 
  requireAdmin as RequestHandler,
  upload.single('courseImage'), 
  updateCourse as RequestHandler
);

// Delete a course
courseRouter.delete('/:id', 
  requireAdmin as RequestHandler,
  deleteCourse as RequestHandler
);

export default courseRouter; 