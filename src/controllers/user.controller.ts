import { nanoid } from 'nanoid';
import db from '../../utils/firebase';
import { Request, Response } from 'express';

// Create and store reflections in the database
export const createReflection = async (req: Request, res: Response) => {
    const reqData = req.body;
    const id = nanoid();
    const { testDay, name } = reqData;
    try {
        const existingData = await db.collection('reflections').where('testDay', '==', testDay).where('name', '==', name).get();
        if (!existingData.empty) {
            return res.json({
                success: false,
                message: `There is already data present at ${testDay} for the user: ${name}`,
            });
        }
        const docRef = db.collection('reflections').doc(id);
        await docRef.set(reqData);
        console.log('New entry created with the id:', id);
        return res.json({
            message: 'Reflection saved successfully.',
            success: true,
        });
    } catch (error: any) {
        console.error('Error in /reflect route:', error);
        return res.status(500).json({
            message: 'An error occurred while processing the request.',
            error: error.message,
        });
    }
};

export const getGraphData = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const reflectionsSnapshot = await db.collection('reflections').where('name', '==', name).orderBy('testDay').get();

        let recordsArray = [];

        // Create an array of 25 days initialized with "no" values
        for (let i = 1; i <= 25; i++) {
            recordsArray.push({ value: 'undefined', day: i });
        }

        // Update the array with actual reflection data
        reflectionsSnapshot.forEach(doc => {
            const data = doc.data();
            const day = data.testDay;

            if (day >= 1 && day <= 25) {
                recordsArray[day - 1] = {
                    value: data.commitment || 'undefined',
                    day: day,
                };
            }
        });

        res.json({
            success: true,
            data: recordsArray,
        });
    } catch (error) {
        console.error('Error in /user-graph route:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching graph data',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getUserReflections = async (req: Request, res: Response) => {
    const { username } = req.query;

    console.log('this is the value of username', username);

    return res.json({
        message: 'This all seems to work',
    });
};

export const getIdOfUser = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await db.collection('users').where('email', '==', email).get();
    return res.json({
        id: user.docs[0].id,
    });
};
