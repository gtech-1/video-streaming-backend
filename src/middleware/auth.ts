import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";
import authModel from "../models/authModel";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                userType: 'members' | 'admins';
            };
        }
    }
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
    }

    try {
        const decoded = verify(token, config.jwtSecret as string);
        req.user = decoded as { sub: string; userType: 'members' | 'admins' };
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
        return;
    }
};

export const requireAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // First authenticate the token
        authenticateToken(req, res, async () => {
            if (!req.user?.sub) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            // Verify user exists and is an admin
            const user = await authModel.findById(req.user.sub);
            if (!user || user.userType !== 'admins') {
                res.status(403).json({ error: "Access denied. Admin privileges required." });
                return;
            }

            next();
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}; 