import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../serviceAccount.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const db = admin.firestore();

export default db;
