// Metadados das 75 fases (5 ilhas x 15 fases). As rodadas de cada tipo
// vivem em seus proprios modulos. Fases que nao tem pool dedicado reaproveitam
// um existente, e o tier (1=facil, 2=medio, 3=dificil) controla difficulty.

// IDs reservados:
//   1-15  -> Letras   (forest)
//   16-30 -> Numeros  (city)
//   31-45 -> Cores    (rainbow)
//   46-60 -> Silabas  (clouds)
//   61-75 -> Tesouro  (treasure)

const ISLAND_COLORS = {
    forest:   '#66BB6A',
    city:     '#42A5F5',
    rainbow:  '#FF7043',
    clouds:   '#9C27B0',
    treasure: '#FFB300',
};

// Helper: builda fase
const f = (id, title, subtitle, type, instruction, color) => ({ id, title, subtitle, color, type, instruction });

export const PHASES = [
    // ===== Ilha das Letras (forest, 1-15) =====
    f(1,  'Vogais',     'Encontre as Vogais',     'find-vowels',     'Toque em todas as VOGAIS!',           ISLAND_COLORS.forest),
    f(2,  'Consoantes', 'Descubra as Consoantes', 'find-consonants', 'Toque em todas as CONSOANTES!',       ISLAND_COLORS.forest),
    f(3,  'Silabas',    'Juntando Letrinhas',     'syllables',       'Qual silaba esta escrita?',            ISLAND_COLORS.forest),
    f(4,  'Palavras',   'Monte a Palavra',        'build-word',      'Arraste ou toque nas letras!',         ISLAND_COLORS.forest),
    f(5,  'Leitura',    'Leia e Encontre',        'read-match',      'Leia e toque na figura certa!',        ISLAND_COLORS.forest),
    f(6,  'Completar',  'Complete a Palavra',     'fill-blank',      'Qual letra esta faltando?',            ISLAND_COLORS.forest),
    f(7,  'Escrever',   'Escreva a Palavra',      'type-word',       'Digite o nome da figura!',             ISLAND_COLORS.forest),
    f(8,  'Frases',     'Monte a Frase',          'build-sentence',  'Toque as palavras na ordem certa!',    ISLAND_COLORS.forest),
    f(9,  'Sequencia',  'Sequencia Logica',       'logical-sequence','O que vem depois?',                    ISLAND_COLORS.forest),
    f(10, 'Memoria',    'Jogo da Memoria',        'memory-game',     'Encontre os pares!',                   ISLAND_COLORS.forest),
    f(11, 'Diferente',  'Qual e o Diferente?',    'odd-one-out',     'Qual nao pertence ao grupo?',          ISLAND_COLORS.forest),
    f(12, 'Palavras 2', 'Mais Palavras',          'build-word',      'Monte palavras maiores!',              ISLAND_COLORS.forest),
    f(13, 'Leitura 2',  'Mais Leitura',           'read-match',      'Encontre a figura!',                   ISLAND_COLORS.forest),
    f(14, 'Frases 2',   'Frases Maiores',         'build-sentence',  'Ordene as palavras!',                  ISLAND_COLORS.forest),
    f(15, 'Mestre',     'Desafio Final',          'type-word',       'Digite com cuidado!',                  ISLAND_COLORS.forest),

    // ===== Ilha dos Numeros (city, 16-30) =====
    f(16, 'Contar',     'Conte e Combine',        'count-match',     'Quantos voce ve?',                     ISLAND_COLORS.city),
    f(17, 'Numeros',    'Conte os Numeros',       'number-recognize','Qual grupo tem essa quantidade?',      ISLAND_COLORS.city),
    f(18, 'Somas',      'Vamos Somar!',           'math-add',        'Quanto da a soma?',                    ISLAND_COLORS.city),
    f(19, 'Subtracoes', 'Vamos Tirar!',           'math-sub',        'Quanto sobra?',                        ISLAND_COLORS.city),
    f(20, 'Contar 2',   'Mais Contagem',          'count-match',     'Conte com atencao!',                   ISLAND_COLORS.city),
    f(21, 'Somas 2',    'Somas Maiores',          'math-add',        'Some com cuidado!',                    ISLAND_COLORS.city),
    f(22, 'Subtracoes 2','Mais Subtracoes',       'math-sub',        'Conte o que sobra!',                   ISLAND_COLORS.city),
    f(23, 'Numeros 2',  'Reconhecer Numeros',     'number-recognize','Identifique a quantidade!',            ISLAND_COLORS.city),
    f(24, 'Contar 3',   'Quantidade Maior',       'count-match',     'Quantos sao?',                         ISLAND_COLORS.city),
    f(25, 'Somas 3',    'Soma Avancada',          'math-add',        'Calcule!',                             ISLAND_COLORS.city),
    f(26, 'Subtracoes 3','Subtracao Avancada',    'math-sub',        'Quanto fica?',                         ISLAND_COLORS.city),
    f(27, 'Numeros 3',  'Numeros Grandes',        'number-recognize','Encontre o grupo!',                    ISLAND_COLORS.city),
    f(28, 'Mate Mix',   'Somas Misturadas',       'math-add',        'Resolva!',                             ISLAND_COLORS.city),
    f(29, 'Mate Mix 2', 'Subtracoes Mix',         'math-sub',        'Resolva!',                             ISLAND_COLORS.city),
    f(30, 'Mestre Num', 'Desafio Numerico',       'count-match',     'Conte rapido!',                        ISLAND_COLORS.city),

    // ===== Ilha das Cores (rainbow, 31-45) =====
    f(31, 'Cores',      'Aprenda as Cores',       'color-match',     'Toque na cor certa!',                  ISLAND_COLORS.rainbow),
    f(32, 'Cores 2',    'Mais Cores',             'color-match',     'Reconheca a cor!',                     ISLAND_COLORS.rainbow),
    f(33, 'Cores 3',    'Cores Misturadas',       'color-match',     'Encontre a cor!',                      ISLAND_COLORS.rainbow),
    f(34, 'Cores 4',    'Tons Diferentes',        'color-match',     'Qual cor e essa?',                     ISLAND_COLORS.rainbow),
    f(35, 'Cores 5',    'Combinacoes',            'color-match',     'Combine as cores!',                    ISLAND_COLORS.rainbow),
    f(36, 'Cores 6',    'Arco-iris',              'color-match',     'Toque na cor!',                        ISLAND_COLORS.rainbow),
    f(37, 'Cores 7',    'Cores Frias',            'color-match',     'Cor fria!',                            ISLAND_COLORS.rainbow),
    f(38, 'Cores 8',    'Cores Quentes',          'color-match',     'Cor quente!',                          ISLAND_COLORS.rainbow),
    f(39, 'Cores 9',    'Tons Pastel',            'color-match',     'Pastel suave!',                        ISLAND_COLORS.rainbow),
    f(40, 'Cores 10',   'Cores Vibrantes',        'color-match',     'Cor forte!',                           ISLAND_COLORS.rainbow),
    f(41, 'Cores Mix',  'Mix Final',              'color-match',     'Cores misturadas!',                    ISLAND_COLORS.rainbow),
    f(42, 'Cores Mix 2','Desafio',                'color-match',     'Cores avancadas!',                     ISLAND_COLORS.rainbow),
    f(43, 'Cores Mix 3','Mais Desafio',           'color-match',     'Cor exata!',                           ISLAND_COLORS.rainbow),
    f(44, 'Cores Mix 4','Quase Mestre',           'color-match',     'Concentre-se!',                        ISLAND_COLORS.rainbow),
    f(45, 'Mestre Cor', 'Desafio Cromatico',      'color-match',     'Atencao na cor!',                      ISLAND_COLORS.rainbow),

    // ===== Ilha das Silabas (clouds, 46-60) =====
    f(46, 'BA BE BI',   'Sons da letra B',        'syllable-build',  'Junte as silabas!',                    ISLAND_COLORS.clouds),
    f(47, 'CA CE CI',   'Sons da letra C',        'syllable-build',  'Junte as silabas!',                    ISLAND_COLORS.clouds),
    f(48, 'MA ME MI',   'Sons da letra M',        'syllable-build',  'Junte as silabas!',                    ISLAND_COLORS.clouds),
    f(49, 'Mistas',     'Junte as silabas',       'syllable-build',  'Forme palavras!',                      ISLAND_COLORS.clouds),
    f(50, 'Silabas 2',  'Outra rodada',           'syllables',       'Qual silaba?',                         ISLAND_COLORS.clouds),
    f(51, 'Silabas 3',  'Mais silabas',           'syllables',       'Qual e?',                              ISLAND_COLORS.clouds),
    f(52, 'Silabas 4',  'Silabas dificeis',       'syllables',       'Concentre-se!',                        ISLAND_COLORS.clouds),
    f(53, 'Junte 2',    'Mais palavras',          'syllable-build',  'Junte as silabas!',                    ISLAND_COLORS.clouds),
    f(54, 'Junte 3',    'Palavras maiores',       'syllable-build',  'Forme a palavra!',                     ISLAND_COLORS.clouds),
    f(55, 'Silabas Mix','Mix de sons',            'syllables',       'Reconheca!',                           ISLAND_COLORS.clouds),
    f(56, 'Junte 4',    'Desafio das silabas',    'syllable-build',  'Forme a palavra!',                     ISLAND_COLORS.clouds),
    f(57, 'Silabas 5',  'Silabas finais',         'syllables',       'Ultima silaba!',                       ISLAND_COLORS.clouds),
    f(58, 'Junte 5',    'Mestre das silabas',     'syllable-build',  'Junte certo!',                         ISLAND_COLORS.clouds),
    f(59, 'Silabas 6',  'Quase la',               'syllables',       'Calma e foco!',                        ISLAND_COLORS.clouds),
    f(60, 'Mestre Sil', 'Desafio Silabico',       'syllable-build',  'Junte rapido!',                        ISLAND_COLORS.clouds),

    // ===== Ilha do Tesouro (treasure, 61-75) — desafios mistos =====
    f(61, 'Sequencia 2','Logica avancada',        'logical-sequence','Que vem depois?',                       ISLAND_COLORS.treasure),
    f(62, 'Memoria 2',  'Memoria 2',              'memory-game',     'Encontre os pares!',                    ISLAND_COLORS.treasure),
    f(63, 'Diferente 2','O Diferente',            'odd-one-out',     'Qual nao pertence?',                    ISLAND_COLORS.treasure),
    f(64, 'Frases Pro', 'Frase Pro',              'build-sentence',  'Ordene as palavras!',                   ISLAND_COLORS.treasure),
    f(65, 'Palavra Pro','Monte palavras',         'build-word',      'Forme a palavra!',                      ISLAND_COLORS.treasure),
    f(66, 'Leitura Pro','Le e descobre',          'read-match',      'Encontre a imagem!',                    ISLAND_COLORS.treasure),
    f(67, 'Mate Pro',   'Soma final',             'math-add',        'Resolva!',                              ISLAND_COLORS.treasure),
    f(68, 'Mate Pro 2', 'Subtracao final',        'math-sub',        'Resolva!',                              ISLAND_COLORS.treasure),
    f(69, 'Cor Pro',    'Cor final',              'color-match',     'Cor exata!',                            ISLAND_COLORS.treasure),
    f(70, 'Numeros Pro','Numero final',           'number-recognize','Quantidade exata!',                     ISLAND_COLORS.treasure),
    f(71, 'Boss Mem',   'Boss da Memoria',        'memory-game',     'Cuidado!',                              ISLAND_COLORS.treasure),
    f(72, 'Boss Logic', 'Boss da Logica',         'logical-sequence','Pense rapido!',                         ISLAND_COLORS.treasure),
    f(73, 'Boss Letras','Boss das Letras',        'type-word',       'Escreva certo!',                        ISLAND_COLORS.treasure),
    f(74, 'Boss Math',  'Boss da Matematica',     'math-add',        'Calcule rapido!',                       ISLAND_COLORS.treasure),
    f(75, 'Mestre',     'Mestre das Ilhas',       'syllable-build',  'Voce e Mestre!',                        ISLAND_COLORS.treasure),
];

export function phaseById(id) {
    return PHASES.find((p) => p.id === id);
}

// Quantas rodadas cada fase deve sortear por sessao.
// Tiers maiores tem um pouco mais de rodadas.
export const ROUNDS_PER_PHASE = {};
PHASES.forEach((p) => {
    ROUNDS_PER_PHASE[p.id] = (p.type === 'memory-game') ? 1 : 5;
});
