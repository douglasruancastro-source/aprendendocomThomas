// Metadados das 12 fases. As rodadas de cada tipo vivem em seus próprios módulos.

export const PHASES = [
    { id: 1,  title: 'Vogais',     subtitle: 'Encontre as Vogais',     color: '#EF5350', type: 'find-vowels',      instruction: 'Toque em todas as VOGAIS!' },
    { id: 2,  title: 'Consoantes', subtitle: 'Descubra as Consoantes', color: '#42A5F5', type: 'find-consonants',  instruction: 'Toque em todas as CONSOANTES!' },
    { id: 3,  title: 'Silabas',    subtitle: 'Juntando Letrinhas',     color: '#66BB6A', type: 'syllables',        instruction: 'Qual silaba esta escrita?' },
    { id: 4,  title: 'Palavras',   subtitle: 'Monte a Palavra',        color: '#FFA726', type: 'build-word',       instruction: 'Arraste ou toque nas letras na ordem certa!' },
    { id: 5,  title: 'Leitura',    subtitle: 'Leia e Encontre',        color: '#AB47BC', type: 'read-match',       instruction: 'Leia a palavra e toque na figura certa!' },
    { id: 6,  title: 'Completar',  subtitle: 'Complete a Palavra',     color: '#26A69A', type: 'fill-blank',       instruction: 'Qual letra esta faltando?' },
    { id: 7,  title: 'Escrever',   subtitle: 'Escreva a Palavra',      color: '#5C6BC0', type: 'type-word',        instruction: 'Digite o nome da figura!' },
    { id: 8,  title: 'Frases',     subtitle: 'Monte a Frase',          color: '#EC407A', type: 'build-sentence',   instruction: 'Toque as palavras na ordem certa!' },
    { id: 9,  title: 'Sequencia',  subtitle: 'Sequencia Logica',       color: '#FF8A65', type: 'logical-sequence', instruction: 'O que vem depois?' },
    { id: 10, title: 'Memoria',    subtitle: 'Jogo da Memoria',        color: '#7E57C2', type: 'memory-game',      instruction: 'Encontre os pares!' },
    { id: 11, title: 'Diferente',  subtitle: 'Qual e o Diferente?',    color: '#29B6F6', type: 'odd-one-out',      instruction: 'Qual nao pertence ao grupo?' },
    { id: 12, title: 'Contar',     subtitle: 'Conte e Combine',        color: '#8D6E63', type: 'count-match',      instruction: 'Quantos voce ve?' },
    { id: 13, title: 'Cores',      subtitle: 'Aprenda as Cores',       color: '#E53935', type: 'color-match',      instruction: 'Toque na cor certa!' },
    { id: 14, title: 'Numeros',    subtitle: 'Conte os Numeros',       color: '#1E88E5', type: 'number-recognize', instruction: 'Qual grupo tem essa quantidade?' },
    { id: 15, title: 'Somas',      subtitle: 'Vamos Somar!',           color: '#43A047', type: 'math-add',         instruction: 'Quanto da a soma?' },
    { id: 16, title: 'Subtracoes', subtitle: 'Vamos Tirar!',           color: '#FB8C00', type: 'math-sub',         instruction: 'Quanto sobra?' },
];

export function phaseById(id) {
    return PHASES.find((p) => p.id === id);
}

// Quantas rodadas cada fase deve sortear por sessão.
export const ROUNDS_PER_PHASE = {
    1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 6, 7: 6, 8: 5, 9: 6, 10: 3, 11: 6, 12: 6,
    13: 6, 14: 6, 15: 6, 16: 6,
};
