import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

// Cargar variables de entorno
dotenv.config();

// Leer y parsear la variable secreta como objeto JSON
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Inicializar Firebase Admin
const app = initializeApp(
  {
    credential: cert({
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n'),
      clientEmail: serviceAccount.client_email,
      clientId: serviceAccount.client_id,
    }),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
  },
  "principal"
);

// Exportar servicios
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const fs = getFirestore(app);
