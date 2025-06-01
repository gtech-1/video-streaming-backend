import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
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
        req.user = decoded as { sub: string };
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
        return;
    }
}; 