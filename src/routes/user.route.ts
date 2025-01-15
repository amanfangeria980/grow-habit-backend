import express, { Request, Response } from "express";
import { createReflection, getGraphData } from "../controllers/user.controller";

const userRouter = express.Router();

/**
 * @swagger
 * /user/reflect:
 *   post:
 *     summary: Create a reflection
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - reflection
 *               - testDay
 *             properties:
 *               name:
 *                 type: string
 *               reflection:
 *                 type: string
 *               testDay:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reflection created successfully
 *       500:
 *         description: Server error
 */

userRouter.post("/reflect", (req: Request, res: Response) => {
  createReflection(req, res);
});

/**
 * @swagger
 * /user/user-graph/{name}:
 *   get:
 *     summary: Get user graph data
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to get graph data for
 *     responses:
 *       200:
 *         description: Successfully retrieved graph data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

userRouter.get("/user-graph/:name", (req: Request, res: Response) => {
  getGraphData(req, res);
});

/**
 * @swagger
 * /user/get-user-reflections:
 *   get:
 *     summary: Get user reflections
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to get reflections for
 *     responses:
 *       200:
 *         description: Successfully retrieved user reflections
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
userRouter.get("/get-user-reflections", (req: Request, res: Response) => {
  const getUserReflections = async (req: Request, res: Response) => {
    const { username } = req.query;

    console.log("this is the value of username", username);

    return res.json({
      message: "This all seems to work",
    });
  };

  getUserReflections(req, res);
});

export default userRouter;
