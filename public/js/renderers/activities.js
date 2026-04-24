// Renderizadores das 11 atividades. Cada função recebe (ctx, round).
// ctx é { state, content (div onde renderizar), onAnswer(correct, meta) } — permite desacoplar
// do engine, testar, e manter cada render puro em relação ao round.

import { shuffle } from '../utils.js';
import { SVG, SHAPE_SVG } from '../data/svg.js';
import { soundClick, soundFlipCard, soundMatch, speak } from '../audio.js';

// ---------- Fase 1 & 2: Encontrar Vogais / Consoantes ----------
export function renderFindLetters(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const selected = new Set();
    const grid = document.createElement('div');
    grid.className = 'letters-grid';
    round.letters.forEach((letter) => {
        const bubble = document.createElement('div');
        bubble.className = 'letter-bubble';
        bubble.textContent = letter;
        bubble.style.animation = 'pop 0.4s ease';
        bubble.onclick = () => {
            soundClick();
            if (selected.has(letter)) {
                selected.delete(letter);
                bubble.classList.remove('selected');
            } else {
                selected.add(letter);
                bubble.classList.add('selected');
            }
        };
        grid.appendChild(bubble);
    });
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn btn-primary';
    checkBtn.textContent = 'Conferir!';
    checkBtn.onclick = async () => {
        const correctSet = new Set(round.correct);
        const isCorrect =
            selected.size === correctSet.size &&
            [...selected].every((l) => correctSet.has(l));
        grid.querySelectorAll('.letter-bubble').forEach((b) => {
            if (correctSet.has(b.textContent)) b.classList.add('correct');
            else if (selected.has(b.textContent)) b.classList.add('wrong');
        });
        await showFeedback(isCorrect);
        onAnswer(isCorrect);
    };
    content.appendChild(grid);
    content.appendChild(checkBtn);
}

// ---------- Fase 3: Sílabas ----------
export function renderSyllables(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const display = document.createElement('div');
    display.className = 'big-display';
    display.textContent = round.syllable;
    display.style.fontSize = '72px';
    const options = document.createElement('div');
    options.className = 'options-grid';
    shuffle(round.options).forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = async () => {
            const isCorrect = opt === round.syllable;
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            await showFeedback(isCorrect);
            onAnswer(isCorrect);
        };
        options.appendChild(btn);
    });
    content.appendChild(display);
    content.appendChild(options);
}

// ---------- Fase 4: Monte a Palavra ----------
export function renderBuildWord(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const imgDiv = document.createElement('div');
    imgDiv.className = 'svg-display';
    imgDiv.innerHTML = SVG[round.image] || '';
    content.appendChild(imgDiv);

    const slots = document.createElement('div');
    slots.className = 'word-slots';
    const typed = [];
    const options = document.createElement('div');
    options.className = 'options-grid';

    for (let i = 0; i < round.word.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'word-slot';
        slot.dataset.idx = i;
        slot.onclick = () => {
            if (typed.length > 0) {
                const removed = typed.pop();
                updateSlots();
                options.querySelectorAll('.option-btn').forEach((b) => {
                    if (b.textContent === removed && b.classList.contains('used')) {
                        b.classList.remove('used');
                        b.style.pointerEvents = '';
                    }
                });
            }
        };
        slots.appendChild(slot);
    }

    shuffle([...round.word]).forEach((letter) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn draggable';
        btn.textContent = letter;
        btn.onclick = async () => {
            if (typed.length >= round.word.length) return;
            soundClick();
            typed.push(letter);
            btn.classList.add('used');
            btn.style.pointerEvents = 'none';
            updateSlots();
            if (typed.length === round.word.length) {
                const isCorrect = typed.join('') === round.word;
                await showFeedback(isCorrect, isCorrect ? 'Muito bem!' : `A palavra era: ${round.word}`);
                onAnswer(isCorrect);
            }
        };
        options.appendChild(btn);
    });

    function updateSlots() {
        slots.querySelectorAll('.word-slot').forEach((s, i) => {
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
    content.appendChild(options);
}

// ---------- Fase 5: Leia e Encontre ----------
export function renderReadMatch(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const display = document.createElement('div');
    display.className = 'big-display';
    display.textContent = round.word;
    const options = document.createElement('div');
    options.className = 'options-grid';
    shuffle(round.options).forEach((opt) => {
        const imgBtn = document.createElement('div');
        imgBtn.className = 'image-option';
        imgBtn.innerHTML = SVG[opt] || `<span>${opt}</span>`;
        imgBtn.onclick = async () => {
            const isCorrect = opt === round.correct;
            imgBtn.classList.add(isCorrect ? 'correct' : 'wrong');
            await showFeedback(isCorrect);
            onAnswer(isCorrect);
        };
        options.appendChild(imgBtn);
    });
    content.appendChild(display);
    content.appendChild(options);
}

// ---------- Fase 6: Complete a Palavra ----------
export function renderFillBlank(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const imgDiv = document.createElement('div');
    imgDiv.className = 'svg-display';
    imgDiv.innerHTML = SVG[round.word.toLowerCase()] || '';
    content.appendChild(imgDiv);

    const display = document.createElement('div');
    display.className = 'big-display';
    display.textContent = round.display;
    content.appendChild(display);

    const options = document.createElement('div');
    options.className = 'options-grid';
    const correctLetter = round.word[round.blank];
    shuffle(round.options).forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = async () => {
            const isCorrect = opt === correctLetter;
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            if (isCorrect) display.textContent = round.word;
            await showFeedback(isCorrect);
            onAnswer(isCorrect);
        };
        options.appendChild(btn);
    });
    content.appendChild(options);
}

