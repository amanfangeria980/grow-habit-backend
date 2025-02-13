import cron from 'node-cron';
import calculateTwoPointerStatusAdmin from '../utils/calculateTwoPointerStatusAdmin';

export const adminTwoPointerStatusAlertMorning = cron.schedule(
    '0 10 * * *',
    // "* * * * * *",
    async () => {
        const phoneNumbers = process.env.PHONE_NUMBER;
        const day = new Date(Date.now()).getDate();
        const finStatus = await calculateTwoPointerStatusAdmin(day);
        const response = await fetch(`${process.env.BACKEND_URL}/whatsapp/send-text-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumbers, finStatus }),
        });
        console.log('Whatsapp message sent to admin!', response);
        console.log('Running the Two Pointer Status Alert Morning job!');
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata', // Set the timezone to Asia/Kolkata (Mumbai)
    }
);
