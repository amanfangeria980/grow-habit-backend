import express from "express";
import { Request, Response } from "express";
import {
  getTwoPointerStatus,
  getReflections,
  deleteReflection,
} from "../controllers/admin.controller";
import db from "../../utils/firebase";

const adminRouter = express.Router();

/**
 * @swagger
 * /admin/get-two-pointer-status:
 *   post:
 *     summary: Get two pointer status
 *     tags: [Admin]
 */
/**
 * @swagger
 * /admin/get-two-pointer-status:
 *   post:
 *     summary: Get two pointer status
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved two pointer status
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/get-reflections:
 *   get:
 *     summary: Get all reflections
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved reflections
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/delete-reflection:
 *   post:
 *     summary: Delete a reflection
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timestamp
 *             properties:
 *               timestamp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reflection deleted successfully
 *       404:
 *         description: Reflection not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/update-reflection:
 *   post:
 *     summary: Update a reflection
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updatedDay
 *               - reflectionData
 *             properties:
 *               updatedDay:
 *                 type: string
 *               reflectionData:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                   name:
 *                     type: string
 *                   testDay:
 *                     type: string
 *     responses:
 *       200:
 *         description: Reflection updated successfully
 *       404:
 *         description: Reflection not found
 *       400:
 *         description: Updated test day already exists for user
 *       500:
 *         description: Server error
 */

adminRouter.post("/get-two-pointer-status", getTwoPointerStatus);
adminRouter.get("/get-reflections", getReflections);
adminRouter.post("/delete-reflection", deleteReflection);
adminRouter.post("/update-reflection", (req, res) => {
  const updateReflection = async (req: Request, res: Response) => {
    const reqData = req.body;
    const { updatedDay, reflectionData } = reqData;
    // console.log("the value of reqData from the frontend is  ", reqData)

    const { timestamp } = reflectionData;
    try {
      const newReflectionData = {
        ...reflectionData,
        testDay: updatedDay,
      };

      const snapshot = await db
        .collection("reflections")
        .where("timestamp", "==", timestamp)
        .get();

      if (snapshot.empty) {
        return res.json({
          success: false,
          message: "There is no reflection which matches",
        });
      }

      const newSnapshot = await db
        .collection("reflections")
        .where("name", "==", newReflectionData.name)
        .where("testDay", "==", newReflectionData.testDay)
        .get();

      if (!newSnapshot.empty) {
        return res.json({
          success: false,
          message:
            "There is an error : the updated testday at user : is already present",
        });
      }

      snapshot.forEach(async (doc) => {
        await db
          .collection("reflections")
          .doc(doc.id)
          .update({ testDay: updatedDay });
      });
      return res.json({
        message: "The update is successful",
        success: true,
      });
    } catch (error) {
      console.log(
        "there is an error occured at update-reflection , error : ",
        error
      );
      return res.json({
        success: false,
        message: `There is an error at updating the reflection in admin/update-reflection, error ${error}`,
      });
    }
  };

  updateReflection(req, res);
});

export default adminRouter;
