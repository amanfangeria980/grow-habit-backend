import { Request, Response } from "express";
import { sendMessageText } from "../../utils/functions";

export const sendTextMessage = async (req: Request, res: Response) => {
    const reqData = req.body;
    console.log(reqData);
    const { phoneNumbers, finStatus } = reqData;
    // console.log(phoneNumbers, finStatus);
    // sendMessageTemplate(phoneNumbers);
    sendMessageText(phoneNumbers, JSON.stringify(finStatus));
    res.json({ message: "Message sent successfully" });
};
