import { User } from "../models/User.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcrypt";

// Signup function
export const Signup = async (req, res, next) => {
    try {
        // Get all variables from the body
        const { name, email, username, password } = req.body;
        const checkEmail = await User.findOne({ email });
        const checkUsername = await User.findOne({ username });
        // Check if user exists by checking email and username
        if (checkEmail || checkUsername) {
            return res.json({ message: "User already exists" });
        }
        // If user does not exist, then create user
        const user = await User.create({ name, email, username, password });
        // Generate token using id
        const token = createSecretToken(user._id);
        // Send cookie with key of 'token' and value of token
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201)
            .json({ message: "User signed up successfully", success: true, user });
        next();
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res, next) => {
    try {
        // Get all variables from the body
        const { email, password } = req.body;
        // Check if email exists on DB
        if (!email || !password) {
            return res.json({ message: "All fields are required" })
        }
        // Check if email exists in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Incorrect password or email" })
        }
        // Check if req.body is the same password as the on in DB
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Password or email is incorrect" })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201)
            .json({
                message: "User logged in successfully",
                success: true
            });
        next();
    } catch (error) {
        console.error(error);
    }
}