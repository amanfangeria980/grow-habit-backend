import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Replace escaped newlines with actual newlines

// in local environment the private key should in double quotes while in production it should be without quotes
const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_PROJECT_ID,
    }),
});

const db = admin.firestore();

export default db;
