import express from "express";
import { getAgricultureVideos } from "../controllers/youtube.controller.js";

const router = express.Router();

router.get("/videos", getAgricultureVideos);

export default router;
