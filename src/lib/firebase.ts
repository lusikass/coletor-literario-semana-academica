import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// ⚠️ Cole aqui os dados do firebaseConfig que o Firebase te deu
// no momento de registrar o app web.
const firebaseConfig = {
  apiKey: 'COLE_AQUI',
  authDomain: 'COLE_AQUI',
  projectId: 'COLE_AQUI',
  storageBucket: 'COLE_AQUI',
  messagingSenderId: 'COLE_AQUI',
  appId: 'COLE_AQUI',
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.includes('COLE_AQUI');

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { app, db };
