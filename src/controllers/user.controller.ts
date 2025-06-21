import { nanoid } from 'nanoid';
import db from '../../utils/firebase';
import { Request, Response } from 'express';

// get user details using the userId

export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                message: 'Please provide a userId',
            });
        }

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'There is no user found for the particular userId',
            });
        }

        const userData = { ...userDoc.data() };

        return res.status(200).json({
            message: 'The user data is fetched successfully',
            data: userData,
        });
    } catch (error: any) {
        console.log('There is an error at getUserDetails at user.controller.ts', error);

        return res.status(500).json({
            message: 'There is some error in getUser details controller of user.controller.ts',
            error: error.message,
        });
    }
};
// Create and store reflections in the database
export const createReflection = async (req: Request, res: Response) => {
    const reqData = req.body;
    const id = nanoid();
    const { testDay, name } = reqData;
    const { customNumber,secondaryHabitId, ...reqDataWithout} = reqData ; 

    try {
        const existingData = await db
            .collection('reflections')
            .where('testDay', '==', testDay)
            .where('name', '==', name)
            .get();
        if (!existingData.empty) {
            return res.json({
                success: false,
                message: `There is already data present at ${testDay} for the user: ${name}`,
            });
        }


        // it's debatable to keep it this way because a lot of times it can be unfilled | but then it becomes difficult to track the data | however for now I just want to keep it this way

        // if(!customNumber || !secondaryHabitId)
        // {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'The secondaryHabitid or customNumber is required',
        //     });
        // }

        if(customNumber && secondaryHabitId)
        {
            try{

            const customValueReflectionId = nanoid();
            const customValueReflectionRef = db.collection('custom-value-reflection').doc(customValueReflectionId);
            await customValueReflectionRef.set({
                id: customValueReflectionId,
                secondaryHabitId: secondaryHabitId,
                customNumber: customNumber,
                testDay: testDay,
                testMonth: new Date().getMonth() + 1, // Adding 1 since getMonth() returns 0-11
                testYear: new Date().getFullYear(),
                timestamp: Date.now()
            });
        }
        catch(error){

            return res.status(500).json({
                success: false,
                message: 'An error occurred while saving the custom value reflection',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
        }

        const docRef = db.collection('reflections').doc(id);
        await docRef.set(reqDataWithout);
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


// custom value routes 

export const getCustomValue = async (req : Request, res : Response)=> { 

    try{

    const {secondaryHabitId} = req.params;

    if(!secondaryHabitId)
    {
        return res.status(400).json({
            success : false, 
            message : "Missing required fields : secondaryHabitId"
        })
    }

    if(secondaryHabitId === "")
    {
        return res.status(400).json({
            success : false, 
            message : "The secondaryHabitId is not valid"
        })
    }

    const habitDoc = await db.collection('custom-value').doc(secondaryHabitId).get() ; 

    if(!habitDoc.exists){
        return res.status(404).json({
            success : false, 
            message : "User not found"
        })
    }

    const habitData = habitDoc.data() ; 

    if(!habitData)
    {

        return res.status(400).json({
            success : true, 
            data : {
                secondaryHabit : null 
            }
        })

    }
    else
    {
        return res.status(400).json({
            success : true , 
            data : {
                secondaryHabit : habitData
            }
        })
    }

    }
    catch(error)
    {
        console.error("Error in getting custom value", error) ; 
        return res.status(500).json({
            success : false , 
            message : "Internal server error", 
            error : error instanceof Error ? error.message : 'Unknown error'
        })
    }

}


export const addCustomValue = async(req : Request, res : Response)=>{
    try {
        const { userId, name, value, unit } = req.body; 

        if (!userId || !name || !value || !unit) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        if(userId === "")
        {
            return res.status(400).json({
                success : false, 
                message : "The userId is not valid", 
            })
        }

        const userDoc = await db.collection('users').doc(userId).get();



        if(!userDoc.exists){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

       

        const userData = userDoc.data();  
        // Check if secondaryHabit array exists and is empty
        if (userData?.secondaryHabit && userData?.secondaryHabit.length === 0) {
            const customId = nanoid(); // Generate unique ID for custom habit
            
            try {
                await db.collection('users').doc(userId).update({
                    secondaryHabit: [customId]
                });

                await db.collection('custom-value').doc(customId).set({
                    userId: userId,
                    name: name,
                    value: value,
                    unit: unit,
                    createdAt: new Date(),
                    id : customId
                });



                return res.status(200).json({
                    success: true,
                    message: 'Custom habit added successfully',
                    data: {
                        id: customId,
                        name: name,
                        value: value, 
                        unit: unit
                    }
                });
            } catch (error) {
                console.error('Error updating user document:', error);
                return res.status(500).json({
                    success: false, 
                    message: 'Error adding custom habit',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return res.status(400).json({
            message: "The custom value cannot be added", 
            success: false, 
        });
    } 
    catch (error) {
        console.error('Error in addCustomValue:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}



export const deleteCustomValue = async(req : Request, res : Response)=>{
   

    const { userId, customId} = req.body; 

    console.log("this is the value of userId", userId); 
    console.log("this is the value of customId", customId); 

    if(!userId || !customId || customId === ""){
        return res.status(400).json({
            success : false, 
            message : "The userId and customId are required", 
        })
    }

    try{

   

    const userDoc = await db.collection('users').doc(userId).get(); 

    if(!userDoc.exists){
        return res.status(404).json({
            success : false, 
            message : "The user is not found", 
        })
    }
    

    try {
        const userData = userDoc.data();
        
        // Check if secondaryHabit array exists and is not empty
        if (!userData?.secondaryHabit || userData.secondaryHabit.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No custom value exists to delete"
            });
        }

        const batch = db.batch();
        
        batch.update(db.collection('users').doc(userId), {
            secondaryHabit: []
        });
        
        batch.delete(db.collection('custom-value').doc(customId));
        
        await batch.commit();

        return res.status(200).json({
            success: true,
            message: "Custom value deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteCustomValue:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting custom value',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }

}
catch(error){
    console.error('Error in deleteCustomValue:', error);
    return res.status(500).json({
        success: false,
        message: 'Error deleting custom value',
        error: error instanceof Error ? error.message : 'Unknown error'
    });
}

}

export const getCustomValueReflection = async(req : Request, res : Response)=>{

    const {secondaryHabitId} = req.params; 

    if(!secondaryHabitId){
        return res.status(400).json({
            success : false, 
            message : "The secondaryHabitId is required", 
        })
    }

    if(secondaryHabitId === "")
    {
        return res.status(400).json({
            success : false, 
            message : "The secondaryHabitId is not valid", 
        })
    }

    try{

    const customValueReflectionDoc = await db.collection('custom-value-reflection').where('secondaryHabitId', '==', secondaryHabitId).get(); 

    if(customValueReflectionDoc.empty){
        return res.status(404).json({
            success : false, 
            message : "The custom value reflection is not found", 
        })
    }

    const customValueReflectionData = customValueReflectionDoc.docs.map((doc)=>doc.data()); 

    return res.status(200).json({
        success : true, 
        data : customValueReflectionData, 
    })
}
catch(error){
    console.error('Error in getCustomValueReflection:', error);
    return res.status(500).json({
        success : false, 
        message : "Internal server error", 
        error : error instanceof Error ? error.message : 'Unknown error', 
    })
}

}

export const getGraphData = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const reflectionsSnapshot = await db.collection('reflections').where('userId', '==', userId).get();

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

export const getTwoPointerStatusToday = async (req: Request, res: Response) => {
    const { name, day } = req.body;
    if (day == 1) {
        return res.json({
            success: true,
            data: {
                dayYesterday: 'undefined',
                dayBeforeYesterday: 'undefined',
                status: 'undefined',
            },
        });
    }
    // const day = 3; // You might want to use new Date().getDate() in production
    let returnData = {
        dayYesterday: '',
        dayBeforeYesterday: '',
    };

    try {
        // Get yesterday's data
        const dayYesterdayDoc = await db
            .collection('reflections')
            .where('name', '==', name)
            .where('testDay', '==', day - 1)
            .get();

        // Get day before yesterday's data
        const dayBeforeYesterdayDoc = await db
            .collection('reflections')
            .where('name', '==', name)
            .where('testDay', '==', day - 2)
            .get();

        // Process yesterday's data
        if (!dayYesterdayDoc.empty) {
            dayYesterdayDoc.forEach(doc => {
                const docData = doc.data();
                returnData.dayYesterday = docData.commitment || 'no';
            });
        } else {
            returnData.dayYesterday = 'no';
        }

        // Process day before yesterday's data
        if (!dayBeforeYesterdayDoc.empty) {
            dayBeforeYesterdayDoc.forEach(doc => {
                const docData = doc.data();
                returnData.dayBeforeYesterday = docData.commitment || 'no';
            });
        } else {
            returnData.dayBeforeYesterday = 'no';
        }

        // Helper function to check valid status
        const isValidStatus = (status: string) => ['gateway', 'plus', 'elite'].includes(status);

        // Determine status based on conditions
        const status =
            (isValidStatus(returnData.dayYesterday) && isValidStatus(returnData.dayBeforeYesterday)) ||
            (isValidStatus(returnData.dayYesterday) && returnData.dayBeforeYesterday === 'no')
                ? 'duck'
                : returnData.dayYesterday === 'no' && isValidStatus(returnData.dayBeforeYesterday)
                ? 'crab'
                : 'cross';

        return res.json({
            success: true,
            data: {
                ...returnData,
                status,
            },
        });
    } catch (error) {
        console.error('Error in getTwoPointerStatusToday:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while getting two pointer status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getMNKUsers = async (req: Request, res: Response) => {
    try {
        const { mnkId } = req.params;

        if (!mnkId) {
            return res.status(400).json({
                success: false,
                message: 'MNK ID is required',
            });
        }

        const mnkDoc = await db.collection('mnk').doc(mnkId).get();

        if (!mnkDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'MNK group not found',
            });
        }

        const mnkData = mnkDoc.data();
        const users = mnkData?.users || [];

        return res.status(200).json({
            success: true,
            message: 'MNK users fetched successfully',
            data: users,
        });
    } catch (error) {
        console.log('there is an error at getMNKUser controller', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

interface UserDetail {
    userId: string;
    userName: string;
}

// export const getAllUsers = async (req: Request, res: Response) => {
//     try {
//         const userCollection = await db.collection('users').get();

//         let mnkUsers: UserDetail[] = [];

//         let count = 0;

//         userCollection.docs.forEach((doc: any) => {
//             console.log('This is the value of doc.data() ', doc.data());
//             let { fullName, id } = doc.data();
//             mnkUsers.push({ userName: fullName || '', userId: id || '' });
//         });

//         console.log('This is the value of mnkUSers ', mnkUsers);
//         console.log('The value of the count is ', count);

//         return res.status(201).json({
//             message: 'This is working whatever it is',
//             data: mnkUsers,
//         });
//     } catch (error) {
//         console.log('there is an error at getMNKUser controller of admin router', error);
//         return res.status(500).json({
//             error: 'There is an internal servor error',
//         });
//     }
// };

export const sendMNKJoinRequest = async (req: Request, res: Response) => {
    try {
        const { groupId, userId, name, groupName } = req.body;

        if (!groupId || !userId || !name || !groupName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: groupId, userId, name, or groupName',
            });
        }

        // Check if request already exists
        const existingRequest = await db.collection('mnk-requests').where('userId', '==', userId).get();

        if (!existingRequest.empty) {
            return res.status(400).json({
                success: false,
                message: 'A request from this user for this group already exists',
            });
        }

        // Create new request
        const requestData = {
            groupId,
            userId,
            name,
            groupName,
            status: 'pending', // pending, accepted, rejected
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await db.collection('mnk-requests').add(requestData);

        return res.status(201).json({
            success: true,
            message: 'MNK join request sent successfully',
            data: requestData,
        });
    } catch (error) {
        console.error('Error in sendMNKJoinRequest:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while sending the join request',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
