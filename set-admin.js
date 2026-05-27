import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDty8_j1jgeHlKrFSTc_vhdKLgTY0r8G4",
  authDomain: "sistema-treino-11c54.firebaseapp.com",
  projectId: "sistema-treino-11c54",
  storageBucket: "sistema-treino-11c54.firebasestorage.app",
  messagingSenderId: "21228005457",
  appId: "1:21228005457:web:5962afac741b93d150f070",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const setAdmin = async () => {
  const uid = "7eyMIeN6NfP1CxQGg9qFxlY2A2Q2";
  const userData = {
    name: "Gabriel Lucas",
    email: "gabriellucas2301@gmail.com",
    role: "admin",
    updatedAt: new Date()
  };

  try {
    await setDoc(doc(db, "users", uid), userData, { merge: true });
    console.log("SUCESSO: Gabriel Lucas configurado como Admin!");
    process.exit(0);
  } catch (e) {
    console.error("ERRO:", e);
    process.exit(1);
  }
};

setAdmin();
