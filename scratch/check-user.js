import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

const checkUser = async () => {
  const uid = "7eyMIeN6NfP1CxQGg9qFxlY2A2Q2";
  try {
    console.log(`Tentando ler usuário ${uid}...`);
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      console.log("Usuário encontrado:", snap.data());
    } else {
      console.log("Usuário não encontrado.");
    }
    process.exit(0);
  } catch (e) {
    console.error("ERRO:", e);
    process.exit(1);
  }
};

checkUser();
