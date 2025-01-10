import express from "express";
import {
    createReflection,
    getTwoPointerStatus,
    getReflections,
} from "../controllers/admin.controller";

const adminRouter = express.Router();

adminRouter.post("/reflect", createReflection);
adminRouter.post("/get-two-pointer-status", getTwoPointerStatus);
adminRouter.get("/get-reflections", getReflections);

export default adminRouter;
