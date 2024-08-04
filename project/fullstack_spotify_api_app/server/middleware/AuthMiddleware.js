import { User } from "../models/User.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
// Check if user has access to the route
export const userVerification = async (req, res, next) => {
    // const token = req.cookies.token;
    // if (!token) {
    //     return res.json({
    //         status: false,
    //         message: "Token not found"
    //     });
    // }
    // // Check if tokens match
    // jwt.verify(token,
    //     process.env.TOKEN_KEY,
    //     async (err, data) => {
    //         if (err) {
    //             return res.json({
    //                 status: false,
    //                 message: err
    //             });
    //         } else {
    //             const user = await User.findById(data.id);
    //             if (user) {
    //                 req.user = user;
    //                 next();
    //                 return res.json({
    //                     status: true,
    //                     user: user.username
    //                 })
    //             } else {
    //                 return res.json({
    //                     status: false,
    //                     message: "Tokens don't match"
    //                 });
    //             }
    //         }
    //     });
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