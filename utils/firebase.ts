import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_PROJECT_ID,
    }),
});

const db = admin.firestore();

export default db;
