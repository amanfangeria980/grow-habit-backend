import express from "express";
import { sendTextMessage } from "../controllers/whatsapp.controller";

const whatsappRouter = express.Router();
whatsappRouter.post("/send-text-message", sendTextMessage);

export default whatsappRouter;
