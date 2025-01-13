import axios from "axios";

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
    const statusData =
        typeof finStatus === "string" ? JSON.parse(finStatus) : finStatus;

    // Create date title
    const today = new Date();
    const dateTitle = today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // Create formatted message with title and emojis
    const title = `*Two Pointer Status - ${dateTitle}*\n\n`;
    const footer =
        "🐤 - Means You are going good.\n🦀 - Means You missed yesterday and need to do it today in order to avoid a fine.\n❌ - Means you are fined.\n🌶 - Pending Fine\nP & E - Plus & Elite respectively";
    const formattedMessage = statusData
        .map((item: any) => {
            const emoji =
                item.status === "duck"
                    ? "🐤"
                    : item.status === "crab"
                    ? "🦀"
                    : "❌";
            return `${item.username} -> ${emoji}`;
        })
        .join("\n");

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
            type: "text",
            text: {
                body: title + formattedMessage + "\n\n" + footer,
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
