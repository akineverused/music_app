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


app.get('/cover', (req, res) => {
    const { title, artist, seed } = req.query;
    const rng = require('seedrandom')(seed);

    const hue = Math.floor(rng() * 360);
    const bgHue = (hue + 40) % 360;

    const circles = Array.from({ length: 5 }).map(() => {
        const cx = rng() * 300;
        const cy = rng() * 300;
        const r = 40 + rng() * 80;
        const opacity = 0.1 + rng() * 0.3;
        return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="hsla(${hue}, 70%, 60%, ${opacity})" />
    `;
    }).join('');

    const svg = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="hsl(${hue}, 70%, 40%)"/>
          <stop offset="100%" stop-color="hsl(${bgHue}, 70%, 60%)"/>
        </linearGradient>
      </defs>

      <rect width="300" height="300" fill="url(#grad)" />

      ${circles}

      <rect y="200" width="300" height="100" fill="rgba(0,0,0,0.4)" />

      <text x="150" y="235"
        font-size="20"
        fill="white"
        text-anchor="middle"
        font-family="Arial"
        font-weight="bold">
        ${escapeXML(title)}
      </text>

      <text x="150" y="265"
        font-size="14"
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