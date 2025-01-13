import { nanoid } from "nanoid";
import db from "../../utils/firebase";
import { Request, Response } from "express";

// Create and store reflections in the database
export const createReflection = async (req: Request, res: Response) => {
    const reqData = req.body;
    const id = nanoid();
    const docRef = db.collection("reflections").doc(id);
    console.log("This is value of data from frontend", reqData);
    try {
        await docRef.set(reqData);
        console.log("new entry created with the id ", id);
    } catch (error) {
        console.log("There is an error at port/reflect ", error);
    }
    res.json({
        message: "This all seems to work",
    });
};
