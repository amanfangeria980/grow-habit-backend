import express from 'express';
import { Request, Response } from 'express';
import {
    getTwoPointerStatus,
    getReflections,
    deleteReflection,
    getUserRole,
    createMNK,
    getMNKGroups,
    removeFromMNK,
    deleteMNK,
} from '../controllers/admin.controller';
import db from '../../utils/firebase';

const adminRouter = express.Router();

adminRouter.post('/get-two-pointer-status', getTwoPointerStatus);
adminRouter.get('/get-reflections', getReflections);
adminRouter.post('/delete-reflection', deleteReflection);
adminRouter.post('/update-reflection', (req, res) => {
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

            const snapshot = await db.collection('reflections').where('timestamp', '==', timestamp).get();

            if (snapshot.empty) {
                return res.json({
                    success: false,
                    message: 'There is no reflection which matches',
                });
            }

            const newSnapshot = await db
                .collection('reflections')
                .where('name', '==', newReflectionData.name)
                .where('testDay', '==', newReflectionData.testDay)
                .get();

            if (!newSnapshot.empty) {
                return res.json({
                    success: false,
                    message: 'There is an error : the updated testday at user : is already present',
                });
            }

            snapshot.forEach(async doc => {
                await db.collection('reflections').doc(doc.id).update({ testDay: updatedDay });
            });
            return res.json({
                message: 'The update is successful',
                success: true,
            });
        } catch (error) {
            console.log('there is an error occured at update-reflection , error : ', error);
            return res.json({
                success: false,
                message: `There is an error at updating the reflection in admin/update-reflection, error ${error}`,
            });
        }
    };

    updateReflection(req, res);
});

adminRouter.post('/get-user-role', (req, res) => {
    getUserRole(req, res);
});

adminRouter.post('/create-mnk', (req, res) => {
    createMNK(req, res);
});

adminRouter.get('/get-mnk', (req, res) => {
    getMNKGroups(req, res);
});

adminRouter.post('/remove-from-mnk', (req, res) => {
    removeFromMNK(req, res);
});

adminRouter.post('/delete-mnk-group', (req, res) => {
    deleteMNK(req, res);
});

export default adminRouter;
