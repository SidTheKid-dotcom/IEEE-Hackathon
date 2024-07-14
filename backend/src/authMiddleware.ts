import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

interface AuthRequest extends Request {
    userID?: number;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({
            message: "Unauthorized. Please provide an authorization header"
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid authorization format. Please use Bearer token"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
        req.userID = decoded.userID;
        return next();
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export default authMiddleware;
