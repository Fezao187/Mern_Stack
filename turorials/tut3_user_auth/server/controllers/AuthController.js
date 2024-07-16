const User = require("../models/UserModels");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

// Signup function
module.exports.Signup = async (req, res, next) => {
    try {
        // Get all vars from req.body
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        // Check for existing user
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        // If there is no user, then create user
        const user = await User.create({ email, password, username, createdAt });
        // Generate token using ID
        const token = createSecretToken(user._id);
        // Send cookie with key of 'token' and value of token
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error);
    }
};

// Login function
module.exports.Login = async (req, res, next) => {
    try {
        // Get email and password from body
        const { email, password } = req.body;
        // Check if password and email are filled in
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }
        // Check if email exists in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }
        // CHeck id passwords are the same
        const auth = await bcrypt.compare(password, user.password)
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User logged in successfully", success: true });
        next()
    } catch (error) {
        console.error(error);
    }
}