import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

config();
const app = express();
const { MONGO_URL, PORT } = process.env;

// Connect to atlas
mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => console.log(err))

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

// Use cors to allow our frontend to access server
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());