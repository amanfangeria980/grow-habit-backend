import axios from "axios";

export const sendMessageText = async (phoneNumber: number, data: any) => {
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
            to: "917078609133",
            // to: "919801801777",
            type: "text",
            text: {
                body: data,
            },
        }),
    });
    console.log(response.data);
};
