import express, { Request, Response } from "express";
import { createReflection } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/reflect", (req: Request, res: Response) => {
    createReflection(req, res);
});

export default userRouter;
