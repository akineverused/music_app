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

    const buffer = generateCover({ title, artist, seed });

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});