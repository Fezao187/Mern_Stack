import { Router } from "express";
import { CreateAlbums, Login, Signup } from "../controllers/AuthController.js";

const router = Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/favorites", CreateAlbums);

export default router;