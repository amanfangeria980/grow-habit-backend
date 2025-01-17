import express, { Request, Response } from "express";
import { registerUser, signInUser } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/register", (req: Request, res: Response) => {
    registerUser(req, res);
});

authRoutes.post("/signin", (req: Request, res: Response) => {
    signInUser(req, res);
});

export default authRoutes;
