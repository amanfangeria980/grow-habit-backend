import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/admin.route";
import whatsappRoutes from "./routes/whatsapp.route";
import { adminTwoPointerStatusAlertMorning } from "../cron-jobs/whatsapp-admin-alerts";
import { nanoid } from "nanoid";
import db from "../utils/firebase";
import userRouter from "./routes/user.route";

adminTwoPointerStatusAlertMorning.start();

console.log("Cron job for Two Pointer Status Alert Morning has been started.");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Root Route
app.get("/", (req: Request, res: Response) => {
    console.log("Log: Serve is hit");
    res.send("Welcome to the Grow Habit Backend!");
});

// Admin Routes
app.use("/admin", adminRoutes);

// Whatsapp Routes
app.use("/whatsapp", whatsappRoutes);

// User Routes
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
