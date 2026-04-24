// Fases 9-12 — Raciocínio lógico.

// ========== FASE 9: Sequência Lógica ==========
// type: 'letter' | 'number' | 'shape'
export const SEQUENCE_ROUNDS = [
    // level 1 (padrões simples)
    { id: 'sq-ab',       sequence: ['A','B','A','B'],                answer: 'A',  options: ['A','C','B'],          type: 'letter', level: 1 },
    { id: 'sq-1234',     sequence: ['1','2','3','4'],                answer: '5',  options: ['5','7','3'],          type: 'number', level: 1 },
    { id: 'sq-cs',       sequence: ['circle','square','circle','square'], answer: 'circle', options: ['circle','triangle','square'], type: 'shape',  level: 1 },
    { id: 'sq-abcd',     sequence: ['A','B','C','D'],                answer: 'E',  options: ['E','A','F'],          type: 'letter', level: 1 },
    { id: 'sq-12',       sequence: ['1','2','1','2'],                answer: '1',  options: ['1','3','2'],          type: 'number', level: 1 },
    { id: 'sq-stars',    sequence: ['star','star','circle','star','star'], answer: 'circle', options: ['circle','star','triangle'], type: 'shape',  level: 1 },
    { id: 'sq-tc',       sequence: ['triangle','circle','triangle','circle'], answer: 'triangle', options: ['triangle','square','circle'], type: 'shape', level: 1 },
    { id: 'sq-246',      sequence: ['2','4','6','8'],                answer: '10', options: ['10','9','12'],        type: 'number', level: 1 },
    { id: 'sq-135',      sequence: ['1','3','5','7'],                answer: '9',  options: ['9','8','11'],         type: 'number', level: 1 },
    { id: 'sq-aabb',     sequence: ['A','A','B','B','A','A'],        answer: 'B',  options: ['B','C','A'],          type: 'letter', level: 1 },
    // level 2 (padrões mais complexos)
    { id: 'sq-abc-abc',  sequence: ['A','B','C','A','B'],            answer: 'C',  options: ['C','D','A'],          type: 'letter', level: 2 },
    { id: 'sq-fib-ish',  sequence: ['1','2','3','5','8'],            answer: '13', options: ['13','10','16'],       type: 'number', level: 2 },
    { id: 'sq-count-3',  sequence: ['3','6','9','12'],               answer: '15', options: ['15','14','18'],       type: 'number', level: 2 },
    { id: 'sq-count-5',  sequence: ['5','10','15','20'],             answer: '25', options: ['25','22','30'],       type: 'number', level: 2 },
    { id: 'sq-rev-abcd', sequence: ['D','C','B','A'],                answer: 'Z',  options: ['Z','E','A'],          type: 'letter', level: 2 },
    { id: 'sq-mixed',    sequence: ['star','diamond','heart','star','diamond'], answer: 'heart', options: ['heart','star','circle'], type: 'shape', level: 2 },
    { id: 'sq-skip-2',   sequence: ['A','C','E','G'],                answer: 'I',  options: ['I','H','J'],          type: 'letter', level: 2 },
    { id: 'sq-dec',      sequence: ['10','8','6','4'],               answer: '2',  options: ['2','3','1'],          type: 'number', level: 2 },
    { id: 'sq-tri-sq',   sequence: ['triangle','triangle','square','triangle','triangle'], answer: 'square', options: ['square','triangle','circle'], type: 'shape', level: 2 },
    { id: 'sq-hd',       sequence: ['heart','diamond','heart','diamond'], answer: 'heart', options: ['heart','star','diamond'], type: 'shape', level: 2 },
];

