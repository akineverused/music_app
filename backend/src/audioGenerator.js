const seedrandom = require('seedrandom');
const WavEncoder = require('wav-encoder');

const SAMPLE_RATE = 44100;
const BARS = 16;

async function generateAudio(seed) {
    const rng = seedrandom(seed);

    const bpm = 90 + Math.floor(rng() * 40);
    const beatsPerBar = 4;
    const secondsPerBeat = 60 / bpm;
    const barDuration = beatsPerBar * secondsPerBeat;

    const totalDuration = BARS * barDuration;
    const totalSamples = Math.floor(totalDuration * SAMPLE_RATE);

    const scale = [
        261.63,
        293.66,
        329.63,
        349.23,
        392.0,
        440.0,
        493.88,
    ];

    const channel = new Float32Array(totalSamples);

    let sampleIndex = 0;

    while (sampleIndex < totalSamples) {
        const freq = scale[Math.floor(rng() * scale.length)];
        const beatLength = [0.5, 1, 1, 2][Math.floor(rng() * 4)];
        const noteDuration = beatLength * secondsPerBeat;
        const noteSamples = Math.floor(noteDuration * SAMPLE_RATE);

        let phase = 0;
        const phaseInc = (2 * Math.PI * freq) / SAMPLE_RATE;

        for (let i = 0; i < noteSamples && sampleIndex < totalSamples; i++) {
            channel[sampleIndex] += Math.sin(phase) * 0.3;
            phase += phaseInc;
            sampleIndex++;
        }
    }

    const fadeSamples = SAMPLE_RATE * 0.5;

    for (let i = 0; i < fadeSamples; i++) {
        channel[i] *= i / fadeSamples;
        channel[totalSamples - i - 1] *= i / fadeSamples;
    }

    return WavEncoder.encode({
        sampleRate: SAMPLE_RATE,
        channelData: [channel],
    });
}

module.exports = { generateAudio };