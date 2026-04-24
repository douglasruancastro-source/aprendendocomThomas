import { describe, it, expect } from 'vitest';
import { VOWELS, CONSONANTS, VOWELS_ACCENT, generateFindLettersRounds } from '../../public/js/data/letters.js';
import { SYLLABLE_ROUNDS } from '../../public/js/data/syllables.js';
import { BUILD_WORD_ROUNDS, READ_MATCH_ROUNDS, FILL_BLANK_ROUNDS, TYPE_WORD_ROUNDS } from '../../public/js/data/words.js';
import { SEQUENCE_ROUNDS, MEMORY_ROUNDS, ODD_ONE_OUT_ROUNDS, COUNT_MATCH_ROUNDS } from '../../public/js/data/logic.js';
import { PHASES, phaseById, ROUNDS_PER_PHASE } from '../../public/js/data/phases.js';
import { COLOR_ROUNDS } from '../../public/js/data/colors.js';
import { NUMBER_ROUNDS } from '../../public/js/data/numbers.js';
import { ADD_ROUNDS, SUB_ROUNDS } from '../../public/js/data/math.js';

describe('generateFindLettersRounds (vowels, level 1)', () => {
    const rounds = generateFindLettersRounds(true, 6, 1);

    it('generates 6 rounds', () => expect(rounds).toHaveLength(6));

    it('each round has id, letters and correct arrays', () => {
        rounds.forEach((r) => {
            expect(r.id).toBeTruthy();
            expect(Array.isArray(r.letters)).toBe(true);
            expect(Array.isArray(r.correct)).toBe(true);
        });
    });

    it('correct letters are all vowels (no accents at level 1)', () => {
        rounds.forEach((r) => r.correct.forEach((l) => expect(VOWELS).toContain(l)));
    });

    it('each round has 3-4 target vowels', () => {
        rounds.forEach((r) => {
            expect(r.correct.length).toBeGreaterThanOrEqual(3);
            expect(r.correct.length).toBeLessThanOrEqual(4);
        });
    });

    it('letters array contains all correct letters', () => {
        rounds.forEach((r) => r.correct.forEach((c) => expect(r.letters).toContain(c)));
    });
});

describe('generateFindLettersRounds (vowels, level 2)', () => {
    it('may include accented vowels at level 2', () => {
        // Determinístico: basta que o pool seja o aumentado — não garantimos que sorteia acentuada.
        const rounds = generateFindLettersRounds(true, 50, 2);
        const allPicked = rounds.flatMap((r) => r.correct);
        // Pool inclui acentuadas; para 50 rodadas*3-4 picks, é extremamente improvável não ter nenhuma.
        expect(allPicked.some((l) => VOWELS_ACCENT.includes(l))).toBe(true);
    });
});

describe('generateFindLettersRounds (consonants)', () => {
    it('correct letters are all consonants', () => {
        const rounds = generateFindLettersRounds(false, 6, 1);
        rounds.forEach((r) => r.correct.forEach((l) => expect(CONSONANTS).toContain(l)));
    });
});

