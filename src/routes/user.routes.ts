import express, { Request, Response, Router, RequestHandler } from 'express';
import { User } from '../models/user.model';

interface UserParams {
  id: string;
}

interface UserBody {
  name?: string;
  email?: string;
  mobile?: string;
  photo?: string;
  status?: 'active' | 'inactive';
  userType?: 'user' | 'admin';
}

const router: Router = express.Router();

// List all users
const listUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, mobile, photo, status, userType } = req.body;
    const user = new User({
      name,
      email,
      mobile,
      photo: photo || 'https://via.placeholder.com/150',
      status: status || 'active',
      userType
    });
    const savedUser = await user.save();
    res.status(201).json({ data: savedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Update a user
const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ data: user });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Register routes
router.get('/', listUsers);
router.post('/create', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 