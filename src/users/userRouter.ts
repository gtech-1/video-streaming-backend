import { Router, RequestHandler } from 'express';
import { createUser, loginUser } from './userController';
import {getUserById}  from '../controllers/getUserById'; 

const router = Router();

router.post('/create', createUser as RequestHandler);
router.post('/login', loginUser as RequestHandler);
router.get("/:id",getUserById as RequestHandler);

export default router; 