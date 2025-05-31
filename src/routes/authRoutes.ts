import express from "express";
import { registerUser } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

export default authRouter; 