// Fases 1 e 2 (Vogais / Consoantes) usam geração procedural.

import { shuffle } from '../utils.js';

export const VOWELS = ['A', 'E', 'I', 'O', 'U'];
export const VOWELS_ACCENT = ['A', 'E', 'I', 'O', 'U', 'Á', 'É', 'Í', 'Ó', 'Ú'];
export const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Z'];

// findVowels: true → procura vogais; false → consoantes.
// level: 1 (fácil, só maiúsculas simples) ou 2 (pode incluir vogais acentuadas).
export function generateFindLettersRounds(findVowels, count = 6, level = 1) {
    const rounds = [];
    for (let i = 0; i < count; i++) {
        const numTarget = 3 + Math.floor(Math.random() * 2); // 3 ou 4
        const targetPool = findVowels
            ? (level >= 2 ? VOWELS_ACCENT : VOWELS)
            : CONSONANTS;
        const otherPool = findVowels ? CONSONANTS : VOWELS;
        const chosen = shuffle([...targetPool]).slice(0, numTarget);
        const others = shuffle([...otherPool]).slice(0, Math.min(5, otherPool.length));
        const letters = shuffle([...chosen, ...others]);
        rounds.push({ id: `findL-${findVowels ? 'v' : 'c'}-${i}-${Date.now()}`, letters, correct: chosen });
    }
    return rounds;
}
