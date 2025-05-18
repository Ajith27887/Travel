import jwt from "jsonwebtoken";
import User from "../model/user.js";

// Storage for blacklisted tokens (In production, use Redis instead)
const tokenBlacklist = new Set();

const authhandler = async(req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            res.status(401);
            throw new Error('Not authorized, no token');
        }

        const token = req.headers.authorization.split(" ")[1];

        // Check if token is blacklisted
        if (tokenBlacklist.has(token)) {
            res.status(401);
            throw new Error('Token has been invalidated');
        }

        const decoded = jwt.verify(token, process.env.JWT_SCERTE);
        req.user = await User.findById(decoded.id).select('-password');
        req.token = token; // Store token for logout
        
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized');
    }
}

// Export blacklist methods
export const invalidateToken = (token) => {
    tokenBlacklist.add(token);
}

export { authhandler as default, tokenBlacklist };