// ========== FASE 10: Jogo da Memória ==========
// Cada rodada é uma lista de pares palavra/imagem. O nível controla o número de pares.
export const MEMORY_ROUNDS = [
    { id: 'mem-basic-1', level: 1, pairs: [
        { word: 'GATO', image: 'gato' }, { word: 'BOLA', image: 'bola' },
        { word: 'SOL',  image: 'sol'  }, { word: 'LUA',  image: 'lua' },
    ]},
    { id: 'mem-basic-2', level: 1, pairs: [
        { word: 'CASA', image: 'casa' }, { word: 'PEIXE', image: 'peixe' },
        { word: 'FLOR', image: 'flor' }, { word: 'PATO',  image: 'pato'  },
    ]},
    { id: 'mem-basic-3', level: 1, pairs: [
        { word: 'SAPO', image: 'sapo' }, { word: 'MESA', image: 'mesa' },
        { word: 'CARRO', image: 'carro' }, { word: 'ESTRELA', image: 'estrela' },
    ]},
    { id: 'mem-basic-4', level: 1, pairs: [
        { word: 'RATO', image: 'rato' }, { word: 'UVA',  image: 'uva'  },
        { word: 'OVO',  image: 'ovo'  }, { word: 'PAO',  image: 'pao'  },
    ]},
    { id: 'mem-basic-5', level: 1, pairs: [
        { word: 'CAO',  image: 'cao'  }, { word: 'BANANA', image: 'banana' },
        { word: 'MACA', image: 'maca' }, { word: 'LIVRO',  image: 'livro'  },
    ]},
    // Level 2: 6 pares
    { id: 'mem-hard-1', level: 2, pairs: [
        { word: 'GATO', image: 'gato' }, { word: 'PATO', image: 'pato' },
        { word: 'CASA', image: 'casa' }, { word: 'SOL',  image: 'sol'  },
        { word: 'LUA',  image: 'lua'  }, { word: 'FLOR', image: 'flor' },
    ]},
    { id: 'mem-hard-2', level: 2, pairs: [
        { word: 'PEIXE', image: 'peixe' }, { word: 'SAPO', image: 'sapo' },
        { word: 'RATO',  image: 'rato'  }, { word: 'UVA',  image: 'uva'  },
        { word: 'BOLA',  image: 'bola'  }, { word: 'ESTRELA', image: 'estrela' },
    ]},
    { id: 'mem-hard-3', level: 2, pairs: [
        { word: 'CARRO',  image: 'carro'  }, { word: 'LIVRO', image: 'livro' },
        { word: 'MESA',   image: 'mesa'   }, { word: 'CAMA',  image: 'cama'  },
        { word: 'JANELA', image: 'janela' }, { word: 'ESCOLA', image: 'escola' },
    ]},
    { id: 'mem-hard-4', level: 2, pairs: [
        { word: 'BOLO', image: 'bolo' }, { word: 'PAO',    image: 'pao'    },
        { word: 'OVO',  image: 'ovo'  }, { word: 'QUEIJO', image: 'queijo' },
        { word: 'BANANA', image: 'banana' }, { word: 'PIPOCA', image: 'pipoca' },
    ]},
];

// ========== FASE 11: Qual é o diferente? ==========
export const ODD_ONE_OUT_ROUNDS = [
    // level 1
    { id: 'odd-animais-1', items: ['gato','pato','sapo','casa'],     labels: ['Gato','Pato','Sapo','Casa'], oddIdx: 3, category: 'animais', level: 1 },
    { id: 'odd-ceu',       items: ['sol','lua','estrela','mesa'],    labels: ['Sol','Lua','Estrela','Mesa'], oddIdx: 3, category: 'ceu', level: 1 },
    { id: 'odd-obj',       items: ['bola','carro','peixe','flor'],   labels: ['Bola','Carro','Peixe','Flor'], oddIdx: 2, category: 'nao e objeto', level: 1 },
    { id: 'odd-familia',   items: ['pai','mae','avo','sapo'],        labels: ['Pai','Mae','Avo','Sapo'], oddIdx: 3, category: 'familia', level: 1 },
    { id: 'odd-feito',     items: ['casa','mesa','flor','carro'],    labels: ['Casa','Mesa','Flor','Carro'], oddIdx: 2, category: 'feitos pelo homem', level: 1 },
    { id: 'odd-redondos',  items: ['bola','ovo','sol','mesa'],       labels: ['Bola','Ovo','Sol','Mesa'], oddIdx: 3, category: 'redondos', level: 1 },
    { id: 'odd-comida-1',  items: ['pao','bolo','queijo','carro'],   labels: ['Pao','Bolo','Queijo','Carro'], oddIdx: 3, category: 'comida', level: 1 },
    { id: 'odd-fruta-1',   items: ['uva','banana','maca','gato'],    labels: ['Uva','Banana','Maca','Gato'], oddIdx: 3, category: 'frutas', level: 1 },
    { id: 'odd-agua',      items: ['peixe','sapo','pato','rato'],    labels: ['Peixe','Sapo','Pato','Rato'], oddIdx: 3, category: 'vivem na agua', level: 1 },

    // level 2 (categorias mais sutis)
    { id: 'odd-doces',     items: ['bolo','pipoca','pao','queijo'],  labels: ['Bolo','Pipoca','Pao','Queijo'], oddIdx: 0, category: 'o unico doce', level: 2 },
    { id: 'odd-animais-2', items: ['cao','gato','peixe','carro'],    labels: ['Cao','Gato','Peixe','Carro'], oddIdx: 3, category: 'animais', level: 2 },
    { id: 'odd-mov',       items: ['carro','bola','casa','pipa'],    labels: ['Carro','Bola','Casa','Pipa'], oddIdx: 2, category: 'nao se move', level: 2 },
    { id: 'odd-vivos',     items: ['flor','arvore','gato','mesa'],   labels: ['Flor','Arvore','Gato','Mesa'], oddIdx: 3, category: 'seres vivos', level: 2 },
    { id: 'odd-peq',       items: ['rato','uva','ovo','casa'],       labels: ['Rato','Uva','Ovo','Casa'], oddIdx: 3, category: 'pequenos', level: 2 },
    { id: 'odd-corpo',     items: ['mao','pe','olho','sapato'],      labels: ['Mao','Pe','Olho','Sapato'], oddIdx: 3, category: 'partes do corpo', level: 2 },
    { id: 'odd-roupa',     items: ['chapeu','sapato','janela','pe'], labels: ['Chapeu','Sapato','Janela','Pe'], oddIdx: 2, category: 'coisas que usamos', level: 2 },
];

