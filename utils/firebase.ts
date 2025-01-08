import admin, { ServiceAccount } from "firebase-admin";
const serviceAccount = require("../serviceAccount.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;
