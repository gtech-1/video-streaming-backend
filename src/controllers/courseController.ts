import { Request, Response } from 'express';
import Course from '../models/course.model';

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { courseName } = req.body;
    const courseImage = req.file?.path;

    if (!courseName || !courseImage) {
      return res.status(400).json({ error: 'Course name and image are required' });
    }

    const newCourse = await Course.create({
      courseName,
      courseImage
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Update a course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { courseName } = req.body;
    const courseImage = req.file?.path;

    const updateData: any = {};
    if (courseName) updateData.courseName = courseName;
    if (courseImage) updateData.courseImage = courseImage;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}; 