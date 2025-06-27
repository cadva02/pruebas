// import * as admin from "firebase-admin";
import { initializeApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

// Load environment variables
dotenv.config();

export const accountParams = {
    type: process.env.FB_TYPE,
    projectId: process.env.FB_PROJECT_ID,
    privateKeyId: process.env.FB_PRIVATE_KEY_ID,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
    clientEmail: process.env.FB_CLIENT_EMAIL,
    clientId: process.env.FB_CLIENT_ID,
    authUri: process.env.FB_AUTH_URI,
    tokenUri: process.env.FB_TOKEN_URI,
    authProviderX509CertUrl: process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
    clientC509CertUrl: process.env.FB_CLIENT_X509_CERT_URL,
};

const app = initializeApp(
    {
        credential: cert(accountParams),
        databaseURL: `https://${accountParams.projectId}-default-rtdb.firebaseio.com`,
    },
    "principal"
);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const fs = getFirestore(app);