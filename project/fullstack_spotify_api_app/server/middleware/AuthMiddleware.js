import { User } from "../models/User.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
// Check if user has access to the route
export const userVerification = (req, res,next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false })
    }
    // Check if tokens match
    jwt.verify(token,
        process.env.TOKEN_KEY,
        async (err, data) => {
            if (err) {
                return res.json({ status: false })
            } else {
                const user = await User.findById(data.id);
                if (user) {
                    req.user = user;
                    next();
                    return res.json({
                        status: true,
                        user: user.username
                    })
                } else {
                    return res.json({ status: false });
                }
            }
        });
}