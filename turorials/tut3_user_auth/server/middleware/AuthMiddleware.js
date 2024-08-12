const User = require("../models/UserModels");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Check if the user has access to the route
module.exports.userVerification = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.TOKEN_KEY)
            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");
            res.status(200)
                .json({ message: "Authorized" })
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