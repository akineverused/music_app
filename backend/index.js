const express = require('express');
const cors = require('cors');

const { generateSongs } = require('./src/songGenerator');
const { generateAudio } = require('./src/audioGenerator');

const app = express();
app.use(cors());

app.get('/songs', (req, res) => {
    const page = Number(req.query.page ?? 1);
    const seed = req.query.seed ?? '1';
    const likes = Number(req.query.likes ?? 0);
    const lang = req.query.lang ?? 'en';

    const songs = generateSongs({
        page,
        seed: `${seed}_${lang}`,
        likes,
        lang,
    });

    res.json({
        page,
        seed,
        likes,
        songs,
    });
});

app.get('/audio', async (req, res) => {
    const seed = req.query.seed ?? '1';
    const songId = req.query.songId ?? '0';

    const wavBuffer = await generateAudio(`${seed}_${songId}`);

    res.setHeader('Content-Type', 'audio/wav');
    res.send(Buffer.from(wavBuffer));
});

const { generateCover } = require('./src/coverGenerator');

app.get('/cover', (req, res) => {
    const { title, artist, seed } = req.query;

    const rng = require('seedrandom')(seed);

    const r = Math.floor(rng() * 255);
    const g = Math.floor(rng() * 255);
    const b = Math.floor(rng() * 255);

    const svg = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="rgb(${r},${g},${b})"/>
      
      <text x="150" y="130"
        font-size="20"
        fill="white"
        text-anchor="middle"
        font-family="Arial"
        font-weight="bold">
        ${escapeXML(title)}
      </text>

      <text x="150" y="180"
        font-size="16"
        fill="white"
        text-anchor="middle"
        font-family="Arial">
        ${escapeXML(artist)}
      </text>
    </svg>
  `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

function escapeXML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});