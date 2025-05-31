import { Router, RequestHandler } from 'express';
import { createUser, loginUser } from './userController';

const router = Router();

router.post('/create', createUser as RequestHandler);
router.post('/login', loginUser as RequestHandler);

export default router; 