// ---------- Fase 7: Escreva a Palavra ----------
export function renderTypeWord(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const imgDiv = document.createElement('div');
    imgDiv.className = 'svg-display';
    imgDiv.innerHTML = SVG[round.image] || '';
    content.appendChild(imgDiv);

    const display = document.createElement('div');
    display.className = 'big-display';
    display.style.minHeight = '70px';
    display.style.letterSpacing = '6px';
    const typed = [];

    function updateDisplay() {
        display.innerHTML = '';
        for (let i = 0; i < round.word.length; i++) {
            const span = document.createElement('span');
            if (i < typed.length) {
                span.textContent = typed[i];
                span.style.color = typed[i] === round.word[i] ? 'var(--correct)' : 'var(--wrong)';
            } else {
                span.textContent = '_';
                span.style.color = '#ccc';
            }
            display.appendChild(span);
        }
    }
    updateDisplay();
    content.appendChild(display);

    const keyboard = document.createElement('div');
    keyboard.className = 'keyboard';
    ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].forEach((row) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        [...row].forEach((key) => {
            const btn = document.createElement('button');
            btn.className = 'key-btn';
            btn.textContent = key;
            btn.onclick = async () => {
                soundClick();
                if (typed.length >= round.word.length) return;
                typed.push(key);
                updateDisplay();
                if (typed.length === round.word.length) {
                    const isCorrect = typed.join('') === round.word;
                    await showFeedback(isCorrect, isCorrect ? 'Muito bem!' : `A palavra era: ${round.word}`);
                    onAnswer(isCorrect);
                }
            };
            rowDiv.appendChild(btn);
        });
        if (row === 'ZXCVBNM') {
            const delBtn = document.createElement('button');
            delBtn.className = 'key-btn wide';
            delBtn.textContent = 'Apagar';
            delBtn.onclick = () => {
                if (typed.length > 0) {
                    typed.pop();
                    updateDisplay();
                }
            };
            rowDiv.appendChild(delBtn);
        }
        keyboard.appendChild(rowDiv);
    });
    content.appendChild(keyboard);
}

