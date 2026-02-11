const seedrandom = require('seedrandom');
const { fakerEN, fakerDE } = require('@faker-js/faker');
const PAGE_SIZE = 10;

function generateSongs({ page, seed, likes, lang }) {

    const faker = lang === "en" ? fakerEN : fakerDE;

    return Array.from({ length: PAGE_SIZE }).map((_, i) => {
        const index = (page - 1) * PAGE_SIZE + i + 1;

        const songSeed = `${seed}_${page}_${index}`;
        const rng = seedrandom(songSeed);

        faker.seed(Math.floor(rng() * 1_000_000_000));

        const isSingle = rng() < 0.3;

        return {
            index,
            title: faker.music.songName(),
            artist: rng() < 0.5
                ? faker.person.fullName()
                : faker.company.name(),
            album: isSingle ? 'Single' : faker.word.words({ count: { min: 1, max: 3 } }),
            genre: faker.music.genre(),
            likes: generateLikes(likes, rng),
        };
    });
}

function generateLikes(avgLikes, rng) {
    const base = Math.floor(avgLikes);
    const fraction = avgLikes - base;
    return rng() < fraction ? base + 1 : base;
}

module.exports = { generateSongs };