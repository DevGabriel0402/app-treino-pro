import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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
    const q = query(collection(db, "users"), where("name", "==", "Gabriel Lucas Aniceto Vieira"));
    const snap = await getDocs(q);
    
    const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log("Found students:", users.map(u => ({ id: u.id, cpf: u.cpf, name: u.name, role: u.role })));

    for (let u of users) {
      console.log(`\nTrainings for user ${u.id}:`);
      const tq = query(collection(db, "trainings"), where("userId", "==", u.id));
      const ts = await getDocs(tq);
      ts.forEach(t => console.log(t.id, t.data().name));
    }
    
    // Also check all trainings just in case
    console.log("\nAll trainings in DB:");
    const allT = await getDocs(collection(db, "trainings"));
    allT.forEach(t => console.log(t.id, "userId:", t.data().userId, "name:", t.data().name));

  } catch(e) {
    console.error(e);
  }
  process.exit(0);
};

check();
