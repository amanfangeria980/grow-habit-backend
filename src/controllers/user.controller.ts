import { nanoid } from "nanoid";
import db from "../../utils/firebase";
import { Request, Response } from "express";

// Create and store reflections in the database
export const createReflection = async (req: Request, res: Response) => {
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
                success: false,
                message: `There is already data present at ${testDay} for the user: ${name}`,
            });
        }
        const docRef = db.collection("reflections").doc(id);
        await docRef.set(reqData);
        console.log("New entry created with the id:", id);
        return res.json({
            message: "Reflection saved successfully.",
            success: true,
        });
    } catch (error: any) {
        console.error("Error in /reflect route:", error);
        return res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error.message,
        });
    }
};
