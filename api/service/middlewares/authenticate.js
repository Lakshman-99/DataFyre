import { verifyToken } from "../utils/jwt-verify.js";

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header (Bearer token)

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = verifyToken(token); // Verify token using secret
        req.user = decoded; // Attach user info to the request object

        if(!decoded.is_verified) {
            return res.status(403).json({ message: "Email not verified" });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authenticate;
