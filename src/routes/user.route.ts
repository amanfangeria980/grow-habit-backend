import express, { Request, Response } from 'express';
import { createReflection, getGraphData, getIdOfUser, getMNKUsers, getUserReflections } from '../controllers/user.controller';
import { getTwoPointerStatusToday } from '../controllers/user.controller';
import { addToMNK } from '../controllers/admin.controller';

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

userRouter.post('/get-two-pointer-status-today', (req: Request, res: Response) => {
    getTwoPointerStatusToday(req, res);
});

userRouter.get('/get-mnk-users', (req : Request, res : Response)=>{
    getMNKUsers(req, res) ; 
})

userRouter.post('/add-user-mnk', (req : Request, res : Response)=>{
    addToMNK(req, res) ; 
})

export default userRouter;
