import { Request, Response } from "express";
import authModel from "../models/authModel";
import bcrypt from "bcrypt";

// Get all users with selected fields
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await authModel.find().select('firstName lastName email phone photoUrl status userType createdAt updatedAt');
        
        // Transform the data to match the frontend requirements
        const transformedUsers = users.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.phone,
            photo: user.photoUrl,
            status: user.status || 'Active',
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json(transformedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phone, photoUrl, status, userType } = req.body;

        // Check if user already exists
        const existingUser = await authModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash default password
        const hashSalt = 10;
        const hashedPassword = await bcrypt.hash("Password123", hashSalt);

        // Create new user with default values
        const newUser = await authModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            photoUrl: photoUrl || "https://randomuser.me/api/portraits/men/33.jpg",
            status: status || 'Active',
            userType: userType || 'members',
            address: "Not provided",
            dob: null,
            socialMedia: {
                facebook: "",
                twitter: "",
                linkedin: "",
                instagram: ""
            },
            courses: [],
            loginActivity: {
                firstLogin: new Date(),
                lastLogin: new Date()
            }
        });

        // Transform the response
        const transformedUser = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            mobile: newUser.phone,
            photo: newUser.photoUrl,
            status: newUser.status,
            userType: newUser.userType,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        res.status(201).json(transformedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { firstName, lastName, email, phone, photoUrl, status, userType } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if email is being changed and if it's already in use
        if (email) {
            const existingUser = await authModel.findOne({ 
                email, 
                _id: { $ne: userId } 
            });
            if (existingUser) {
                return res.status(400).json({ error: "Email already in use" });
            }
        }

        // First find the user to ensure it exists
        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Then update the user
        const updatedUser = await authModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    photoUrl,
                    status,
                    userType
                }
            },
            { new: true }
        ).select('firstName lastName email phone photoUrl status userType createdAt updatedAt');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found after update" });
        }

        // Transform the response
        const transformedUser = {
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            mobile: updatedUser.phone,
            photo: updatedUser.photoUrl,
            status: updatedUser.status || 'Active',
            userType: updatedUser.userType,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        res.status(200).json(transformedUser);
    } catch (error: any) {
        console.error("Error updating user:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        res.status(500).json({ error: "Failed to update user" });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // First check if user exists
        const user = await authModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Then delete the user
        const deletedUser = await authModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found after delete attempt" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        res.status(500).json({ error: "Failed to delete user" });
    }
};

// Export users
export const exportUsers = async (req: Request, res: Response) => {
    try {
        const users = await authModel.find().select('firstName lastName email phone photoUrl status userType createdAt updatedAt');
        
        // Transform the data to match the frontend requirements
        const transformedUsers = users.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobile: user.phone,
            photo: user.photoUrl,
            status: user.status || 'Active',
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json(transformedUsers);
    } catch (error) {
        console.error("Error exporting users:", error);
        res.status(500).json({ error: "Failed to export users" });
    }
};

// Import users
export const importUsers = async (req: Request, res: Response) => {
    try {
        const users = req.body;

        if (!Array.isArray(users)) {
            return res.status(400).json({ error: "Invalid input format. Expected an array of users." });
        }

        const results = [];
        const errors = [];

        for (const userData of users) {
            try {
                const { firstName, lastName, email, mobile, userType } = userData;

                // Validate required fields
                if (!firstName || !lastName || !email || !userType) {
                    errors.push({
                        email: email || 'unknown',
                        error: "Missing required fields"
                    });
                    continue;
                }

                // Check if user already exists
                const existingUser = await authModel.findOne({ email });
                if (existingUser) {
                    errors.push({
                        email,
                        error: "User already exists"
                    });
                    continue;
                }

                // Hash default password
                const hashSalt = 10;
                const hashedPassword = await bcrypt.hash("Password123", hashSalt);

                // Create new user with default values
                const newUser = await authModel.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    phone: mobile || "Not provided",
                    photoUrl: "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg",
                    status: 'Active',
                    userType,
                    address: "Not provided",
                    dob: null,
                    socialMedia: {
                        facebook: "",
                        twitter: "",
                        linkedin: "",
                        instagram: ""
                    },
                    courses: [],
                    loginActivity: {
                        firstLogin: new Date(),
                        lastLogin: new Date()
                    }
                });

                results.push({
                    email: newUser.email,
                    status: "success"
                });
            } catch (error) {
                errors.push({
                    email: userData.email || 'unknown',
                    error: error instanceof Error ? error.message : "Unknown error"
                });
            }
        }

        res.status(200).json({
            message: "Import completed",
            results,
            errors
        });
    } catch (error) {
        console.error("Error importing users:", error);
        res.status(500).json({ error: "Failed to import users" });
    }
}; 