// Fase 17-20: Sons & Silabas — junte 2 silabas para formar a palavra.
// round = { word: 'GATO', parts: ['GA','TO'], distractors: ['GO','TA',...] }

import { shuffle } from '../utils.js';
import { soundClick, speak } from '../audio.js';

export function renderSyllableBuild(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;

    const slots = document.createElement('div');
    slots.className = 'syllable-slots';
    const slotEls = [];
    const typed = [];
    for (let i = 0; i < round.parts.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'syllable-slot';
        slot.dataset.idx = String(i);
        slot.onclick = () => {
            if (typed.length > 0) {
                const removed = typed.pop();
                refreshSlots();
                options.querySelectorAll('.option-btn').forEach((b) => {
                    if (b.textContent === removed && b.classList.contains('used')) {
                        b.classList.remove('used');
                        b.style.pointerEvents = '';
                    }
                });
            }
        };
        slots.appendChild(slot);
        slotEls.push(slot);
    }

    const preview = document.createElement('div');
    preview.className = 'syllable-preview';
    preview.textContent = '\u00A0';

    const options = document.createElement('div');
    options.className = 'options-grid syllable-options';
    const pool = shuffle([...round.parts, ...round.distractors]);
    pool.forEach((syl) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn syllable-option';
        btn.textContent = syl;
        btn.onclick = async () => {
            if (typed.length >= round.parts.length) return;
            soundClick();
            typed.push(syl);
            btn.classList.add('used');
            btn.style.pointerEvents = 'none';
            refreshSlots();
            if (typed.length === round.parts.length) {
                const isCorrect = typed.join('') === round.word;
                preview.textContent = typed.join('');
                preview.classList.add(isCorrect ? 'correct' : 'wrong');
                if (isCorrect) speak(round.word);
                await showFeedback(isCorrect, isCorrect ? `Isso! ${round.word}!` : `A palavra era: ${round.word}`);
                onAnswer(isCorrect);
            }
        };
        options.appendChild(btn);
    });

    function refreshSlots() {
        slotEls.forEach((s, i) => {
            if (i < typed.length) {
                s.textContent = typed[i];
                s.classList.add('filled');
            } else {
                s.textContent = '';
                s.classList.remove('filled');
            }
        });
    }

    content.appendChild(slots);
    content.appendChild(preview);
    content.appendChild(options);
}
