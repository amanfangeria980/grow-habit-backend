import express, { Request, Response } from "express";
import { createReflection, getGraphData } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/reflect", (req: Request, res: Response) => {
    createReflection(req, res);
});

userRouter.get("/user-graph/:name", (req: Request, res: Response) => {
    getGraphData(req, res);
});

export default userRouter;
