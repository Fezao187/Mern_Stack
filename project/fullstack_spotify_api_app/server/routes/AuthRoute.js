import { Router } from "express";
import { CreateAlbums, getAlbums, Login, Signup } from "../controllers/AuthController.js";
import { userVerification } from "../middleware/AuthMiddleware.js";

const router = Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/favorites",
    userVerification,
    CreateAlbums
);
router.get("/", getAlbums);

export default router;