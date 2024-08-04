import { User } from "../models/User.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
// Check if user has access to the route
export const userVerification = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.TOKEN_KEY)
            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.log(error);
            res.status(401)
                .json({ message: "Not authorized" });
        }
    }
    if (!token) {
        return res.status(401)
            .json({ message: "Not authorized, Token not found" });
    }
}