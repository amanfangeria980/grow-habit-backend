import express, { Request, Response } from "express";
import {
    registerUser,
    signInUser,
    registerUserByGoogleLogin,
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/register", (req: Request, res: Response) => {
    registerUser(req, res);
});

authRoutes.post("/signin", (req: Request, res: Response) => {
    signInUser(req, res);
});

authRoutes.post("/google-login", (req: Request, res: Response) => {
    registerUserByGoogleLogin(req, res);
});

export default authRoutes;
