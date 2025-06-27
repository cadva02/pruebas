import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: './functions/.env' });

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // ✅ Modo GitHub Actions: usar JSON completo (string)
  try {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    serviceAccount = {
      projectId: parsed.project_id,
      privateKey: parsed.private_key.replace(/\\n/g, '\n'),
      clientEmail: parsed.client_email,
    };
  } catch (err) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT no es un JSON válido');
  }
} else {
  // ✅ Modo local: usar variables individuales
  serviceAccount = {
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FB_CLIENT_EMAIL,
  };
}

const app = initializeApp(
  {
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.projectId}-default-rtdb.firebaseio.com`,
  },
  "principal"
);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const fs = getFirestore(app);