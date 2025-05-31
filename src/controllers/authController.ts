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

        // Create new user
        const newUser = await authModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
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
            accessToken
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