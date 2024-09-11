import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './routes/AuthRoute.js';

config();
const app = express();
const { MONGO_URL, PORT } = process.env;

app.use(express.json());
// Use cors to allow our frontend to access server
app.use(cors({
    origin: "https://mern-stack-1-im19.onrender.com/",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

app.use(cookieParser());
app.use("/", authRoute);

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