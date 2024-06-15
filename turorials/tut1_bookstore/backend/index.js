import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModels.js";
import booksRoute from "./routes/booksRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(234).send("Hello World");
});

app.use("/books", booksRoute);

app.use(
    cors({
        origin: "http://localhost:3000",
        method: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
    })
);

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connected to database");
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });