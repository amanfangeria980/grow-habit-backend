import express, { Request, Response } from 'express';
import {
    createReflection,
    // getAllUsers,
    getGraphData,
    getIdOfUser,
    getMNKUsers,
    getUserReflections,
    sendMNKJoinRequest,
} from '../controllers/user.controller';
import { getTwoPointerStatusToday } from '../controllers/user.controller';
import { getUserDetails } from '../controllers/user.controller';
import { addToMNK } from '../controllers/admin.controller';
import { getAllMNKGroups } from '../controllers/user.mnk.controller';
import { createHabit } from '../controllers/user.habit.controller';

const userRouter = express.Router();

// ****************************** All the below are user routes *****************************************************

// this route needs to be written and it's controller needs to be created
userRouter.get('/get-user-details/:userId', (req: Request, res: Response) => {
    getUserDetails(req, res);
});

userRouter.post('/reflect', (req: Request, res: Response) => {
    createReflection(req, res);
});

userRouter.get('/user-graph/:userId', (req: Request, res: Response) => {
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

userRouter.get('/get-mnk-users', (req: Request, res: Response) => {
    getMNKUsers(req, res);
});

userRouter.post('/add-user-mnk', (req: Request, res: Response) => {
    addToMNK(req, res);
});

// userRouter.get('/get-all-users', (req: Request, res: Response) => {
//     getAllUsers(req, res);
// });

// ************************************* All the below are User.mnk routes ****************************************************

userRouter.get('/get-all-mnk', (req: Request, res: Response) => {
    getAllMNKGroups(req, res);
});

// ************************************** All the below are user.habit.controller routes *****************************************

userRouter.post('/create-habit', (req: Request, res: Response) => {
    createHabit(req, res);
});

userRouter.post('/send-mnk-join-request', (req: Request, res: Response) => {
    sendMNKJoinRequest(req, res);
});
export default userRouter;
