const sharp = require('sharp');
const fs = require('fs');

const images = [
    'Gobo1.png', 'Gobo2.png', 'Gobo3.png', 'Gobo4.png',
    'Gobo5.png', 'Gobo6.png', 'Gobo7.png', 'Gobo8.png'
];

// Check if all images exist
images.forEach(image => {
    if (!fs.existsSync(image)) {
        console.error(`Error: ${image} is missing.`);
        process.exit(1); // Exit if any image is missing
    }
});

const generateAtlas = async () => {
    try {
        // Create a blank canvas of 2048x1024
        const canvas = sharp({
            create: {
                width: 2048,
                height: 1024,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 } // Black background
            }
        });

        // Define positions for each image in a 2x4 grid
        const positions = [
            { left: 0, top: 0 },
            { left: 512, top: 0 },
            { left: 1024, top: 0 },
            { left: 1536, top: 0 },
            { left: 0, top: 512 },
            { left: 512, top: 512 },
            { left: 1024, top: 512 },
            { left: 1536, top: 512 }
        ];

        // Composite each image onto the canvas
        const composites = await Promise.all(
            images.map((image, index) =>
                sharp(image)
                    .resize(512, 512) // Ensure each image is resized to 512x512
                    .toBuffer()
                    .then(buffer => ({
                        input: buffer,
                        left: positions[index].left,
                        top: positions[index].top
                    }))
            )
        );

        // Composite all images onto the canvas
        await canvas.composite(composites)
            .png()
            .toFile('generated/SpotlightGoboAtlas.png');

        console.log('Atlas generated successfully: generated/SpotlightGoboAtlas.png');
    } catch (error) {
        console.error('Error generating atlas:', error);
    }
};

// Run the atlas generation
generateAtlas();
