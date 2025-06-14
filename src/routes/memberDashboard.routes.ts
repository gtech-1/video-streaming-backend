import express, { RequestHandler } from 'express';
import { getMemberDashboard, updateMemberDashboard } from '../controllers/memberDashboard.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get member dashboard data
router.get('/', authenticateToken, getMemberDashboard as RequestHandler);

// Update member dashboard data
router.put('/', authenticateToken, updateMemberDashboard as RequestHandler);

export default router; 