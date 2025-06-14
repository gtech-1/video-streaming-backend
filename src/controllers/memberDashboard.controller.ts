import { Request, Response } from 'express';
import { MemberDashboard } from '../models/memberDashboard.model';

// Get dashboard data for a member
export const getMemberDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub; // Using sub instead of _id
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const dashboard = await MemberDashboard.findOne({ userId });
    
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    console.error('Error fetching member dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create dashboard for a new member
export const createMemberDashboard = async (userId: string) => {
  try {
    const dashboard = new MemberDashboard({
      userId
    });
    
    await dashboard.save();
    return dashboard;
  } catch (error) {
    console.error('Error creating member dashboard:', error);
    throw error;
  }
};

// Update dashboard data
export const updateMemberDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub; // Using sub instead of _id
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updates = req.body;
    const dashboard = await MemberDashboard.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    console.error('Error updating member dashboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 