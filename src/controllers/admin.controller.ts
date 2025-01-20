import { Request, Response } from 'express';
import db from '../../utils/firebase';

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
                .collection('reflections')
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
                .collection('reflections')
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
        const reflectionsSnapshot = await db.collection('reflections').orderBy('testDay').get();

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
        const targetDoc = await db.collection('reflections').where('timestamp', '==', data.timestamp).get();

        if (targetDoc.empty) {
            res.json({
                message: 'Please send a valid reflection to be deleted',
            });
            return;
        }

        // Note : logically there should be only one entry for one field but still I am considering that there could be multiple and written the code for it

        targetDoc.forEach(async doc => {
            await db.collection('reflections').doc(doc.id).delete();
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
