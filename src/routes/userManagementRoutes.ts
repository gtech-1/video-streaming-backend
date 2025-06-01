import express, { RequestHandler } from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userManagementController";

const router = express.Router();

// Get all users
router.get("/", getAllUsers as RequestHandler);

// Create new user
router.post("/", createUser as RequestHandler);

// Update user
router.put("/:userId", updateUser as RequestHandler);

// Delete user
router.delete("/:userId", deleteUser as RequestHandler);

export default router; 