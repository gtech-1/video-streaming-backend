import { Request, Response } from "express";
import authModel from "../models/authModel"; 
import mongoose from "mongoose";

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid user ID format" });
        return;
    }

    try {
        const user = await authModel.findById(id).select("-password"); 

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
