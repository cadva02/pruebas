import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

// Cargar variables locales si existen
dotenv.config();

let credentialParams;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // CI/CD: JSON completo como string
  const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  credentialParams = {
    projectId: parsed.project_id,
    privateKey: parsed.private_key?.replace(/\\n/g, '\n'),
    clientEmail: parsed.client_email,
  };
} else {
  // Local: variables individuales
  credentialParams = {
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FB_CLIENT_EMAIL,
  };
}

const app = initializeApp(
  {
    credential: cert(credentialParams),
    databaseURL: `https://${credentialParams.projectId}-default-rtdb.firebaseio.com`,
  },
  "principal"
);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const fs = getFirestore(app);
