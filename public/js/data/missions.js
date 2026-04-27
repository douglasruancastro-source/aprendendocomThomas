// Definicoes do pool de missoes diarias (Fase 9.17).
// Cada missao tem:
//   id          - identificador estavel (usado nas mutacoes de progresso)
//   icon        - emoji
//   label       - texto curto pra UI ("Acerte 20 perguntas")
//   target      - quantos eventos sao necessarios pra concluir
//   eventType   - chave usada em updateMissionProgress() para incrementar:
//                 'correctAnswer' | 'completePhase' | 'perfectPhase' | 'streakReached' | 'coinEarned' | 'islandPhase:<islandId>'
//   reward      - moedas concedidas no claim
//
// As missoes tambem definem `id` curto pra cache no state.

export const MISSION_POOL = [
    // ===== Faceis =====
    { id: 'm-correct-10',    icon: '\u{2705}', label: 'Acerte 10 perguntas',         target: 10,  eventType: 'correctAnswer', reward: 150 },
    { id: 'm-correct-25',    icon: '\u{2705}', label: 'Acerte 25 perguntas',         target: 25,  eventType: 'correctAnswer', reward: 300 },
    { id: 'm-phase-2',       icon: '\u{1F3C1}', label: 'Complete 2 fases',           target: 2,   eventType: 'completePhase', reward: 200 },
    { id: 'm-phase-5',       icon: '\u{1F3C1}', label: 'Complete 5 fases',           target: 5,   eventType: 'completePhase', reward: 400 },
    { id: 'm-streak-5',      icon: '\u{1F525}', label: 'Faca um combo de 5',         target: 1,   eventType: 'streakReached', reward: 200, threshold: 5 },
    { id: 'm-streak-7',      icon: '\u{1F525}', label: 'Faca um combo de 7',         target: 1,   eventType: 'streakReached', reward: 350, threshold: 7 },
    { id: 'm-perfect-1',     icon: '\u{1F4AF}', label: 'Tire 100% em uma fase',      target: 1,   eventType: 'perfectPhase',  reward: 250 },
    { id: 'm-perfect-3',     icon: '\u{1F4AF}', label: 'Tire 100% em 3 fases',       target: 3,   eventType: 'perfectPhase',  reward: 500 },
    { id: 'm-coins-200',     icon: '\u{1FA99}', label: 'Ganhe 200 moedas hoje',      target: 200, eventType: 'coinEarned',    reward: 150 },
    { id: 'm-coins-500',     icon: '\u{1FA99}', label: 'Ganhe 500 moedas hoje',      target: 500, eventType: 'coinEarned',    reward: 300 },
    // ===== Por ilha =====
    { id: 'm-letters-2',     icon: '\u{1F4DA}', label: '2 fases na Ilha das Letras',  target: 2,  eventType: 'islandPhase:forest',  reward: 200 },
    { id: 'm-numbers-2',     icon: '\u{1F522}', label: '2 fases na Ilha dos Numeros', target: 2,  eventType: 'islandPhase:city',    reward: 200 },
    { id: 'm-colors-2',      icon: '\u{1F308}', label: '2 fases na Ilha das Cores',   target: 2,  eventType: 'islandPhase:rainbow', reward: 200 },
    { id: 'm-syllables-2',   icon: '\u{1F388}', label: '2 fases nas Silabas',         target: 2,  eventType: 'islandPhase:clouds',  reward: 200 },
];

export function missionById(id) {
    return MISSION_POOL.find((m) => m.id === id) || null;
}
