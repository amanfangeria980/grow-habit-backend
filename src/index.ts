import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "../utils/firebase";
import cors from "cors";
import { nanoid } from "nanoid";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Root Route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Grow Habit Backend!");
});

// Reflect Route - POST

app.post("/reflect", async (req, res) => {
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
});

// Get Two Pointer Status - POST
app.post("/get-two-pointer-status", async (req, res) => {
    const reqData = await req.body;
    console.log("This is the value of reqData ", reqData);
    const { username, day } = reqData;
    console.log("The value of username is ", username);
    console.log("The value of day is ", day);
    let flag = true;
    let returnData = {
        dayYesterday: "",
        dayBeforeYesterday: "",
    };

    if (username && day) {
        try {
            console.log("I was here");

            const dayYesterdayDoc = await db
                .collection("reflections")
                .where("name", "==", username)
                .where("testDay", "==", day - 1)
                .get();

            if (!dayYesterdayDoc.empty) {
                let value = "";
                let ctr = 0;
                dayYesterdayDoc.forEach((doc) => {
                    const docData = doc.data();
                    console.log("THe doc data is ", docData.commitment);
                    value = docData.commitment;
                    ctr++;
                });
                if (ctr === 1) {
                    returnData.dayYesterday = value;
                } else {
                    console.log(
                        "The value is not set because there are multiple values "
                    );
                    flag = false;
                }
            } else {
                console.log(
                    "The query you have used doesn't have a corresponding field in the database"
                );
                flag = false;
            }

            const dayBeforeYesterdayDoc = await db
                .collection("reflections")
                .where("name", "==", username)
                .where("testDay", "==", day - 2)
                .get();

            if (!dayBeforeYesterdayDoc.empty) {
                let value = "";
                let ctr = 0;
                dayBeforeYesterdayDoc.forEach((doc) => {
                    const docData = doc.data();
                    console.log("THe doc data is ", docData.commitment);
                    value = docData.commitment;
                    ctr++;
                });
                if (ctr === 1) {
                    returnData.dayBeforeYesterday = value;
                } else {
                    console.log(
                        "The value is not set because there are multiple values "
                    );
                    flag = false;
                }
            } else {
                console.log(
                    "The query you have used doesn't have a corresponding field in the database"
                );
                flag = false;
            }
        } catch (error) {
            console.log(
                "there is an error at backend at (post) /get-two-pointer-status ",
                error
            );
            flag = false;
        }
    } else {
        flag = false;
    }

    if (flag === false) {
        res.send({
            message: "There is something wrong",
            results: false,
            data: returnData,
        });
    } else {
        res.send({
            message: "Everything is right",
            results: true,
            data: returnData,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
