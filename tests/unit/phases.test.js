import { describe, it, expect } from 'vitest';

// Recreate data structures from the app for testing

const VOWELS = ['A','E','I','O','U'];
const CONSONANTS = ['B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','X','Z'];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generateFindLettersRounds(findVowels) {
    const rounds = [];
    for (let i = 0; i < 6; i++) {
        const letters = [];
        const numTarget = 3 + Math.floor(Math.random() * 2);
        const targets = findVowels ? VOWELS : CONSONANTS;
        const others = findVowels ? CONSONANTS : VOWELS;
        const chosen = shuffle([...targets]).slice(0, numTarget);
        chosen.forEach(l => letters.push(l));
        shuffle([...others]).slice(0, Math.min(5, others.length)).forEach(o => letters.push(o));
        rounds.push({ letters: shuffle(letters), correct: chosen });
    }
    return rounds;
}

const SYLLABLE_ROUNDS = [
    { syllable: 'BA', options: ['BA', 'DA', 'PA'] },
    { syllable: 'BI', options: ['BI', 'DI', 'PI'] },
    { syllable: 'CA', options: ['CA', 'GA', 'TA'] },
    { syllable: 'DO', options: ['DO', 'BO', 'GO'] },
    { syllable: 'FE', options: ['FE', 'VE', 'LE'] },
    { syllable: 'MA', options: ['MA', 'NA', 'LA'] },
    { syllable: 'LU', options: ['LU', 'RU', 'NU'] },
    { syllable: 'SO', options: ['SO', 'TO', 'PO'] }
];

const BUILD_WORD_ROUNDS = [
    { word: 'BOLA', image: 'bola' }, { word: 'CASA', image: 'casa' },
    { word: 'GATO', image: 'gato' }, { word: 'PATO', image: 'pato' },
    { word: 'SAPO', image: 'sapo' }, { word: 'LUA', image: 'lua' },
    { word: 'SOL', image: 'sol' }, { word: 'MESA', image: 'mesa' }
];

const READ_MATCH_ROUNDS = [
    { word: 'GATO', correct: 'gato', options: ['gato', 'pato', 'casa', 'bola'] },
    { word: 'CASA', correct: 'casa', options: ['sol', 'casa', 'flor', 'gato'] },
    { word: 'SOL', correct: 'sol', options: ['lua', 'bola', 'sol', 'peixe'] },
    { word: 'BOLA', correct: 'bola', options: ['bola', 'ovo', 'sol', 'mesa'] },
];

const FILL_BLANK_ROUNDS = [
    { word: 'GATO', blank: 0, display: '_ATO', options: ['G', 'P', 'M'] },
    { word: 'BOLA', blank: 0, display: '_OLA', options: ['B', 'C', 'S'] },
    { word: 'CASA', blank: 2, display: 'CA_A', options: ['S', 'R', 'L'] },
];

const SEQUENCE_ROUNDS = [
    { sequence: ['A','B','A','B'], answer: 'A', options: ['A','C','B'], type: 'letter' },
    { sequence: ['1','2','3','4'], answer: '5', options: ['5','7','3'], type: 'number' },
    { sequence: ['circle','square','circle','square'], answer: 'circle', options: ['circle','triangle','square'], type: 'shape' },
];

const ODD_ONE_OUT_ROUNDS = [
    { items: ['gato','pato','sapo','casa'], labels: ['Gato','Pato','Sapo','Casa'], oddIdx: 3, category: 'animais' },
    { items: ['sol','lua','estrela','mesa'], labels: ['Sol','Lua','Estrela','Mesa'], oddIdx: 3, category: 'ceu' },
];

const COUNT_MATCH_ROUNDS = [
    { image: 'estrela', count: 3, options: ['1','2','3'], word: 'TRES' },
    { image: 'bola', count: 2, options: ['2','4','5'], word: 'DOIS' },
    { image: 'flor', count: 5, options: ['3','5','4'], word: 'CINCO' },
];

const MEMORY_ROUNDS = [
    { pairs: [{ word: 'GATO', image: 'gato' }, { word: 'BOLA', image: 'bola' }, { word: 'SOL', image: 'sol' }, { word: 'LUA', image: 'lua' }] },
];

describe('generateFindLettersRounds (vowels)', () => {
    const rounds = generateFindLettersRounds(true);

    it('generates 6 rounds', () => {
        expect(rounds).toHaveLength(6);
    });

    it('each round has letters array and correct array', () => {
        rounds.forEach(round => {
            expect(round).toHaveProperty('letters');
            expect(round).toHaveProperty('correct');
            expect(Array.isArray(round.letters)).toBe(true);
            expect(Array.isArray(round.correct)).toBe(true);
        });
    });

    it('correct letters are all vowels', () => {
        rounds.forEach(round => {
            round.correct.forEach(letter => {
                expect(VOWELS).toContain(letter);
            });
        });
    });

    it('each round has 3-4 target vowels', () => {
        rounds.forEach(round => {
            expect(round.correct.length).toBeGreaterThanOrEqual(3);
            expect(round.correct.length).toBeLessThanOrEqual(4);
        });
    });

    it('letters array contains all correct letters', () => {
        rounds.forEach(round => {
            round.correct.forEach(c => {
                expect(round.letters).toContain(c);
            });
        });
    });
});

