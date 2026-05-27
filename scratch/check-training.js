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

const check = async () => {
  try {
    const snap = await getDoc(doc(db, "trainings", "ALWDIcNaGUCgFE1ReuJM"));
    console.log(JSON.stringify(snap.data(), null, 2));
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
};

check();
