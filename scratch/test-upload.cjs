const fs = require('fs');

async function test() {
  const cloudName = 'dsqtianpj';
  const uploadPreset = 'gifs_treinos';
  const formData = new FormData();
  
  // create dummy text file
  fs.writeFileSync('dummy.txt', 'hello');
  const fileBlob = new Blob([fs.readFileSync('dummy.txt')], { type: 'text/plain' });
  
  formData.append('file', fileBlob, 'dummy.txt');
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

test();
