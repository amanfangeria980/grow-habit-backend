import express from "express";
import {
    createReflection,
    getTwoPointerStatus,
    getReflections,
} from "../controllers/admin.controller";
import db from "../../utils/firebase";

const adminRouter = express.Router();

// adminRouter.post("/reflect", createReflection);
adminRouter.post("/get-two-pointer-status", getTwoPointerStatus);
adminRouter.get("/get-reflections", getReflections);
adminRouter.post("/delete-reflection", async(req, res)=>{

    const reqData = req.body ; 
    const data = reqData.data ; 
    console.log("This is the value of data from frontend ", data)

    try{

        const targetDoc = await db.collection("reflections")
        .where("timestamp", "==", data.timestamp)
        .get() ; 

        if(targetDoc.empty)
        {
            return res.json({
                message : "Please send a valid reflection to be deleted"
            })
        }


       

        // Note : logically there should be only one entry for one field but still I am considering that there could be multiple and written the code for it 

        targetDoc.forEach(async (doc)=>{
            await db.collection('reflections').doc(doc.id).delete() ; 
        })

        return res.json({
            message : `Your reflection with id : ${data.id} on day ${data.testDay} of user : ${data.name} is deleted successfully`
        })



    }
    catch(error)
    {
        console.log("There is an error at admin/delete-reflection route ", error)
        return res.json({
            message : `There is an error at admin/delete-reflection route  : ${error}`
        })
    }

    
}) 

export default adminRouter;
