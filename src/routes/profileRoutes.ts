import express, { RequestHandler } from "express";
import { getProfile, updateProfile, updatePassword } from "../controllers/profileController";
import { authenticateToken } from "../middleware/auth";

const profileRouter = express.Router();

// All profile routes require authentication
profileRouter.use(authenticateToken as RequestHandler);

// Get user profile
profileRouter.get("/", getProfile as RequestHandler);

// Update user profile
profileRouter.put("/", updateProfile as RequestHandler);

// Update password
profileRouter.put("/password", updatePassword as RequestHandler);

export default profileRouter; 