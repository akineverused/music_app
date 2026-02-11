const { createCanvas } = require('canvas');
const seedrandom = require('seedrandom');

function generateCover({ title, artist, seed }) {
    const rng = seedrandom(seed);

    const size = 300;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const r = Math.floor(rng() * 255);
    const g = Math.floor(rng() * 255);
    const b = Math.floor(rng() * 255);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = `rgba(255,255,255,${rng() * 0.2})`;
        ctx.beginPath();
        ctx.arc(
            rng() * size,
            rng() * size,
            rng() * 80,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Sans';
    ctx.textAlign = 'center';
    wrapText(ctx, title, size / 2, 120, 260, 24);

    ctx.font = '16px Sans';
    wrapText(ctx, artist, size / 2, 200, 260, 20);

    return canvas.toBuffer('image/png');
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, y);
}

module.exports = { generateCover };