import express from "express";
import { createReflection } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/reflect", createReflection);

export default userRouter;
