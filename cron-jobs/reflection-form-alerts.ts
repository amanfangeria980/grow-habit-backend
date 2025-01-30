import cron from 'node-cron';
import { normalMessageNumbers } from '../constants';
import axios from 'axios';

export const reflectionFormAlert = cron.schedule(
    '0 19,22 * * *',
    // '* * * * *',
    async () => {
        const phoneNumbers = normalMessageNumbers;
        const numbers = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers];
        const responses: { user: { name: string; number: number }; status: string; data?: any; error?: any }[] = [];

        try {
            for (const user of numbers) {
                try {
                    const response = await axios({
                        url: 'https://graph.facebook.com/v21.0/482349938305649/messages',
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            messaging_product: 'whatsapp',
                            to: user.number,
                            type: 'text',
                            text: {
                                body: `Hey ${user.name}! \n\n*Please fill the reflection for today*👇🏻\n\nhttps://growhabit.me/reflection-form`,
                            },
                        }),
                    });
                    responses.push({ user, status: 'success', data: response.data });
                } catch (error) {
                    console.error(`Error sending message to ${user.name}:`, error);
                    responses.push({ user, status: 'error', error });
                }
            }
            return responses;
        } catch (error) {
            console.error('Fatal error in reflectionFormAlert:', error);
            throw new Error('Failed to send reflection form alerts');
        }
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata', // Set the timezone to Asia/Kolkata (Mumbai)
    }
);
