import cron from 'node-cron';
import { normalMessageNumbers } from '../constants';
import axios from 'axios';

export const goodNightMessage = cron.schedule(
    '0 23 * * *',
    async () => {
        const phoneNumbers = normalMessageNumbers;
        const numbers = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers];
        const responses: { user: { name: string; number: number }; status: string; data?: any; error?: any }[] = [];

        try {
            for (const user of numbers) {
                try {
                    const response = await axios({
                        url: 'https://graph.facebook.com/v22.0/482349938305649/messages',
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        data: JSON.stringify({
                            messaging_product: 'whatsapp',
                            to: user.number,
                            type: 'template',
                            template: {
                                name: 'event_rsvp_confirmation_2',
                                language: {
                                    code: 'en_US',
                                },
                                components: [
                                    {
                                        type: 'body',
                                        parameters: [
                                            {
                                                type: 'text',
                                                text:
                                                    `${user.name}, Good Night!🌙   ` +
                                                    `Did you do your task? make sure to complete it tomorrow! Your future self will be proud of you 😌`,
                                            },
                                            {
                                                type: 'text',
                                                text: 'Grow Habit!',
                                            },
                                        ],
                                    },
                                ],
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
            console.error('Fatal error in goodNightMessage:', error);
            throw new Error('Failed to send good night messages');
        }
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata', // Set the timezone to Asia/Kolkata (Mumbai)
    }
);
