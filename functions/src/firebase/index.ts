import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import * as fs from 'fs'; // <-- módulo de archivos, sin conflicto

dotenv.config();

let serviceAccount: any = undefined;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // ✅ Modo GitHub Actions: usar JSON completo
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  try {
    const parsed = JSON.parse(raw);

    // DEBUG opcional:
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FIREBASE_CREDS) {
      console.log('==== DEBUG: Claves presentes en FIREBASE_SERVICE_ACCOUNT ====');
      console.log(Object.keys(parsed));
      console.log('==== DEBUG: project_id ====');
      console.log(parsed.project_id);
    }

    serviceAccount = {
      projectId: parsed.project_id,
      privateKey: parsed.private_key.replace(/\\n/g, '\n'),
      clientEmail: parsed.client_email,
    };
  } catch (err) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT no es un JSON válido');
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // ✅ Si hay un archivo de credenciales explícito, léelo
  try {
    const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const fileContents = fs.readFileSync(credsPath, 'utf8');
    const parsed = JSON.parse(fileContents);

    // DEBUG opcional:
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FIREBASE_CREDS) {
      console.log('==== DEBUG: Claves presentes en GOOGLE_APPLICATION_CREDENTIALS ====');
      console.log(Object.keys(parsed));
      console.log('==== DEBUG: project_id ====');
      console.log(parsed.project_id);
    }

    serviceAccount = {
      projectId: parsed.project_id,
      privateKey: parsed.private_key.replace(/\\n/g, '\n'),
      clientEmail: parsed.client_email,
    };
  } catch (err) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS no es un archivo JSON válido');
  }
} else {
  // ✅ Modo local: usar variables individuales
  serviceAccount = {
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FB_CLIENT_EMAIL,
  };
}

// DEBUG: Imprime el objeto usado para inicializar (no imprime llaves privadas)
if (process.env.NODE_ENV === 'development' || process.env.DEBUG_FIREBASE_CREDS) {
  console.log('==== DEBUG: serviceAccount usado para inicializar ====');
  console.log({
    projectId: serviceAccount.projectId,
    clientEmail: serviceAccount.clientEmail,
    privateKey: serviceAccount.privateKey ? '***' : undefined,
  });
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
// Cambia el nombre de la exportación de Firestore
export const firestoreDB = getFirestore(app);