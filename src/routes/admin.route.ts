import express from "express";
import {
    getTwoPointerStatus,
    getReflections,
    deleteReflection,
} from "../controllers/admin.controller";

const adminRouter = express.Router();

adminRouter.post("/get-two-pointer-status", getTwoPointerStatus);
adminRouter.get("/get-reflections", getReflections);
adminRouter.post("/delete-reflection", deleteReflection);

export default adminRouter;