describe('SYLLABLE_ROUNDS', () => {
    it('has at least 24 rounds (target expansion)', () => {
        expect(SYLLABLE_ROUNDS.length).toBeGreaterThanOrEqual(24);
    });
    it('each round has correct syllable in options and a level', () => {
        SYLLABLE_ROUNDS.forEach((r) => {
            expect(r.options).toContain(r.syllable);
            expect([1, 2]).toContain(r.level);
        });
    });
    it('every round has a unique id', () => {
        const ids = SYLLABLE_ROUNDS.map((r) => r.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('BUILD_WORD_ROUNDS', () => {
    it('expanded to 24+ rounds', () => expect(BUILD_WORD_ROUNDS.length).toBeGreaterThanOrEqual(24));
    it('image key is lowercase version of word (no acentos em imagem)', () => {
        BUILD_WORD_ROUNDS.forEach((r) => {
            expect(r.word).toBeTruthy();
            expect(r.image).toBe(r.word.toLowerCase());
        });
    });
});

describe('READ_MATCH_ROUNDS', () => {
    it('expanded to 20+ rounds', () => expect(READ_MATCH_ROUNDS.length).toBeGreaterThanOrEqual(20));
    it('correct answer is in options and each round has 4 options', () => {
        READ_MATCH_ROUNDS.forEach((r) => {
            expect(r.options).toContain(r.correct);
            expect(r.options).toHaveLength(4);
        });
    });
});

describe('FILL_BLANK_ROUNDS', () => {
    it('expanded to 20+ rounds', () => expect(FILL_BLANK_ROUNDS.length).toBeGreaterThanOrEqual(20));
    it('correct letter is word[blank], within bounds, and display has underscore at blank', () => {
        FILL_BLANK_ROUNDS.forEach((r) => {
            expect(r.options).toContain(r.word[r.blank]);
            expect(r.blank).toBeGreaterThanOrEqual(0);
            expect(r.blank).toBeLessThan(r.word.length);
            expect(r.display[r.blank]).toBe('_');
        });
    });
});

describe('TYPE_WORD_ROUNDS', () => {
    it('expanded to 20+ rounds', () => expect(TYPE_WORD_ROUNDS.length).toBeGreaterThanOrEqual(20));
    it('each round has image key matching lowercase word', () => {
        TYPE_WORD_ROUNDS.forEach((r) => expect(r.image).toBe(r.word.toLowerCase()));
    });
});

describe('SEQUENCE_ROUNDS', () => {
    it('expanded to 15+ rounds', () => expect(SEQUENCE_ROUNDS.length).toBeGreaterThanOrEqual(15));
    it('answer is in options, has valid type and >=3 options', () => {
        SEQUENCE_ROUNDS.forEach((r) => {
            expect(r.options).toContain(r.answer);
            expect(['letter', 'number', 'shape']).toContain(r.type);
            expect(r.options.length).toBeGreaterThanOrEqual(3);
        });
    });
});

describe('MEMORY_ROUNDS', () => {
    it('has at least 5 rounds and each pair has word + image', () => {
        expect(MEMORY_ROUNDS.length).toBeGreaterThanOrEqual(5);
        MEMORY_ROUNDS.forEach((r) => {
            r.pairs.forEach((p) => {
                expect(p.word).toBeTruthy();
                expect(p.image).toBeTruthy();
            });
        });
    });
    it('level 2 has 6 pairs, level 1 has 4 pairs', () => {
        MEMORY_ROUNDS.forEach((r) => {
            if (r.level === 1) expect(r.pairs).toHaveLength(4);
            if (r.level === 2) expect(r.pairs).toHaveLength(6);
        });
    });
});

describe('ODD_ONE_OUT_ROUNDS', () => {
    it('expanded to 15+ rounds, each has exactly 4 items/labels and oddIdx in bounds', () => {
        expect(ODD_ONE_OUT_ROUNDS.length).toBeGreaterThanOrEqual(15);
        ODD_ONE_OUT_ROUNDS.forEach((r) => {
            expect(r.items).toHaveLength(4);
            expect(r.labels).toHaveLength(4);
            expect(r.oddIdx).toBeGreaterThanOrEqual(0);
            expect(r.oddIdx).toBeLessThan(r.items.length);
        });
    });
});

describe('COUNT_MATCH_ROUNDS', () => {
    it('expanded to 15+ rounds, count is in options (as string), count positive', () => {
        expect(COUNT_MATCH_ROUNDS.length).toBeGreaterThanOrEqual(15);
        COUNT_MATCH_ROUNDS.forEach((r) => {
            expect(r.options).toContain(String(r.count));
            expect(r.count).toBeGreaterThan(0);
            expect(r.word).toBeTruthy();
        });
    });
});

describe('PHASES / phaseById', () => {
    it('has 16 phases with unique ids 1..16', () => {
        expect(PHASES).toHaveLength(16);
        expect(PHASES.map((p) => p.id).sort((a, b) => a - b)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    });
    it('phaseById returns the matching phase', () => {
        expect(phaseById(3).id).toBe(3);
        expect(phaseById(13).type).toBe('color-match');
        expect(phaseById(15).type).toBe('math-add');
        expect(phaseById(999)).toBeUndefined();
    });
    it('every phase has a ROUNDS_PER_PHASE entry', () => {
        PHASES.forEach((p) => expect(ROUNDS_PER_PHASE[p.id]).toBeGreaterThan(0));
    });
});

describe('COLOR_ROUNDS (fase 13)', () => {
    it('has rounds for both levels', () => {
        expect(COLOR_ROUNDS.some((r) => r.level === 1)).toBe(true);
        expect(COLOR_ROUNDS.some((r) => r.level === 2)).toBe(true);
    });
    it('each round has options containing the correct hex', () => {
        COLOR_ROUNDS.forEach((r) => {
            expect(r.options.map((o) => o.hex)).toContain(r.correctHex);
            expect(r.options).toHaveLength(4);
        });
    });
    it('every round has unique id', () => {
        const ids = COLOR_ROUNDS.map((r) => r.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('NUMBER_ROUNDS (fase 14)', () => {
    it('has rounds for both levels', () => {
        expect(NUMBER_ROUNDS.some((r) => r.level === 1)).toBe(true);
        expect(NUMBER_ROUNDS.some((r) => r.level === 2)).toBe(true);
    });
    it('each round counts include the correct number and has 4 options', () => {
        NUMBER_ROUNDS.forEach((r) => {
            expect(r.counts).toContain(r.correctCount);
            expect(r.counts).toHaveLength(4);
            expect(r.correctCount).toBe(r.number);
        });
    });
});

describe('ADD_ROUNDS (fase 15)', () => {
    it('answer always equals a + b', () => {
        ADD_ROUNDS.forEach((r) => expect(r.answer).toBe(r.a + r.b));
    });
    it('options contain the answer and are 4 unique values', () => {
        ADD_ROUNDS.forEach((r) => {
            expect(r.options).toContain(r.answer);
            expect(new Set(r.options).size).toBe(r.options.length);
        });
    });
    it('level 1 results stay under 6', () => {
        ADD_ROUNDS.filter((r) => r.level === 1).forEach((r) => expect(r.answer).toBeLessThanOrEqual(5));
    });
});

describe('SUB_ROUNDS (fase 16)', () => {
    it('answer always equals a - b and is non-negative', () => {
        SUB_ROUNDS.forEach((r) => {
            expect(r.answer).toBe(r.a - r.b);
            expect(r.answer).toBeGreaterThanOrEqual(0);
        });
    });
    it('options contain the answer', () => {
        SUB_ROUNDS.forEach((r) => expect(r.options).toContain(r.answer));
    });
});
