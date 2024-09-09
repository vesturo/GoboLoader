const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const canvasWidth = 2048;
const canvasHeight = 1024;
const goboImages = [
  'Gobo1.png', 'Gobo2.png', 'Gobo3.png', 'Gobo4.png',
  'Gobo5.png', 'Gobo6.png', 'Gobo7.png', 'Gobo8.png'
];

async function generateAtlas() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  let x = 0;
  let y = 0;
  const imageSize = 256;  // Assuming each image is 256x256

  for (const imagePath of goboImages) {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, x, y, imageSize, imageSize);
    x += imageSize;
    if (x >= canvasWidth) {
      x = 0;
      y += imageSize;
    }
  }

  // Ensure the generated directory exists
  if (!fs.existsSync('generated')) {
    fs.mkdirSync('generated');
  }

  // Write the atlas to a file
  const out = fs.createWriteStream('generated/SpotlightGoboAtlas.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', () => {
    console.log('The Gobo Atlas was created.');
  });
}

generateAtlas().catch(console.error);
