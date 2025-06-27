import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from 'firebase-admin/app';

const app = initializeApp(
    {
        databaseURL: `https://gaidagent--default-rtdb.firebaseio.com`,
    },
    "principal"
);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const fs = getFirestore(app);