import express from "express";
import {
    createReflection,
    getTwoPointerStatus,
    getReflections,
} from "../controllers/admin.controller";

const router = express.Router();

router.post("/reflect", createReflection);
router.post("/get-two-pointer-status", getTwoPointerStatus);
router.get("/get-reflections", getReflections);

export default router;
