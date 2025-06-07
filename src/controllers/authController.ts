import { Request, Response, NextFunction } from "express";
import authModel from "../models/authModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

export const registerUser = async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        // Check if user already exists
        const existingUser = await authModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        // Hash password
        const hashSalt = 10;
        const hashedPassword = await bcrypt.hash(password, hashSalt);

        // Create new user with specific default values
        const newUser = await authModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            // Specific default values
            photoUrl: "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg",
            address: "Not provided",
            phone: "Not provided",
            dob: null,
            socialMedia: {
                facebook: "www.facebook.com",
                twitter: "www.twitter.com",
                linkedin: "www.linkedin.com",
                instagram: "www.instagram.com"
            },
            courses: [
                {
                    id: 1,
                    name: "Data Structures and Algorithms",
                    progress: 50
                },
                {
                    id: 2,
                    name: "Cloud Computing",
                    progress: 30
                },
                {
                    id: 3,
                    name: "Networking",
                    progress: 70
                }
            ],
            loginActivity: {
                firstLogin: new Date(),
                lastLogin: new Date()
            }
        });

        // Generate JWT token
        const accessToken = sign(
            { sub: newUser._id },
            config.jwtSecret as string,
            { expiresIn: '24h' }
        );

        // Return response
        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                photoUrl: newUser.photoUrl,
                address: newUser.address,
                phone: newUser.phone,
                dob: newUser.dob,
                userType: newUser.userType,
                socialMedia: newUser.socialMedia,
                courses: newUser.courses
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
};

export const loginUser = async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        // Find user by email
        const user = await authModel.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        // Update last login time
        user.loginActivity.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const accessToken = sign(
            { sub: user._id },
            config.jwtSecret as string,
            { expiresIn: '24h' }
        );

        // Return response
        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                photoUrl: user.photoUrl,
                address: user.address,
                phone: user.phone,
                dob: user.dob,
                userType: user.userType,
                socialMedia: user.socialMedia,
                courses: user.courses
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
}; 