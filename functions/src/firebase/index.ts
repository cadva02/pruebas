import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

// Leer y parsear el JSON del service account desde la variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

const app = initializeApp(
  {
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
  },
  "principal"
);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const fs = getFirestore(app);
