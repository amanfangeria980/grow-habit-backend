import { Request, Response } from 'express';
import db from '../../utils/firebase';
import * as admin from 'firebase-admin';
import { nanoid } from 'nanoid';

// Calculate the two pointer status of all the users
export const getTwoPointerStatus = async (req: Request, res: Response) => {
    const reqData = req.body;
    // console.log("This is the value of reqData ", reqData);
    const { username, day } = reqData;
    // console.log("The value of username is ", username);
    // console.log("The value of day is ", day);
    let flag = true;
    let returnData = {
        dayYesterday: '',
        dayBeforeYesterday: '',
    };

    if (username && day) {
        try {
            // console.log("I was here");
            const dayYesterdayDoc = await db
                .collection('userid-reflections')
                .where('name', '==', username)
                .where('testDay', '==', day - 1)
                .get();

            if (!dayYesterdayDoc.empty) {
                let value = '';
                let ctr = 0;
                dayYesterdayDoc.forEach(doc => {
                    const docData = doc.data();
                    // console.log("THe doc data is ", docData.commitment);
                    value = docData.commitment;
                    ctr++;
                });
                if (ctr === 1) {
                    returnData.dayYesterday = value;
                } else {
                    // console.log(
                    //     "The value is not set because there are multiple values "
                    // );
                    flag = false;
                }
            } else {
                // console.log(
                //     "The query you have used doesn't have a corresponding field in the database"
                // );
                flag = false;
            }

            const dayBeforeYesterdayDoc = await db
                .collection('userid-reflections')
                .where('name', '==', username)
                .where('testDay', '==', day - 2)
                .get();

            if (!dayBeforeYesterdayDoc.empty) {
                let value = '';
                let ctr = 0;
                dayBeforeYesterdayDoc.forEach(doc => {
                    const docData = doc.data();
                    // console.log("THe doc data is ", docData.commitment);
                    value = docData.commitment;
                    ctr++;
                });
                if (ctr === 1) {
                    returnData.dayBeforeYesterday = value;
                } else {
                    // console.log(
                    //     "The value is not set because there are multiple values "
                    // );
                    flag = false;
                }
            } else {
                // console.log(
                //     "The query you have used doesn't have a corresponding field in the database"
                // );
                flag = false;
            }
        } catch (error) {
            console.log('there is an error at backend at (post) /get-two-pointer-status ', error);
            flag = false;
        }
    } else {
        flag = false;
    }

    if (flag === false) {
        res.send({
            message: 'There is something wrong',
            results: false,
            data: returnData,
        });
    } else {
        res.send({
            message: 'Everything is right',
            results: true,
            data: returnData,
        });
    }
};

// Get all the reflections from the database
export const getReflections = async (req: Request, res: Response) => {
    try {
        const reflectionsSnapshot = await db.collection('userid-reflections').orderBy('testDay').get();

        let reflectionsData: any = [];

        reflectionsSnapshot.docs.forEach(ref => {
            let newValue = {
                id: ref.id,
                ...ref.data(),
            };
            reflectionsData.push(newValue);
        });
        res.send({
            message: 'Everything is cool',
            data: reflectionsData,
        });
    } catch (error) {
        console.log('There is an error on backend side in (get) /get-reflections', error);
        res.send({
            message: 'There is something wrong at (get) /get-reflections',
        });
    }
};

// Delete a reflection
export const deleteReflection = async (req: Request, res: Response) => {
    const reqData = req.body;
    const data = reqData.data;
    console.log('This is the value of data from frontend ', data);

    try {
        const targetDoc = await db.collection('userid-reflections').where('timestamp', '==', data.timestamp).get();

        if (targetDoc.empty) {
            res.json({
                message: 'Please send a valid reflection to be deleted',
            });
            return;
        }

        // Note : logically there should be only one entry for one field but still I am considering that there could be multiple and written the code for it

        targetDoc.forEach(async doc => {
            await db.collection('userid-reflections').doc(doc.id).delete();
        });

        res.json({
            message: `Your reflection with id : ${data.id} on day ${data.testDay} of user : ${data.name} is deleted successfully`,
        });
        return;
    } catch (error) {
        console.log('There is an error at admin/delete-reflection route ', error);
        res.json({
            message: `There is an error at admin/delete-reflection route  : ${error}`,
        });
        return;
    }
};

export const getUserRole = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await db.collection('users').where('email', '==', email).get();
    const userData = user.docs[0].data();
    return res.status(200).json({ success: true, message: 'User role fetched successfully', role: userData.role });
};

// These are the routes for managing MNK

