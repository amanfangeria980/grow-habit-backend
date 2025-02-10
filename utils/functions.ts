import axios from 'axios';
import { normalMessageNumbers } from '../constants';

export const sendMessageText = async (phoneNumbers: number, finStatus: any) => {
    // Parse the finStatus if it's a string
    const statusData = typeof finStatus === 'string' ? JSON.parse(finStatus) : finStatus;
    // Create date title
    const today = new Date();
    const dateTitle = today.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    // Create formatted message with title and emojis
    const title = `*Day ${new Date().getDate()}/25 : Two Pointer Status (${dateTitle})*\n\n`;
    const footer =
        'Reflection: 0/6\nCoC(contact your comrade): 0/6\n\n🐤 - Means You are going good.\n🦀 - Means You missed yesterday and need to do it today in order to avoid a fine.\n❌ - Means you are fined.\n🌶 - Pending Fine\nP & E - Plus & Elite respectively';
    const formattedMessage = statusData
        .map((item: any, index: number) => {
            const emoji = item.status.startsWith('duck')
                ? `🐤${item.status.includes('P') ? 'P' : item.status.includes('E') ? 'E' : ''}`
                : item.status === 'crab'
                ? '🦀'
                : '❌';
            const userNumber = normalMessageNumbers.find((u: any) => u.name.toLowerCase() === item.username.toLowerCase());
            const formattedNumber = userNumber
                ? `+${userNumber.number.toString().replace(/(\d{2})(\d{5})(\d{5})/, '$1 $2 $3')}`
                : '';
            const capitalizedName = item.username.charAt(0).toUpperCase() + item.username.slice(1).toLowerCase();
            const entry = `${capitalizedName} : ${emoji}\n${formattedNumber}\n`;

            // Add divider after every second person, except for the last entry
            return entry + (index % 2 === 1 && index < statusData.length - 1 ? '\n--------------------\n\n' : '\n');
        })
        .join('');

    const response = await axios({
        url: 'https://graph.facebook.com/v21.0/482349938305649/messages',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json ',
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phoneNumbers,
            type: 'text',
            text: {
                body: title + formattedMessage + '\n\n' + footer,
            },
        }),
    });
    console.log(response.data);
};

export const sendMessageTemplate = async (phoneNumbers: number | number[]) => {
    const numbers = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers];
    const responses = [];

    try {
        for (const number of numbers) {
            try {
                const response = await axios({
                    url: 'https://graph.facebook.com/v17.0/482349938305649/messages',
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify({
                        messaging_product: 'whatsapp',
                        to: number,
                        type: 'template',
                        template: {
                            name: 'welcome_message',
                            language: { code: 'en_US' },
                            components: [
                                {
                                    type: 'header',
                                    parameters: [
                                        {
                                            type: 'image',
                                            image: {
                                                id: '1796380164496898',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    }),
                });

                console.log(`Success for ${number}:`, response.data);
                responses.push({ number, status: 'success', data: response.data });
            } catch (error: any) {
                console.error(`Error for ${number}:`, error.response?.data || error.message);
                responses.push({
                    number,
                    status: 'error',
                    error: error.response?.data?.error || error.message,
                });
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return responses;
    } catch (error) {
        console.error('Fatal error in sendMessageTemplate:', error);
        throw error;
    }
};

export const sendNormalTextMessage = async (
    phoneNumbers: { name: string; number: number } | { name: string; number: number }[],
    message: string
) => {
    const numbers = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers];
    const responses = [];

    try {
        for (const number of numbers) {
            const response = await axios({
                url: 'https://graph.facebook.com/v21.0/482349938305649/messages',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: number,
                    type: 'text',
                    text: {
                        body: message,
                    },
                }),
            });
            responses.push({ number, status: 'success', data: response.data });
        }
        return responses;
    } catch (error) {
        console.error('Fatal error in sendNormalTextMessage:', error);
        throw error;
    }
};
