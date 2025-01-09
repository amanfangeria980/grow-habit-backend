import axios from "axios";

export const sendMessageText = async (phoneNumbers: number, finStatus: any) => {
    const response = await axios({
        url: "https://graph.facebook.com/v21.0/538151729380352/messages",
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json ",
        },
        data: JSON.stringify({
            messaging_product: "whatsapp",
            //   to: "916378194921",
            to: phoneNumbers,
            // to: "919801801777",
            type: "text",
            text: {
                body: finStatus,
            },
        }),
    });
    console.log(response.data);
};

export const sendMessageTemplate = async (phoneNumbers: number) => {
    const response = await axios({
        url: "https://graph.facebook.com/v21.0/538151729380352/messages",
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json ",
        },
        data: JSON.stringify({
            messaging_product: "whatsapp",
            to: phoneNumbers,
            // to: "919801801777",
            type: "template",
            template: {
                name: "hello_world",
                language: { code: "en_US" },
            },
        }),
    });
    console.log(response.data);
};
