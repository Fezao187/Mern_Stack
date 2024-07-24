import { User } from "../models/User.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();
// Check if user has access to the route
export const userVerification = (req, res) => {
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
                    return res.json({
                        status: true,
                        user: user.username,
                        userId: user._id
                    })
                } else {
                    return res.json({ status: false });
                }
            }
        });
}

export const checkCurrentUser=(req,res,next)=>{
    let userInfo;
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
                   const userDetails={
                    userId:user._id,
                    username:user.username
                   }
                   return userDetails;
                } else {
                    return res.json({ status: false });
                }
            }
        });
}