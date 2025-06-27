import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

// Cargar variables de entorno desde .env
dotenv.config();

// Leer y parsear el JSON completo de la service account
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

// Inicializar la app de Firebase Admin sin el campo "type"
const app = initializeApp(
  {
    credential: cert({
      projectId: serviceAccount.project_id,
      privateKeyId: serviceAccount.private_key_id,
      privateKey: serviceAccount.private_key?.replace(/\\n/g, '\n'),
      clientEmail: serviceAccount.client_email,
      clientId: serviceAccount.client_id,
      authUri: serviceAccount.auth_uri,
      tokenUri: serviceAccount.token_uri,
      authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
      clientC509CertUrl: serviceAccount.client_x509_cert_url,
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
