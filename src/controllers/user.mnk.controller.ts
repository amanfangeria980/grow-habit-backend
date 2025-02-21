import db from "../../utils/firebase";
import { Request, Response } from "express";


export const getAllMNKGroups = async(req : Request, res : Response)=>{

    const groupsRef = await db.collection('mnk').get() ; 

    if(groupsRef.empty)
    {
        return res.status(404).json({
            message : "There are no mnk groups found"
        })
    }

    const groupData = groupsRef.docs.map((doc)=>({
        name : doc.data().name , 
        id : doc.data().id , 
    }))


    return res.status(200).json({
        message : "The groups are fetched successfully" , 
        data : groupData 
    })

    

    

}