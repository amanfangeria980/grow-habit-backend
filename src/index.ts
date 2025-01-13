import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/admin.route";
import whatsappRoutes from "./routes/whatsapp.route";
import { adminTwoPointerStatusAlertMorning } from "../cron-jobs/whatsapp-admin-alerts";
import { nanoid } from "nanoid";
import db from "../utils/firebase";

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


app.post("/reflect", async (req: Request, res: Response) => {
    const reqData = req.body;
    const id = nanoid();
    const { testDay, name } = reqData;

    try {
        const existingData = await db
            .collection("reflections")
            .where("testDay", "==", testDay)
            .where("name", "==", name)
            .get();

        if (!existingData.empty) {
            return res.json({
                success : false,
                message: `There is already data present at ${testDay} for the user: ${name}`,
            });
        }

        const docRef = db.collection("reflections").doc(id);
        await docRef.set(reqData);
        console.log("New entry created with the id:", id);

        return res.json({
            message: "Reflection saved successfully.",
            success : true
        });
    } catch (error) {
        console.error("Error in /reflect route:", error);
        return res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



