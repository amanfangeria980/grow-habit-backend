import admin from "firebase-admin";
import serviceAccount from "../serviceAccount.json";
admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        projectId: serviceAccount.project_id,
    }),
});

const db = admin.firestore();

export default db;
