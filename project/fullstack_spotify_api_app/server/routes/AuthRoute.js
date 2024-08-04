import { Router } from "express";
import { CreateAlbums, deleteAlbum, editAlbum, getAlbums, getUserAlbums, Login, Signup } from "../controllers/AuthController.js";
import { userVerification } from "../middleware/AuthMiddleware.js";

const router = Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/favorites", userVerification, CreateAlbums);
router.get("/", getAlbums);
router.put("/:id", userVerification, editAlbum);
router.delete("/:id", userVerification, deleteAlbum);
router.get("/myAlbums", userVerification, getUserAlbums);

export default router;