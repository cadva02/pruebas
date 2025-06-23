import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsc-qeTyEU7Uyzh8Isedv_gbEuoX3wq2M",
  authDomain: "gaid-agent.firebaseapp.com",
  projectId: "gaid-agent",
  storageBucket: "gaid-agent.firebasestorage.app",
  messagingSenderId: "175989187361",
  appId: "1:175989187361:web:7844d3f9df86094d08d460",
  measurementId: "G-1ZM6KXMNWQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
