import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const checkAll = async () => {
  const collections = ["users", "exercises", "trainings", "payments", "messages"];
  for (const col of collections) {
    try {
      console.log(`Tentando ler coleção '${col}'...`);
      const snap = await getDocs(collection(db, col));
      console.log(`SUCESSO '${col}': ${snap.size} documentos.`);
    } catch (e) {
      console.error(`FALHA '${col}':`, e.message);
    }
  }
  process.exit(0);
};

checkAll();
