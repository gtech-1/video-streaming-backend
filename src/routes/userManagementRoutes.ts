import express, { RequestHandler } from "express";
import { getAllUsers, createUser, updateUser, deleteUser, exportUsers, importUsers, getMemberProfiles } from "../controllers/userManagementController";
import { requireAdmin, authenticateToken } from "../middleware/auth";

const router = express.Router();

// Get member profiles - accessible by both members and admins
router.get("/members", authenticateToken as RequestHandler, getMemberProfiles as RequestHandler);

// Admin only routes
router.use(requireAdmin as RequestHandler);

// Get all users (including admins)
router.get("/", getAllUsers as RequestHandler);

// Create new user
router.post("/", createUser as RequestHandler);

// Update user
router.put("/:userId", updateUser as RequestHandler);

// Delete user
router.delete("/:userId", deleteUser as RequestHandler);

// Export users
router.get("/export", exportUsers as RequestHandler);

// Import users
router.post("/import", importUsers as RequestHandler);

export default router; 