export const createMNK = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        console.log('The data from frontend is ', req.body);

        if (!name) {
            return res.status(400).json({
                error: 'Name is a required field',
            });
        }

        const mnkCollection = db.collection('mnk');
        const existingQuery = await mnkCollection.where('name', '==', name).get();

        if (!existingQuery.empty) {
            return res.status(400).json({
                error: 'MNK group with this name already exists',
            });
        }

        const newId = nanoid();

        await mnkCollection.doc(newId).set({
            id: newId,
            name,
            createAt: new Date(),
            users: [],
        });

        return res.status(201).json({
            message: 'MNK group created successfully',
            id: newId,
        });
    } catch (error) {
        console.log('Error creating mnk at createMNK', error);
        return res.status(500).json({
            error: 'Internal server error at route createMNK',
        });
    }
};

export const deleteMNK = async (req: Request, res: Response) => {
    const { mnkId } = req.body;

    if (!mnkId) {
        return res.status(400).json({
            message: 'There is no mnk value',
        });
    }

    try {
        const mnkRef = db.collection('mnk').doc(mnkId);

        const mnkDocRef = await mnkRef.get();

        if (!mnkDocRef.exists) {
            return res.status(404).json({
                message: 'There is not mnk document present for the corresponding mnkID',
            });
        }

        const mnkData = await mnkDocRef.data();

        const usersArray = mnkData?.users || [];

        const updatePromises = usersArray.map(async (user: any) => {
            const userRef = db.collection('users').doc(user.userId);
            return userRef.update({ mnk: null });
        });

        await Promise.all(updatePromises);

        await mnkRef.delete();

        return res.status(200).json({
            message: 'The MNK users have been deleted',
        });
    } catch (error) {
        console.log('there is an error at deleteMNK at admin.controller.ts', error);
        return res.status(500).json({
            message: 'There is an internal server error ',
            error: error,
        });
    }
};

export const getMNKGroups = async (req: Request, res: Response) => {
    try {
        const mnkCollection = db.collection('mnk');
        const existingQuery = await mnkCollection.get();

        let mnkGroups: any = [];

        if (existingQuery.empty) {
            return res.status(400).json({
                error: 'Add at least one mnk group to see the groups',
            });
        }

        existingQuery.docs.forEach(doc => {
            mnkGroups.push(doc.data());
        });

        return res.json({
            message: 'The mnk groups are fetched successfully',
            data: mnkGroups,
        });
    } catch (error) {
        console.log('There is an error at getMNKGroups router ', error);

        return res.status(500).json({
            error: 'There is an internal servor error in getMNKGroups',
        });
    }
};

export const addToMNK = async (req: Request, res: Response) => {
    try {
        const reqData = await req.body;
        const { userId, mnkId } = reqData;

        if (!userId || !mnkId) {
            return res.status(400).json({
                success: false,
                message: 'Missing userId or mnkId',
            });
        }

        const mnkGroupRef = db.collection('mnk').doc(mnkId);
        const userRef = db.collection('users').doc(userId);

        const batch = db.batch();

        // add userId to mnk group array

        const userDoc = await userRef.get();
        const name = userDoc.data()?.fullName;
        const userDetails = {
            userId: userId,
            name,
        };

        batch.update(mnkGroupRef, {
            users: admin.firestore.FieldValue.arrayUnion(userDetails),
        });

        const mnkDoc = await mnkGroupRef.get();
        const mnkName = mnkDoc.data()?.name;

        batch.update(userRef, {
            mnk: { mnkId, mnkName },
        });

        await batch.commit();

        return res.status(200).json({
            success: true,
            message: 'User added to MNK successfully',
        });
    } catch (error) {
        console.log('There is an error at addToMNK controller in admin route ', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    // add mnkId to userId
};

export const removeFromMNK = async (req: Request, res: Response) => {
    const { userId, mnkId } = req.body;

    if (!userId || !mnkId) {
        return res.status(400).json({
            message: 'The userId or mnkId is not present',
        });
    }

    const userDocRef = db.collection('users').doc(userId);

    try {
        await userDocRef.update({
            mnk: null,
        });

        const mnkRef = db.collection('mnk').doc(mnkId);
        const mnkDocRef = await mnkRef.get();

        if (!mnkDocRef.exists) {
            return res.status(404).json({
                message: 'The mnk document not found',
            });
        }

        const mnkData = await mnkDocRef.data();
        const usersArray = mnkData?.users || [];

        const updateUsersArray = usersArray.filter((user: any) => user.userId !== userId);

        await mnkRef.update({
            users: updateUsersArray,
        });

        return res.status(200).json({
            message: 'The user is removed from MNK',
        });
    } catch (error: any) {
        console.log('there is an error at removeFromMnk in admin.controller.js', error);

        return res.status(500).json({
            message: 'There is an internal server error',
            error: error.message,
        });
    }
};
