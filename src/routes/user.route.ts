import express, { Request, Response } from 'express';
import { createReflection, getGraphData, getIdOfUser, getUserReflections } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/reflect', (req: Request, res: Response) => {
    createReflection(req, res);
});

userRouter.get('/user-graph/:name', (req: Request, res: Response) => {
    getGraphData(req, res);
});
userRouter.get('/get-user-reflections', (req: Request, res: Response) => {
    getUserReflections(req, res);
});

userRouter.post('/get-user-id', (req: Request, res: Response) => {
    getIdOfUser(req, res);
});

export default userRouter;
