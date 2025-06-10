import express, { RequestHandler } from 'express';
import { getCourseVideos, createVideo, updateVideo, deleteVideo } from '../controllers/videoController';
import { upload } from '../config/cloudinary';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const videoRouter = express.Router();

// All routes require authentication
videoRouter.use(authenticateToken as RequestHandler);

// Get all videos for a specific course - accessible to both members and admins
videoRouter.get('/course/:courseId', getCourseVideos as RequestHandler);

// Admin only routes
// Create a new video
videoRouter.post('/course/:courseId', 
  requireAdmin as RequestHandler,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]), 
  createVideo as RequestHandler
);

// Update a video
videoRouter.put('/:id', 
  requireAdmin as RequestHandler,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]), 
  updateVideo as RequestHandler
);

// Delete a video
videoRouter.delete('/:id', 
  requireAdmin as RequestHandler,
  deleteVideo as RequestHandler
);

export default videoRouter; 