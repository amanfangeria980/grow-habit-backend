import { Request, Response } from "express"
import { nanoid } from "nanoid";
import db from "../../utils/firebase";

interface finalHabitDetails  {

    id : string, // will not recieve from the backend 
    name : string, 
    gateway : string, 
    plus : string, 
    elite : string, 
    cue : string, 
    userId : string, 
    importance : string, 
  

}


export const createHabit = async(req : Request, res : Response)=>{

    try{

    

    const {userId, habitDetails} = req.body ; 

    console.log("the value of userId is ", userId) ; 
    console.log("the value of habitDetails is ", habitDetails) ; 

    if(!userId || !habitDetails){

        return res.status(400).json({
            message : "Either the userId or habitDetails is missing"
        })
    }

    const habitId = nanoid() ;
    
    const habitDoc = db.collection('habits').doc(habitId)

    const finalHabitDetails : finalHabitDetails = {
        id : habitId, 
        userId : userId, 
        name : habitDetails?.name , 
        gateway : habitDetails?.gateway || "", 
        plus : habitDetails?.plus || "", 
        elite : habitDetails?.plus || "", 
        cue : habitDetails?.elite || "", 
        importance : habitDetails?.importance || "" , 
      
    }

    await habitDoc.set(finalHabitDetails) ; 

    return res.status(201).json({
        message : "Habit created successfully", 
        habitId : habitId
    })


}
catch(error : any)
{

    console.log("There is an error at createHabit controller at user.habit.controller.ts ", error) ; 

    res.status(500).json({
        message : "Habit couldn't be created due to an internal server error", 
        error : error.message 
    })

}

    

    

    

}