import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createAlbum } from "../controllers/album.controller.js";

const router = express.Router();
router.post("/create", verifyToken, createAlbum);

export default router;