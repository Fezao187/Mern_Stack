import { Album } from "../models/Album.js";
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

// Login function
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

// Create albums
export const CreateAlbums = async (req, res, next) => {
    try {
        if (!req.body.albumName || !req.body.imgUrl || !req.body.artistName || !req.body.releaseDate || !req.body.totalTracks) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        const user = req.user;
        const newAlbum = {
            albumName: req.body.albumName,
            imgUrl: req.body.imgUrl,
            artistName: req.body.artistName,
            releaseDate: req.body.releaseDate,
            totalTracks: req.body.totalTracks,
            creator: user._id
        }

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
        const albums = await Album.find({});
        const users = await User.find({});
        if (users._id == albums.creator) {
            return res.status(201)
                .json({
                    message: "All albums retrived",
                    data: albums,
                    users
                });
        } else {
            res.status(500)
                .send({ message: "An error occured" })
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

// Edit album
export const editAlbum = async (req, res, next) => {
    try {
        if (!req.body.albumName || !req.body.imgUrl || !req.body.artistName || !req.body.releaseDate || !req.body.totalTracks) {
            return res.status(400).send({
                message: "Send all required fields"
            });
        }

        const { id } = req.params;
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