// ---------- Fase 8: Monte a Frase ----------
export function renderBuildSentence(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const resultDiv = document.createElement('div');
    resultDiv.className = 'sentence-result';
    const chosen = [];
    const wordsDiv = document.createElement('div');
    wordsDiv.className = 'sentence-words';
    const scrambled = shuffle(round.sentence);

    function updateResult() {
        resultDiv.innerHTML = '';
        chosen.forEach((w, i) => {
            const span = document.createElement('span');
            span.className = 'sentence-result-word';
            span.textContent = w;
            span.onclick = () => {
                chosen.splice(i, 1);
                updateResult();
                renderWordBtns();
            };
            resultDiv.appendChild(span);
        });
    }

    function renderWordBtns() {
        wordsDiv.innerHTML = '';
        scrambled.forEach((word) => {
            const btn = document.createElement('button');
            btn.className = 'sentence-word-btn';
            btn.textContent = word;
            if (chosen.includes(word) && chosen.filter((w) => w === word).length >= scrambled.filter((w) => w === word).length) {
                btn.classList.add('used');
                btn.style.pointerEvents = 'none';
            }
            btn.onclick = async () => {
                soundClick();
                chosen.push(word);
                btn.classList.add('used');
                btn.style.pointerEvents = 'none';
                updateResult();
                if (chosen.length === round.sentence.length) {
                    const isCorrect = chosen.join(' ') === round.sentence.join(' ');
                    await showFeedback(isCorrect, isCorrect ? 'Frase perfeita!' : `A frase era: ${round.sentence.join(' ')}`);
                    onAnswer(isCorrect);
                }
            };
            wordsDiv.appendChild(btn);
        });
    }

    content.appendChild(resultDiv);
    renderWordBtns();
    content.appendChild(wordsDiv);
}

// ---------- Fase 9: Sequência Lógica ----------
export function renderLogicalSequence(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const seqRow = document.createElement('div');
    seqRow.className = 'sequence-row';
    round.sequence.forEach((item) => {
        const el = document.createElement('div');
        el.className = 'sequence-item';
        if (round.type === 'shape') {
            el.innerHTML = SHAPE_SVG[item] || item;
            el.style.padding = '8px';
        } else {
            el.textContent = item;
        }
        seqRow.appendChild(el);
    });
    const mystery = document.createElement('div');
    mystery.className = 'sequence-item mystery';
    mystery.textContent = '?';
    seqRow.appendChild(mystery);
    content.appendChild(seqRow);

    const options = document.createElement('div');
    options.className = 'options-grid';
    shuffle(round.options).forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        if (round.type === 'shape') {
            btn.innerHTML = SHAPE_SVG[opt] || opt;
            btn.style.padding = '10px';
            btn.style.minWidth = '70px';
        } else {
            btn.textContent = opt;
        }
        btn.onclick = async () => {
            const isCorrect = opt === round.answer;
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            if (isCorrect) {
                mystery.className = 'sequence-item filled';
                if (round.type === 'shape') {
                    mystery.innerHTML = SHAPE_SVG[opt] || opt;
                    mystery.style.padding = '8px';
                } else {
                    mystery.textContent = opt;
                }
            }
            await showFeedback(isCorrect);
            onAnswer(isCorrect);
        };
        options.appendChild(btn);
    });
    content.appendChild(options);
}

// ---------- Fase 10: Memória ----------
// A fase inteira é UMA rodada para o engine (retorna onAnswer(true) apenas no fim).
export function renderMemoryGame(ctx, round) {
    const { content, onAnswer, showFeedback, onMemoryWin } = ctx;
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    const cards = [];
    round.pairs.forEach((pair, idx) => {
        cards.push({ type: 'word', content: pair.word, pairId: idx });
        cards.push({ type: 'image', content: pair.image, pairId: idx });
    });
    const shuffled = shuffle(cards);
    let flipped = [];
    let matched = 0;
    let checking = false;
    let attempts = 0;

    shuffled.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        const front = document.createElement('div');
        front.className = 'memory-card-front';
        front.textContent = '?';
        const back = document.createElement('div');
        back.className = 'memory-card-back';
        if (card.type === 'word') {
            back.textContent = card.content;
            back.style.fontSize = '18px';
        } else {
            back.innerHTML = SVG[card.content] || card.content;
        }
        cardEl.appendChild(front);
        cardEl.appendChild(back);
        cardEl.onclick = () => {
            if (
                checking ||
                cardEl.classList.contains('flipped') ||
                cardEl.classList.contains('matched') ||
                flipped.length >= 2
            ) return;
            soundFlipCard();
            cardEl.classList.add('flipped');
            flipped.push({ el: cardEl, pairId: card.pairId });
            if (flipped.length === 2) {
                attempts++;
                checking = true;
                const [c1, c2] = flipped;
                if (c1.pairId === c2.pairId) {
                    setTimeout(() => {
                        c1.el.classList.add('matched');
                        c2.el.classList.add('matched');
                        soundMatch();
                        matched++;
                        flipped = [];
                        checking = false;
                        if (matched === round.pairs.length) {
                            setTimeout(async () => {
                                const fast = attempts <= round.pairs.length + 2;
                                if (fast && onMemoryWin) onMemoryWin();
                                await showFeedback(true, 'Todos os pares encontrados!');
                                onAnswer(true);
                            }, 500);
                        }
                    }, 300);
                } else {
                    setTimeout(() => {
                        c1.el.classList.remove('flipped');
                        c2.el.classList.remove('flipped');
                        flipped = [];
                        checking = false;
                    }, 1000);
                }
            }
        };
        grid.appendChild(cardEl);
    });
    content.appendChild(grid);
}

