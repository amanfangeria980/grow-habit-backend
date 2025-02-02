import axios from 'axios';

// export const sendMessageText = async (phoneNumbers: number, finStatus: any) => {
//     const response = await axios({
//         url: "https://graph.facebook.com/v21.0/538151729380352/messages",
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//             "Content-Type": "application/json ",
//         },
//         data: JSON.stringify({
//             messaging_product: "whatsapp",
//             //   to: "916378194921",
//             to: phoneNumbers,
//             // to: "919801801777",
//             type: "text",
//             text: {
//                 body: finStatus,
//             },
//         }),
//     });
//     console.log(response.data);
// };

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
    const title = `*Two Pointer Status - ${dateTitle}*\n\n`;
    const footer =
        '🐤 - Means You are going good.\n🦀 - Means You missed yesterday and need to do it today in order to avoid a fine.\n❌ - Means you are fined.\n🌶 - Pending Fine\nP & E - Plus & Elite respectively';
    const formattedMessage = statusData
        .map((item: any) => {
            const emoji = item.status === 'duck' ? '🐤' : item.status === 'crab' ? '🦀' : '❌';
            return `${item.username} -> ${emoji}`;
        })
        .join('\n');

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
