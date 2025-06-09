import { Request, Response } from 'express';
import Video from '../models/video.model';
import Course from '../models/course.model';

// Get all videos for a specific course
export const getCourseVideos = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const videos = await Video.find({ courseId }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// Create a new video
export const createVideo = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { videoTitle } = req.body;
    const files = req.files as any;

    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    if (!files) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const videoUrl = files?.['video']?.[0]?.path;
    const thumbnailUrl = files?.['thumbnail']?.[0]?.path;

    console.log('Video URL:', videoUrl);
    console.log('Thumbnail URL:', thumbnailUrl);

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!videoTitle || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          videoTitle: !videoTitle,
          videoUrl: !videoUrl,
          thumbnailUrl: !thumbnailUrl
        }
      });
    }

    const newVideo = await Video.create({
      courseId,
      videoTitle,
      videoUrl,
      thumbnailUrl
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ 
      error: 'Failed to create video',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update a video
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { videoTitle } = req.body;
    const files = req.files as any;
    const videoUrl = files?.['video']?.[0]?.path;
    const thumbnailUrl = files?.['thumbnail']?.[0]?.path;

    const updateData: any = {};
    if (videoTitle) updateData.videoTitle = videoTitle;
    if (videoUrl) updateData.videoUrl = videoUrl;
    if (thumbnailUrl) updateData.thumbnailUrl = thumbnailUrl;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
};

// Delete a video
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
}; 