// ---------- Fase 11: Qual é o diferente? ----------
export function renderOddOneOut(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const grid = document.createElement('div');
    grid.className = 'odd-grid';
    round.items.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'odd-item';
        el.innerHTML =
            `${SVG[item] || `<span style="font-size:48px;font-weight:700">${item}</span>`}` +
            `<div class="odd-label">${round.labels[idx]}</div>`;
        el.onclick = async () => {
            const isCorrect = idx === round.oddIdx;
            el.classList.add(isCorrect ? 'correct' : 'wrong');
            if (isCorrect) {
                grid.querySelectorAll('.odd-item').forEach((it, i) => {
                    if (i !== round.oddIdx) {
                        it.style.borderColor = '#66BB6A';
                        it.style.background = '#E8F5E9';
                    }
                });
            }
            await showFeedback(
                isCorrect,
                isCorrect ? `Isso! ${round.labels[round.oddIdx]} nao e do grupo!` : 'Tente achar o diferente!'
            );
            onAnswer(isCorrect);
        };
        grid.appendChild(el);
    });
    content.appendChild(grid);
}

// ---------- Fase 12: Conte e Combine ----------
export function renderCountMatch(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    if (round.prompt) {
        const p = document.createElement('div');
        p.className = 'instruction';
        p.style.marginTop = '6px';
        p.textContent = round.prompt;
        content.appendChild(p);
    }
    const countDisplay = document.createElement('div');
    countDisplay.className = 'count-display';
    for (let i = 0; i < round.count; i++) {
        const item = document.createElement('div');
        item.className = 'count-item';
        item.innerHTML = SVG[round.image] || '';
        item.style.animation = `pop 0.4s ease ${i * 0.12}s both`;
        countDisplay.appendChild(item);
    }
    content.appendChild(countDisplay);
    const options = document.createElement('div');
    options.className = 'options-grid';
    shuffle(round.options).forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.style.fontSize = '40px';
        btn.style.minWidth = '70px';
        btn.onclick = async () => {
            const isCorrect = opt === String(round.count);
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            if (isCorrect) {
                const wordEl = document.createElement('div');
                wordEl.className = 'count-number-word';
                wordEl.textContent = round.word;
                content.appendChild(wordEl);
                speak(round.word);
            }
            await showFeedback(isCorrect, isCorrect ? `Isso! Sao ${round.count}!` : 'Conte de novo!');
            onAnswer(isCorrect);
        };
        options.appendChild(btn);
    });
    content.appendChild(options);
}

// ---------- Fase 13: Cores ----------
export function renderColorMatch(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const display = document.createElement('div');
    display.className = 'big-display color-display';

    if (round.mode === 'name-to-color') {
        display.textContent = round.colorName;
        display.style.color = round.correctHex;
        display.style.textShadow = '2px 2px 0 rgba(0,0,0,0.35)';
    } else {
        const chip = document.createElement('div');
        chip.className = 'color-chip-big';
        chip.style.background = round.correctHex;
        display.appendChild(chip);
    }
    content.appendChild(display);

    const grid = document.createElement('div');
    grid.className = 'options-grid color-options';
    shuffle(round.options).forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn color-option';
        if (round.mode === 'name-to-color') {
            btn.setAttribute('aria-label', opt.name);
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.background = opt.hex;
            btn.appendChild(swatch);
        } else {
            btn.textContent = opt.name;
        }
        btn.onclick = async () => {
            soundClick();
            const isCorrect = opt.hex === round.correctHex;
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            await showFeedback(isCorrect, isCorrect ? `Isso! ${round.colorName}!` : 'Tente de novo!');
            if (isCorrect) speak(round.colorName);
            onAnswer(isCorrect);
        };
        grid.appendChild(btn);
    });
    content.appendChild(grid);
}

