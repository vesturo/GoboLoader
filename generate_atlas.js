const sharp = require('sharp');
const fs = require('fs');

const canvasWidth = 2048;
const canvasHeight = 1024;
const goboImages = [
  'Gobo1.png', 'Gobo2.png', 'Gobo3.png', 'Gobo4.png',
  'Gobo5.png', 'Gobo6.png', 'Gobo7.png', 'Gobo8.png'
];

async function generateAtlas() {
  const imageSize = 256;  // Assuming each image is 256x256
  const images = await Promise.all(goboImages.map(imagePath =>
    sharp(imagePath).resize(imageSize, imageSize).toBuffer()
  ));

  // Create a new Sharp instance with the desired dimensions
  const atlas = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  // Composite the images onto the canvas
  let x = 0;
  let y = 0;
  for (const image of images) {
    atlas.composite([{ input: image, top: y, left: x }]);
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

  // Save the atlas
  await atlas.toFile('generated/SpotlightGoboAtlas.png');
  console.log('The Gobo Atlas was created.');
}

generateAtlas().catch(console.error);