describe('generateFindLettersRounds (consonants)', () => {
    const rounds = generateFindLettersRounds(false);

    it('correct letters are all consonants', () => {
        rounds.forEach(round => {
            round.correct.forEach(letter => {
                expect(CONSONANTS).toContain(letter);
            });
        });
    });
});

describe('SYLLABLE_ROUNDS', () => {
    it('each round has correct syllable in options', () => {
        SYLLABLE_ROUNDS.forEach(round => {
            expect(round.options).toContain(round.syllable);
        });
    });

    it('each round has exactly 3 options', () => {
        SYLLABLE_ROUNDS.forEach(round => {
            expect(round.options).toHaveLength(3);
        });
    });
});

describe('BUILD_WORD_ROUNDS', () => {
    it('each round has word and image', () => {
        BUILD_WORD_ROUNDS.forEach(round => {
            expect(round.word).toBeTruthy();
            expect(round.image).toBeTruthy();
        });
    });

    it('image key is lowercase version of word', () => {
        BUILD_WORD_ROUNDS.forEach(round => {
            expect(round.image).toBe(round.word.toLowerCase());
        });
    });
});

describe('READ_MATCH_ROUNDS', () => {
    it('correct answer is in options', () => {
        READ_MATCH_ROUNDS.forEach(round => {
            expect(round.options).toContain(round.correct);
        });
    });

    it('each round has 4 options', () => {
        READ_MATCH_ROUNDS.forEach(round => {
            expect(round.options).toHaveLength(4);
        });
    });
});

describe('FILL_BLANK_ROUNDS', () => {
    it('correct letter is in options', () => {
        FILL_BLANK_ROUNDS.forEach(round => {
            const correctLetter = round.word[round.blank];
            expect(round.options).toContain(correctLetter);
        });
    });

    it('blank index is within word bounds', () => {
        FILL_BLANK_ROUNDS.forEach(round => {
            expect(round.blank).toBeGreaterThanOrEqual(0);
            expect(round.blank).toBeLessThan(round.word.length);
        });
    });

    it('display has underscore at blank position', () => {
        FILL_BLANK_ROUNDS.forEach(round => {
            expect(round.display[round.blank]).toBe('_');
        });
    });
});

describe('SEQUENCE_ROUNDS', () => {
    it('answer is in options', () => {
        SEQUENCE_ROUNDS.forEach(round => {
            expect(round.options).toContain(round.answer);
        });
    });

    it('each round has a type', () => {
        SEQUENCE_ROUNDS.forEach(round => {
            expect(['letter', 'number', 'shape']).toContain(round.type);
        });
    });

    it('each round has at least 3 options', () => {
        SEQUENCE_ROUNDS.forEach(round => {
            expect(round.options.length).toBeGreaterThanOrEqual(3);
        });
    });
});

describe('ODD_ONE_OUT_ROUNDS', () => {
    it('oddIdx is within items bounds', () => {
        ODD_ONE_OUT_ROUNDS.forEach(round => {
            expect(round.oddIdx).toBeGreaterThanOrEqual(0);
            expect(round.oddIdx).toBeLessThan(round.items.length);
        });
    });

    it('items and labels have same length', () => {
        ODD_ONE_OUT_ROUNDS.forEach(round => {
            expect(round.items).toHaveLength(round.labels.length);
        });
    });

    it('each round has exactly 4 items', () => {
        ODD_ONE_OUT_ROUNDS.forEach(round => {
            expect(round.items).toHaveLength(4);
        });
    });
});

describe('COUNT_MATCH_ROUNDS', () => {
    it('correct count is in options', () => {
        COUNT_MATCH_ROUNDS.forEach(round => {
            expect(round.options).toContain(String(round.count));
        });
    });

    it('count is positive', () => {
        COUNT_MATCH_ROUNDS.forEach(round => {
            expect(round.count).toBeGreaterThan(0);
        });
    });

    it('has a number word', () => {
        COUNT_MATCH_ROUNDS.forEach(round => {
            expect(round.word).toBeTruthy();
            expect(typeof round.word).toBe('string');
        });
    });
});

describe('MEMORY_ROUNDS', () => {
    it('each round has 4 pairs', () => {
        MEMORY_ROUNDS.forEach(round => {
            expect(round.pairs).toHaveLength(4);
        });
    });

    it('each pair has word and image', () => {
        MEMORY_ROUNDS.forEach(round => {
            round.pairs.forEach(pair => {
                expect(pair.word).toBeTruthy();
                expect(pair.image).toBeTruthy();
            });
        });
    });
});
