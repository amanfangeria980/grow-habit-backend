import { nanoid } from 'nanoid';
import db from '../../utils/firebase';
import { Request, Response } from 'express';


// get user details using the userId 

export const getUserDetails = async(req : Request, res : Response) =>{

    try{

 

    const {userId} = req.body ; 

    if(!userId)
    {
        return res.status(400).json({
            message : "Please provide a userId"
        })
    }

    const userDoc = await db.collection('users').doc(userId).get() ; 

    if(!userDoc.exists)
    {
        return res.status(404).json({
            message : "There is no user found for the particular userId"
        })
    }

    const userData = {...userDoc.data()} ; 

    return res.status(200).json({
        message : "The user data is fetched successfully", 
        data : userData 
    })

}
catch(error : any)
{

    console.log("There is an error at getUserDetails at user.controller.ts", error) ; 

    return res.status(500).json({
        message : "There is some error in getUser details controller of user.controller.ts", 
        error : error.message 
    })

}


}
// Create and store reflections in the database
export const createReflection = async (req: Request, res: Response) => {
    const reqData = req.body;
    const id = nanoid();
    const { testDay, name } = reqData;
    try {
        const existingData = await db.collection('userid-reflections').where('testDay', '==', testDay).where('name', '==', name).get();
        if (!existingData.empty) {
            return res.json({
                success: false,
                message: `There is already data present at ${testDay} for the user: ${name}`,
            });
        }
        console.log("The reflection form is working on this route")
        const docRef = db.collection('userid-reflections').doc(id);
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
    const { userId } = req.params;
   

    try {
        const reflectionsSnapshot = await db.collection('userid-reflections').where('userId', '==', userId).get();

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

export const getMNKUsers = async(req : Request, res : Response)=>{

    try
    {
        const userCollection = await db.collection('users').get() ; 

        const mnkUsers : any[] = []

        userCollection.docs.forEach((doc)=>{

            let userData = doc.data() ;

            if("mnk" in userData )
            {
                if(userData.mnk === null)
                mnkUsers.push(doc.data()) ; 

            }
            
        })

        return res.status(201).json({
            message : "This is working whatever it is", 
            data : mnkUsers
        })





    }
    catch(error)
    {

        console.log("there is an error at getMNKUser controller of admin router", error) ;
        return res.status(500).json({
            error : "There is an internal servor error"
        })

    }
    
    
}

interface UserDetail  {

    userId : string ; 
    userName : string ; 
    
     
}

export const getAllUsers = async(req : Request, res : Response)=>{

    try
    {
        const userCollection = await db.collection('users').get() ; 

        let mnkUsers : UserDetail[] = []

        let count = 0 ; 

        userCollection.docs.forEach((doc : any)=>{

            

            

            
            console.log("This is the value of doc.data() ", doc.data())
            let {fullName, id } = doc.data() ;
            mnkUsers.push({ userName : fullName || "", userId : id || ""})
            

           
            
        })

        console.log("This is the value of mnkUSers ", mnkUsers) ; 
        console.log("The value of the count is ", count) ;

        return res.status(201).json({
            message : "This is working whatever it is", 
            data : mnkUsers
        })





    }
    catch(error)
    {

        console.log("there is an error at getMNKUser controller of admin router", error) ;
        return res.status(500).json({
            error : "There is an internal servor error"
        })

    }
    


}


// Next action : write the getMNKUsers route 