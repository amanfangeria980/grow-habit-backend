import { Request, Response } from "express";
import db from "../../utils/firebase";
import { nanoid } from "nanoid";

export const registerUser = async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;
    const id = nanoid();

    try {
        // Check if user already exists
        const existingUser = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        if (!existingUser.empty) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Create new user document
        const userDoc = {
            id,
            fullName,
            email,
            password, // Note: In production, this should be hashed
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await db.collection("users").doc(id).set(userDoc);
        console.log("result", result);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id,
                fullName,
                email,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while registering user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const signInUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const userSnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();

        if (userSnapshot.empty) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const userData = userSnapshot.docs[0].data();

        // In production, you should use proper password hashing comparison
        if (userData.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Return user data without sensitive information
        return res.status(200).json({
            success: true,
            message: "Sign in successful",
            user: {
                id: userData.id,
                email: userData.email,
                fullName: userData.fullName,
            },
        });
    } catch (error) {
        console.error("Error in sign in:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign in",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
