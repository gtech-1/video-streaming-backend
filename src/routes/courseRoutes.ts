import express, { RequestHandler } from 'express';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { upload } from '../config/cloudinary';
import { authenticateToken } from '../middleware/auth';

const courseRouter = express.Router();

// All routes require authentication
courseRouter.use(authenticateToken as RequestHandler);

// Get all courses
courseRouter.get('/', getAllCourses as RequestHandler);

// Create a new course
courseRouter.post('/', upload.single('courseImage'), createCourse as RequestHandler);

// Update a course
courseRouter.put('/:id', upload.single('courseImage'), updateCourse as RequestHandler);

// Delete a course
courseRouter.delete('/:id', deleteCourse as RequestHandler);

export default courseRouter; 