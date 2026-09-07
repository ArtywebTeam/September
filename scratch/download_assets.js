const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  'logo.png': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/716e8a09d_logo.png',
  'hero.webp': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/8c7dd26ab_unnamed25.webp',
  'counter.webp': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/3bc3d0bac_unnamed24.webp',
  'bubbletea.webp': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/dd408fbb2_unnamed26.webp',
  'storefront.webp': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/13591cd0c_unnamed22.webp',
  'products.webp': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/ad1bda049_unnamed23.webp',
  'menu-drinks.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/bc9edf317_224fb71e-26d9-4995-a87b-c4af9b6ac5a3.jpg',
  'menu-snacks.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/065606f9c_7f7ed8db-8f5b-4f3d-b5f5-268625a98d06.jpg',
  'menu-new-snacks.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/12c82929a_458e946a-e213-408b-a89e-541e0cd29117.jpg',
  'cake-matcha.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/83ae66714_b8a02b4a-c73e-45e8-a746-f1f81530b324.jpg',
  'cake-love.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/1ac69291c_241b0524-f328-4956-8cab-f2f6871ae499.jpg',
  'cake-ribbon.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/4b6970c46_3b1b99b9-5b72-4275-af5e-7bf34c1a5200.jpg',
  'cake-100days.jpg': 'https://media.base44.com/images/public/6a77449c0d40e1579c14ec79/e46422cab_cefbca36-5611-4410-bfa1-9bf83b7f67bb.jpg'
};

const targetDir = path.join(__dirname, '..', 'assets', 'images');
fs.mkdirSync(targetDir, { recursive: true });

function download(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(targetDir, filename);
    const file = fs.createWriteStream(filePath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded:', filename);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filePath, () => {});
      console.error('Error downloading:', filename, err.message);
      reject(err);
    });
  });
}

async function run() {
  for (const [filename, url] of Object.entries(images)) {
    await download(url, filename);
  }
  console.log('All assets successfully downloaded to assets/images/');
}
run();
