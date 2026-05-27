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
          } else if (req.url === '/api/create-infinitepay-link' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body);
                const payload = {
                  handle: parsedBody.handle,
                  items: parsedBody.items
                };
                if (parsedBody.webhook_url) {
                  payload.webhook_url = parsedBody.webhook_url;
                }

                const apiRes = await fetch('https://api.checkout.infinitepay.io/links', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                });

                const data = await apiRes.json();
                res.writeHead(apiRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
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
