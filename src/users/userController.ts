import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const loginUser = async (req: Request, res: Response) => {
    try {
        // For now, just print user created
        console.log('User created');
        res.json({ message: 'User created' });
        //res.status(200).json({ message: 'User created' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, photo, status, userType } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !photo || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, photo, and userType'
      });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      mobile,
      photo,
      status: status || 'Active',
      userType
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 