// ========== FASE 12: Conte e Combine ==========
// As opções devem incluir a resposta correta.
export const COUNT_MATCH_ROUNDS = [
    // level 1 (1-5)
    { id: 'ct-estrela-3', image: 'estrela', count: 3, options: ['1','2','3'], word: 'TRES',   level: 1 },
    { id: 'ct-bola-2',    image: 'bola',    count: 2, options: ['2','4','5'], word: 'DOIS',   level: 1 },
    { id: 'ct-flor-5',    image: 'flor',    count: 5, options: ['3','5','4'], word: 'CINCO',  level: 1 },
    { id: 'ct-gato-1',    image: 'gato',    count: 1, options: ['1','3','2'], word: 'UM',     level: 1 },
    { id: 'ct-peixe-4',   image: 'peixe',   count: 4, options: ['2','4','6'], word: 'QUATRO', level: 1 },
    { id: 'ct-sol-2',     image: 'sol',     count: 2, options: ['1','2','3'], word: 'DOIS',   level: 1 },
    { id: 'ct-uva-3',     image: 'uva',     count: 3, options: ['2','3','5'], word: 'TRES',   level: 1 },
    { id: 'ct-maca-4',    image: 'maca',    count: 4, options: ['3','4','6'], word: 'QUATRO', level: 1 },
    { id: 'ct-banana-5',  image: 'banana',  count: 5, options: ['4','5','6'], word: 'CINCO',  level: 1 },
    { id: 'ct-ovo-1',     image: 'ovo',     count: 1, options: ['1','2','3'], word: 'UM',     level: 1 },
    { id: 'ct-lua-2',     image: 'lua',     count: 2, options: ['1','2','3'], word: 'DOIS',   level: 1 },

    // level 2 (6-10, operações simples)
    { id: 'ct-estrela-7', image: 'estrela', count: 7, options: ['6','7','8'], word: 'SETE',   level: 2 },
    { id: 'ct-bola-6',    image: 'bola',    count: 6, options: ['5','6','8'], word: 'SEIS',   level: 2 },
    { id: 'ct-flor-8',    image: 'flor',    count: 8, options: ['7','8','9'], word: 'OITO',   level: 2 },
    { id: 'ct-peixe-9',   image: 'peixe',   count: 9, options: ['8','9','10'], word: 'NOVE',  level: 2 },
    { id: 'ct-uva-10',    image: 'uva',     count: 10, options: ['9','10','12'], word: 'DEZ', level: 2 },
    { id: 'ct-sol-6',     image: 'sol',     count: 6, options: ['4','5','6'], word: 'SEIS',   level: 2 },
    { id: 'ct-maca-7',    image: 'maca',    count: 7, options: ['5','7','9'], word: 'SETE',   level: 2 },
    { id: 'ct-ovo-8',     image: 'ovo',     count: 8, options: ['6','7','8'], word: 'OITO',   level: 2 },
    // "Quantos no total?" (3+2, 4+1 etc.)
    { id: 'ct-sum-3-2',   image: 'estrela', count: 5, options: ['4','5','6'], word: 'CINCO',  level: 2, prompt: 'Quantos ao todo?' },
    { id: 'ct-sum-4-2',   image: 'flor',    count: 6, options: ['5','6','7'], word: 'SEIS',   level: 2, prompt: 'Quantos ao todo?' },
];