// ---------- Fase 14: Numeros ----------
export function renderNumberRecognize(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;
    const display = document.createElement('div');
    display.className = 'big-display number-big';
    display.textContent = String(round.number);
    content.appendChild(display);

    const grid = document.createElement('div');
    grid.className = 'number-options-grid';
    shuffle(round.counts).forEach((count) => {
        const group = document.createElement('button');
        group.className = 'number-option-group';
        group.setAttribute('aria-label', `${count} figuras`);
        for (let i = 0; i < count; i++) {
            const item = document.createElement('div');
            item.className = 'number-item';
            item.innerHTML = SHAPE_SVG[round.item] || SHAPE_SVG.star;
            group.appendChild(item);
        }
        group.onclick = async () => {
            soundClick();
            const isCorrect = count === round.correctCount;
            group.classList.add(isCorrect ? 'correct' : 'wrong');
            await showFeedback(isCorrect, isCorrect ? `Isso! Sao ${round.number}!` : 'Conte com cuidado!');
            if (isCorrect) speak(String(round.number));
            onAnswer(isCorrect);
        };
        grid.appendChild(group);
    });
    content.appendChild(grid);
}

// ---------- Fase 15/16: Somas e Subtracoes ----------
function renderMathOperation(ctx, round) {
    const { content, onAnswer, showFeedback } = ctx;

    const scene = document.createElement('div');
    scene.className = 'math-scene';

    const left = document.createElement('div');
    left.className = 'math-group';
    for (let i = 0; i < round.a; i++) {
        const it = document.createElement('div');
        it.className = 'math-item';
        it.innerHTML = SHAPE_SVG.heart;
        left.appendChild(it);
    }
    const opEl = document.createElement('div');
    opEl.className = 'math-op';
    opEl.textContent = round.op;

    const right = document.createElement('div');
    right.className = 'math-group' + (round.op === '-' ? ' math-strike' : '');
    for (let i = 0; i < round.b; i++) {
        const it = document.createElement('div');
        it.className = 'math-item';
        it.innerHTML = SHAPE_SVG.heart;
        right.appendChild(it);
    }

    scene.appendChild(left);
    scene.appendChild(opEl);
    scene.appendChild(right);
    content.appendChild(scene);

    const eq = document.createElement('div');
    eq.className = 'big-display math-equation';
    eq.textContent = `${round.a} ${round.op} ${round.b} = ?`;
    content.appendChild(eq);

    const options = document.createElement('div');
    options.className = 'options-grid';
    shuffle(round.options).forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn math-option';
        btn.textContent = String(opt);
        btn.onclick = async () => {
            soundClick();
            const isCorrect = opt === round.answer;
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            await showFeedback(isCorrect, isCorrect ? `Isso! Da ${round.answer}!` : 'Tente de novo!');
            if (isCorrect) speak(String(round.answer));
            onAnswer(isCorrect);
        };
        options.appendChild(btn);
    });
    content.appendChild(options);
}

export function renderMathAdd(ctx, round) { renderMathOperation(ctx, round); }
export function renderMathSub(ctx, round) { renderMathOperation(ctx, round); }

// Mapa fase.type → renderer, usado pelo engine.
export const ACTIVITY_RENDERERS = {
    'find-vowels':      renderFindLetters,
    'find-consonants':  renderFindLetters,
    'syllables':        renderSyllables,
    'build-word':       renderBuildWord,
    'read-match':       renderReadMatch,
    'fill-blank':       renderFillBlank,
    'type-word':        renderTypeWord,
    'build-sentence':   renderBuildSentence,
    'logical-sequence': renderLogicalSequence,
    'memory-game':      renderMemoryGame,
    'odd-one-out':      renderOddOneOut,
    'count-match':      renderCountMatch,
    'color-match':      renderColorMatch,
    'number-recognize': renderNumberRecognize,
    'math-add':         renderMathAdd,
    'math-sub':         renderMathSub,
};
