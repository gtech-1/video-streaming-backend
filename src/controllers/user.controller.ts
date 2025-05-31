import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, photo, userType } = req.body;
    const user = new User({
      name,
      email,
      mobile,
      photo,
      userType
    });
    await user.save();
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}; 