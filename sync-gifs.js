import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';

// 1. Read and parse .env configuration
console.log("Lendo arquivo .env...");
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[key] = value.trim();
  }
});

const cloudName = env['VITE_CLOUDINARY_CLOUD_NAME'] || 'dsqtianpj';
const uploadPreset = env['VITE_CLOUDINARY_UPLOAD_PRESET'] || 'gifs_treinos';
const firebaseConfig = {
  apiKey: env['VITE_FIREBASE_API_KEY'],
  authDomain: env['VITE_FIREBASE_AUTH_DOMAIN'],
  projectId: env['VITE_FIREBASE_PROJECT_ID'],
  storageBucket: env['VITE_FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: env['VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId: env['VITE_FIREBASE_APP_ID'],
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_DIR = `C:/Users/gabri/Videos/1018 GIFS DE EXERCICIO FISICO/Academias`;
const FOLDERS_TO_CATEGORIES = {
  'Panturrilha': 'Panturrilhas',
  'peitoral': 'Peitoral',
  'Pernas': 'Pernas',
  'Trapézio': 'Trapézio',
  'tríceps': 'Tríceps'
};

async function syncGifs() {
  console.log("=== INICIANDO SINCRONIZAÇÃO DE GIFS ===");
  console.log(`Buscando em: ${BASE_DIR}`);
  console.log(`Cloudinary Cloud: ${cloudName}, Preset: ${uploadPreset}`);

  // Fetch existing exercises from Firestore to avoid duplication
  console.log("\nCarregando exercícios existentes do Firestore...");
  const exSnap = await getDocs(collection(db, "exercises"));
  const existingMap = {};
  exSnap.forEach(d => {
    const data = d.data();
    if (data.title && data.category) {
      const key = `${data.title.trim().toLowerCase()}_${data.category.trim().toLowerCase()}`;
      existingMap[key] = d.id;
    }
  });
  console.log(`Total de exercícios já cadastrados: ${Object.keys(existingMap).length}`);

  for (const [folderName, category] of Object.entries(FOLDERS_TO_CATEGORIES)) {
    const folderPath = path.join(BASE_DIR, folderName);
    console.log(`\nProcessando pasta: ${folderName} -> Categoria: ${category}`);

    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Pasta ${folderName} não encontrada em ${folderPath}. Pulando...`);
      continue;
    }

    const files = fs.readdirSync(folderPath);
    const gifFiles = files.filter(f => f.toLowerCase().endsWith('.gif'));
    console.log(`Encontrados ${gifFiles.length} arquivos GIF.`);

    for (const file of gifFiles) {
      const filePath = path.join(folderPath, file);
      const exerciseTitle = path.parse(file).name.trim();
      const dbKey = `${exerciseTitle.toLowerCase()}_${category.toLowerCase()}`;

      console.log(`\nExercício: "${exerciseTitle}" (${category})`);

      try {
        console.log(`- Fazendo upload do arquivo para o Cloudinary...`);
        const fileBase64 = fs.readFileSync(filePath, { encoding: 'base64' });
        const fileDataUri = `data:image/gif;base64,${fileBase64}`;

        const formData = new URLSearchParams();
        formData.append('file', fileDataUri);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Erro do Cloudinary: ${errText}`);
        }

        const data = await response.json();
        const secureUrl = data.secure_url;
        console.log(`- Upload concluído! URL: ${secureUrl}`);

        const exerciseData = {
          title: exerciseTitle,
          category: category,
          gifUrl: secureUrl,
          description: '',
          updatedAt: new Date()
        };

        if (existingMap[dbKey]) {
          const docId = existingMap[dbKey];
          console.log(`- Exercício já existe no banco. Atualizando documento ID: ${docId}`);
          await updateDoc(doc(db, "exercises", docId), exerciseData);
        } else {
          console.log(`- Exercício novo. Criando no Firestore...`);
          const docRef = await addDoc(collection(db, "exercises"), {
            ...exerciseData,
            createdAt: new Date()
          });
          existingMap[dbKey] = docRef.id;
          console.log(`- Criado com sucesso! ID: ${docRef.id}`);
        }
      } catch (err) {
        console.error(`❌ Erro ao processar arquivo "${file}":`, err.message);
      }
    }
  }

  console.log("\n=== SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO! ===");
  process.exit(0);
}

syncGifs().catch(err => {
  console.error("Erro fatal na sincronização:", err);
  process.exit(1);
});
