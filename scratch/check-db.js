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

const check = async () => {
  try {
    console.log("Tentando ler coleção 'users'...");
    const snap = await getDocs(collection(db, "users"));
    console.log(`Sucesso! Encontrados ${snap.size} documentos na coleção 'users'.`);
    snap.docs.forEach(d => {
        console.log(`- ID: ${d.id}, Dados:`, d.data());
    });
    process.exit(0);
  } catch (e) {
    console.error("ERRO DE CONEXÃO:", e);
    process.exit(1);
  }
};

check();
