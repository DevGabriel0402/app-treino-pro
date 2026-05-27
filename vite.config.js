import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'delete-local-gifs-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/delete-local-gifs' && req.method === 'POST') {
            try {
              const targetDir = path.resolve(process.cwd(), 'public/exercises/Academias');
              
              if (fs.existsSync(targetDir)) {
                // Helper to delete contents recursively but keep the root folder
                const deleteContentsRecursive = (dirPath) => {
                  const files = fs.readdirSync(dirPath);
                  for (const file of files) {
                    const curPath = path.join(dirPath, file);
                    if (fs.lstatSync(curPath).isDirectory()) {
                      deleteContentsRecursive(curPath);
                      fs.rmdirSync(curPath);
                    } else {
                      fs.unlinkSync(curPath);
                    }
                  }
                };

                deleteContentsRecursive(targetDir);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Arquivos locais excluídos com sucesso!' }));
              } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Diretório Academias não encontrado.' }));
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    open: true,
  }
})
