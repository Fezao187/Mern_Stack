import { Album } from "../models/Album.js";
import { User } from "../models/User.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcrypt";

// Signup function
export const Signup = async (req, res, next) => {
    try {
        // Get all variables from the body
        const { name, email, username, password } = req.body;
        // Check all fields
        if (!name || !email || !username || !password) {
            return res.json({ message: "All fields are required" })
        }
        // check if user exists
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
            .json({ message: "User signed up successfully", success: true, user, token });
        next();
    } catch (error) {
        console.log(error);
    }
}

// Login function
export const Login = async (req, res, next) => {
    try {
        // Get all variables from the body
        const { email, password } = req.body;
        // Check if all fields are sent
        if (!email || !password) {
            return res.json({ message: "All fields are required" })
        }
        // Check if email exists in DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Email is incorrect" })
        }
        // Check if req.body is the same password as the on in DB
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Password is incorrect" })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201)
            .json({
                message: "User logged in successfully",
                success: true,
                user,
                token
            });
        next();
    } catch (error) {
        console.error(error);
    }
}

// Create albums
export const CreateAlbums = async (req, res, next) => {
    try {
        // Check if all fields are sent
        if (!req.body.albumName || !req.body.imgUrl || !req.body.artistName || !req.body.releaseDate || !req.body.totalTracks) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        // Get user id from logged in user
        const user = req.user;
        // Create new object with filled in fields
        const newAlbum = {
            albumName: req.body.albumName,
            imgUrl: req.body.imgUrl,
            artistName: req.body.artistName,
            releaseDate: req.body.releaseDate,
            totalTracks: req.body.totalTracks,
            username: user.username,
            creator: user._id
        }

        // Save albums to DB
        const album = await Album.create(newAlbum);
        res.status(201)
            .json({ message: "Albums created successfully" })
        next();
    } catch (error) {
        console.log(error.message);
    }
}

// Get all albums
export const getAlbums = async (req, res, next) => {
    try {
        // Find all albums and users
        const albums = await Album.find({});
        res.status(201)
            .json({
                message: "All albums retrived",
                data: albums
            });
        next();
    } catch (error) {
        console.log(error.message);
    }
}

// Get user albums
export const getUserAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find({ creator: req.user.id });
        res.status(200)
            .json({
                message: "Retrieved all my albums",
                albums
            });
        next();
    } catch (error) {
        console.log(error);
    }
}

// Edit album
export const editAlbum = async (req, res, next) => {
    try {
        // Check if all fields are filled in
        if (!req.body.albumName || !req.body.imgUrl || !req.body.artistName || !req.body.releaseDate || !req.body.totalTracks) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        // Get album id from params
        const { id } = req.params;
        // Update album with ID and all fields from body
        const result = await Album.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(404).json({ message: "Album not found" });
        }
        next();
        return res.status(200).json({ message: "Album updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
}

// Delete album
export const deleteAlbum = async (req, res, next) => {
    try {
        // Get id from params
        const { id } = req.params;
        // Use ID to delete the album
        const result = await Album.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Album not found" });
        }
        next();
        return res.status(200).send({ message: "Album deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
}