import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Suas chaves oficiais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCk1icjJyyNhfM_Q0yHR5opRnKVTe0GlSI",
  authDomain: "nuvem-de-autores-ed662.firebaseapp.com",
  databaseURL: "https://nuvem-de-autores-ed662-default-rtdb.firebaseio.com",
  projectId: "nuvem-de-autores-ed662",
  storageBucket: "nuvem-de-autores-ed662.firebasestorage.app",
  messagingSenderId: "294257887102",
  appId: "1:294257887102:web:41101b21c57c76c680552f",
  measurementId: "G-CQ85JPKM6V"
};

// Indica que o sistema está configurado
export const isFirebaseConfigured = true;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
