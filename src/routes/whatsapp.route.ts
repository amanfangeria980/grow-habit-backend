import express from "express";
import { sendTextMessage } from "../controllers/whatsapp.controller";

const router = express.Router();
router.post("/send-text-message", sendTextMessage);

export default router;
