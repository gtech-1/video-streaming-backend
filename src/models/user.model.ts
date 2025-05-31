import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  photo: string;
  status: 'Active' | 'Inactive';
  userType: 'members' | 'admins';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    photo: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    userType: { type: String, enum: ['members', 'admins'], required: true }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
