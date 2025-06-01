import { Request, Response, NextFunction } from "express";
import authModel from "../models/authModel";
import bcrypt from "bcrypt";

interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    photoUrl?: string;
    address?: string;
    phone?: string;
    dob?: string;
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
}

interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Get user profile
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.sub; // Assuming you have user info in request from auth middleware
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await authModel.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// Update user profile
export const updateProfile = async (
    req: Request<{}, {}, UpdateProfileRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const updateData = req.body;

        // If email is being updated, check if it's already in use
        if (updateData.email) {
            const existingUser = await authModel.findOne({ 
                email: updateData.email,
                _id: { $ne: userId }
            });
            if (existingUser) {
                res.status(400).json({ error: "Email already in use" });
                return;
            }
        }

        // Update user profile
        const updatedUser = await authModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// Update password
export const updatePassword = async (
    req: Request<{}, {}, UpdatePasswordRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            res.status(400).json({ error: "New passwords do not match" });
            return;
        }

        // Get user
        const user = await authModel.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Current password is incorrect" });
            return;
        }

        // Hash new password
        const hashSalt = 10;
        const hashedPassword = await bcrypt.hash(newPassword, hashSalt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
}; 