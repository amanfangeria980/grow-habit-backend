import express, { Request, Response } from 'express';
import { createReflection, getGraphData, getIdOfUser } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/reflect', (req: Request, res: Response) => {
    createReflection(req, res);
});

userRouter.get('/user-graph/:name', (req: Request, res: Response) => {
    getGraphData(req, res);
});
userRouter.get('get-user-reflections', (req: Request, res: Response) => {
    const getUserReflections = async (req: Request, res: Response) => {
        const { username } = req.query;

        console.log('this is the value of username', username);

        return res.json({
            message: 'This all seems to work',
        });
    };

    getUserReflections(req, res);
});

userRouter.post('/get-user-id', (req: Request, res: Response) => {
    getIdOfUser(req, res);
});

export default userRouter;
