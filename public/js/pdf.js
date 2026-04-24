// Geração do PDF de prêmio. Depende do jsPDF carregado via <script> clássico no index.html.
// As funções draw* desenham ilustrações simples "para pintar" (linhas apenas, sem preenchimento).

import { saveState } from './state.js';

export function downloadPrizePDF(state, currentPhase) {
    const jspdf = window.jspdf;
    if (!jspdf || !jspdf.jsPDF) {
        alert('Conecte-se a internet para baixar o premio!');
        return;
    }
    const { jsPDF } = jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const playerName = ((state.playerName || '').trim() || 'GURI').toUpperCase();

    // Faixas tricolores da bandeira do RS nas bordas (vermelho / amarelo / verde)
    doc.setFillColor(229, 57, 53);
    doc.rect(0, 0, 210, 8, 'F');
    doc.setFillColor(255, 235, 59);
    doc.rect(0, 8, 210, 8, 'F');
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 16, 210, 8, 'F');
    doc.setFillColor(229, 57, 53);
    doc.rect(0, 273, 210, 8, 'F');
    doc.setFillColor(255, 235, 59);
    doc.rect(0, 281, 210, 8, 'F');
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 289, 210, 8, 'F');

    // Borda decorativa interna
    doc.setDrawColor(229, 57, 53);
    doc.setLineWidth(1.5);
    doc.rect(12, 30, 186, 240);
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.8);
    doc.rect(15, 33, 180, 234);
    [[20, 36], [190, 36], [20, 264], [190, 264]].forEach(([x, y]) => drawMiniStar(doc, x, y, 4));

    // Mini-logo EducaTche: livro aberto + estrela
    drawMiniLogo(doc, 105, 38);

    // Títulos
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(183, 28, 28);
    doc.text(`PARABENS ${playerName}`, 105, 48, { align: 'center' });
    doc.setFontSize(20);
    doc.setTextColor(46, 125, 50);
    doc.text('VOCE PASSOU DE FASE, TCHE!', 105, 62, { align: 'center' });
    if (currentPhase) {
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fase ${currentPhase.id}: ${currentPhase.subtitle}`, 105, 73, { align: 'center' });
    }

    // Desenho para colorir
    let drawIdx = Math.floor(Math.random() * PDF_DRAWINGS.length);
    if ((state.drawingsUsed || []).length < PDF_DRAWINGS.length) {
        while (state.drawingsUsed.includes(drawIdx)) {
            drawIdx = Math.floor(Math.random() * PDF_DRAWINGS.length);
        }
    }
    state.drawingsUsed.push(drawIdx);
    saveState(state);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    PDF_DRAWINGS[drawIdx](doc, 105, 165, 50);

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(183, 28, 28);
    doc.text('PINTE O SEU PREMIO GAUCHO!', 105, 240, { align: 'center' });

    doc.setDrawColor(229, 57, 53);
    for (let x = 20; x <= 190; x += 15) drawMiniStar(doc, x, 252, 2.5);

    const fileName = (state.playerName || 'guri').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    doc.save(`premio-${fileName}-fase-${currentPhase ? currentPhase.id : 0}.pdf`);
}

// Logo compacto para o topo do certificado (livro tricolor + estrela).
function drawMiniLogo(doc, cx, cy) {
    doc.setFillColor(255, 253, 231);
    doc.setDrawColor(183, 28, 28);
    doc.setLineWidth(0.6);
    pdfTriangle(doc, cx - 14, cy - 2, cx - 2, cy - 6, cx - 2, cy + 6, 'FD');
    doc.setDrawColor(46, 125, 50);
    pdfTriangle(doc, cx + 14, cy - 2, cx + 2, cy - 6, cx + 2, cy + 6, 'FD');
    doc.setFillColor(255, 235, 59);
    doc.rect(cx - 1.5, cy - 6, 3, 12, 'F');
    doc.setFillColor(255, 235, 59);
    doc.setDrawColor(245, 127, 23);
    drawMiniStar(doc, cx, cy - 10, 2.8);
}

function drawMiniStar(doc, cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 2) + (i * Math.PI / 5);
        const rad = i % 2 === 0 ? r : r * 0.4;
        pts.push([cx + Math.cos(a) * rad, cy - Math.sin(a) * rad]);
    }
    doc.setFillColor(255, 193, 7);
    doc.setDrawColor(255, 152, 0);
    const lines = [];
    for (let i = 1; i < pts.length; i++) lines.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
    lines.push([pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]]);
    doc.lines(lines, pts[0][0], pts[0][1], [1, 1], 'FD', true);
}

function pdfTriangle(doc, x1, y1, x2, y2, x3, y3, style) {
    doc.lines([[x2 - x1, y2 - y1], [x3 - x2, y3 - y2], [x1 - x3, y1 - y3]], x1, y1, [1, 1], style || 'S', true);
}

function drawStar(doc, cx, cy, size) {
    const r = size, pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI / 5); const rad = i % 2 === 0 ? r : r * 0.4; pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
    doc.setLineWidth(0.8);
    const lines = [];
    for (let i = 1; i < pts.length; i++) lines.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
    lines.push([pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]]);
    doc.lines(lines, pts[0][0], pts[0][1], [1, 1], 'S', true);
    doc.circle(cx - 8, cy - 8, 2, 'S');
    doc.circle(cx + 8, cy - 8, 2, 'S');
    const sp = [];
    for (let a = 0; a <= Math.PI; a += 0.3) sp.push([cx - 7 + 14 * (a / Math.PI), cy - 2 + Math.sin(a) * 5]);
    for (let i = 1; i < sp.length; i++) doc.line(sp[i - 1][0], sp[i - 1][1], sp[i][0], sp[i][1]);
}

function drawHouse(doc, cx, cy, size) {
    const w = size * 1.4, h = size * 1.0, x = cx - w / 2, y = cy - h / 2 + 10;
    doc.rect(x, y, w, h, 'S');
    pdfTriangle(doc, x - 8, y, cx, y - size * 0.7, x + w + 8, y, 'S');
    doc.rect(cx - 6, y + h - 22, 12, 22, 'S');
    doc.circle(cx + 3, y + h - 11, 1.5, 'S');
    doc.rect(x + 8, y + 10, 16, 14, 'S');
    doc.line(x + 16, y + 10, x + 16, y + 24);
    doc.line(x + 8, y + 17, x + 24, y + 17);
    doc.rect(x + w - 24, y + 10, 16, 14, 'S');
    doc.line(x + w - 16, y + 10, x + w - 16, y + 24);
    doc.line(x + w - 24, y + 17, x + w - 8, y + 17);
    doc.rect(cx + 12, y - size * 0.5, 8, size * 0.35, 'S');
}

function drawCat(doc, cx, cy, size) {
    const s = size * 0.6;
    doc.ellipse(cx, cy + s * 0.4, s * 0.8, s * 0.6, 'S');
    doc.circle(cx, cy - s * 0.5, s * 0.5, 'S');
    pdfTriangle(doc, cx - s * 0.4, cy - s * 0.8, cx - s * 0.15, cy - s * 1.3, cx - s * 0.05, cy - s * 0.8, 'S');
    pdfTriangle(doc, cx + s * 0.4, cy - s * 0.8, cx + s * 0.15, cy - s * 1.3, cx + s * 0.05, cy - s * 0.8, 'S');
    doc.circle(cx - s * 0.2, cy - s * 0.55, s * 0.06, 'F');
    doc.circle(cx + s * 0.2, cy - s * 0.55, s * 0.06, 'F');
    pdfTriangle(doc, cx - s * 0.06, cy - s * 0.38, cx, cy - s * 0.32, cx + s * 0.06, cy - s * 0.38, 'S');
    doc.line(cx - s * 0.5, cy - s * 0.45, cx - s * 0.15, cy - s * 0.4);
    doc.line(cx - s * 0.5, cy - s * 0.35, cx - s * 0.15, cy - s * 0.35);
    doc.line(cx + s * 0.5, cy - s * 0.45, cx + s * 0.15, cy - s * 0.4);
    doc.line(cx + s * 0.5, cy - s * 0.35, cx + s * 0.15, cy - s * 0.35);
    const tx = cx + s * 0.8;
    doc.line(tx, cy + s * 0.4, tx + s * 0.3, cy - s * 0.1);
    doc.line(tx + s * 0.3, cy - s * 0.1, tx + s * 0.1, cy - s * 0.3);
    doc.line(cx - s * 0.4, cy + s * 0.9, cx - s * 0.4, cy + s * 1.3);
    doc.line(cx - s * 0.15, cy + s * 0.9, cx - s * 0.15, cy + s * 1.3);
    doc.line(cx + s * 0.15, cy + s * 0.9, cx + s * 0.15, cy + s * 1.3);
    doc.line(cx + s * 0.4, cy + s * 0.9, cx + s * 0.4, cy + s * 1.3);
}

function drawFlower(doc, cx, cy, size) {
    const r = size * 0.18;
    for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2 / 6) - Math.PI / 2;
        doc.circle(cx + Math.cos(a) * size * 0.3, cy - size * 0.2 + Math.sin(a) * size * 0.3, r, 'S');
    }
    doc.circle(cx, cy - size * 0.2, r * 0.7, 'S');
    doc.setLineWidth(1.2);
    doc.line(cx, cy + r, cx, cy + size);
    doc.setLineWidth(0.6);
    doc.ellipse(cx - size * 0.2, cy + size * 0.5, size * 0.15, size * 0.06, 'S');
    doc.ellipse(cx + size * 0.2, cy + size * 0.35, size * 0.15, size * 0.06, 'S');
}

function drawSun(doc, cx, cy, size) {
    const r = size * 0.4;
    doc.circle(cx, cy, r, 'S');
    for (let i = 0; i < 12; i++) {
        const a = i * Math.PI * 2 / 12;
        doc.line(cx + Math.cos(a) * (r + 4), cy + Math.sin(a) * (r + 4), cx + Math.cos(a) * (r + size * 0.4), cy + Math.sin(a) * (r + size * 0.4));
    }
    doc.circle(cx - r * 0.3, cy - r * 0.2, r * 0.1, 'F');
    doc.circle(cx + r * 0.3, cy - r * 0.2, r * 0.1, 'F');
    const sp = [];
    for (let a = 0; a <= Math.PI; a += 0.3) sp.push([cx - r * 0.3 + r * 0.6 * (a / Math.PI), cy + r * 0.1 + Math.sin(a) * r * 0.25]);
    for (let i = 1; i < sp.length; i++) doc.line(sp[i - 1][0], sp[i - 1][1], sp[i][0], sp[i][1]);
}

function drawHeart(doc, cx, cy, size) {
    const s = size * 0.9, pts = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        pts.push([
            cx + 16 * Math.pow(Math.sin(t), 3) * s / 18,
            cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s / 18 - 5,
        ]);
    }
    for (let i = 1; i < pts.length; i++) doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    doc.line(pts[pts.length - 1][0], pts[pts.length - 1][1], pts[0][0], pts[0][1]);
}

function drawButterfly(doc, cx, cy, size) {
    const s = size * 0.5;
    doc.ellipse(cx, cy, s * 0.12, s * 0.6, 'S');
    doc.line(cx - 2, cy - s * 0.6, cx - s * 0.4, cy - s * 1.0);
    doc.circle(cx - s * 0.4, cy - s * 1.0, 1.5, 'S');
    doc.line(cx + 2, cy - s * 0.6, cx + s * 0.4, cy - s * 1.0);
    doc.circle(cx + s * 0.4, cy - s * 1.0, 1.5, 'S');
    doc.ellipse(cx - s * 0.55, cy - s * 0.25, s * 0.5, s * 0.45, 'S');
    doc.ellipse(cx + s * 0.55, cy - s * 0.25, s * 0.5, s * 0.45, 'S');
    doc.ellipse(cx - s * 0.4, cy + s * 0.35, s * 0.35, s * 0.3, 'S');
    doc.ellipse(cx + s * 0.4, cy + s * 0.35, s * 0.35, s * 0.3, 'S');
    doc.circle(cx - s * 0.55, cy - s * 0.25, s * 0.15, 'S');
    doc.circle(cx + s * 0.55, cy - s * 0.25, s * 0.15, 'S');
    doc.circle(cx - s * 0.4, cy + s * 0.35, s * 0.1, 'S');
    doc.circle(cx + s * 0.4, cy + s * 0.35, s * 0.1, 'S');
}

function drawTree(doc, cx, cy, size) {
    const s = size;
    doc.rect(cx - s * 0.1, cy + s * 0.1, s * 0.2, s * 0.6, 'S');
    doc.circle(cx, cy - s * 0.3, s * 0.35, 'S');
    doc.circle(cx - s * 0.3, cy, s * 0.3, 'S');
    doc.circle(cx + s * 0.3, cy, s * 0.3, 'S');
    doc.circle(cx, cy + s * 0.05, s * 0.28, 'S');
    doc.circle(cx - s * 0.15, cy - s * 0.15, 2.5, 'S');
    doc.circle(cx + s * 0.2, cy, 2.5, 'S');
    doc.circle(cx - s * 0.05, cy + s * 0.1, 2.5, 'S');
    doc.line(cx - s * 0.6, cy + s * 0.7, cx + s * 0.6, cy + s * 0.7);
}

function drawFish(doc, cx, cy, size) {
    const s = size * 0.6;
    doc.ellipse(cx, cy, s * 0.8, s * 0.45, 'S');
    pdfTriangle(doc, cx + s * 0.7, cy, cx + s * 1.2, cy - s * 0.4, cx + s * 1.2, cy + s * 0.4, 'S');
    doc.circle(cx - s * 0.35, cy - s * 0.1, s * 0.1, 'S');
    doc.circle(cx - s * 0.33, cy - s * 0.1, s * 0.04, 'F');
    for (let i = 0; i < 3; i++) doc.ellipse(cx - s * 0.15 + i * s * 0.25, cy, s * 0.12, s * 0.2, 'S');
    pdfTriangle(doc, cx - s * 0.1, cy - s * 0.45, cx + s * 0.1, cy - s * 0.75, cx + s * 0.2, cy - s * 0.45, 'S');
    pdfTriangle(doc, cx - s * 0.1, cy + s * 0.45, cx + s * 0.1, cy + s * 0.65, cx + s * 0.2, cy + s * 0.45, 'S');
    doc.line(cx - s * 0.75, cy + s * 0.05, cx - s * 0.6, cy);
    doc.line(cx - s * 0.75, cy + s * 0.05, cx - s * 0.6, cy + s * 0.1);
}

function drawCar(doc, cx, cy, size) {
    const s = size * 0.7;
    doc.rect(cx - s, cy - s * 0.2, s * 2, s * 0.6, 'S');
    const cabX = cx - s * 0.5;
    doc.line(cabX, cy - s * 0.2, cabX + s * 0.2, cy - s * 0.7);
    doc.line(cabX + s * 0.2, cy - s * 0.7, cabX + s * 0.8, cy - s * 0.7);
    doc.line(cabX + s * 0.8, cy - s * 0.7, cabX + s * 1.0, cy - s * 0.2);
    doc.rect(cabX + s * 0.25, cy - s * 0.65, s * 0.22, s * 0.38, 'S');
    doc.rect(cabX + s * 0.52, cy - s * 0.65, s * 0.3, s * 0.38, 'S');
    doc.circle(cx - s * 0.55, cy + s * 0.4, s * 0.25, 'S');
    doc.circle(cx - s * 0.55, cy + s * 0.4, s * 0.12, 'S');
    doc.circle(cx + s * 0.55, cy + s * 0.4, s * 0.25, 'S');
    doc.circle(cx + s * 0.55, cy + s * 0.4, s * 0.12, 'S');
    doc.rect(cx + s - 2, cy - s * 0.1, 4, s * 0.15, 'S');
    doc.rect(cx - s - 2, cy - s * 0.1, 4, s * 0.15, 'S');
}

// Desenhos inspirados no RS: pinheiro-do-parana, chimarrao, cavalo crioulo.
function drawPinheiro(doc, cx, cy, size) {
    const s = size;
    doc.rect(cx - s * 0.12, cy + s * 0.3, s * 0.24, s * 0.7, 'S');
    doc.line(cx - s * 0.7, cy + s * 0.2, cx + s * 0.7, cy + s * 0.2);
    doc.line(cx - s * 0.7, cy + s * 0.2, cx, cy - s * 0.3);
    doc.line(cx + s * 0.7, cy + s * 0.2, cx, cy - s * 0.3);
    doc.line(cx - s * 0.55, cy - s * 0.05, cx, cy - s * 0.55);
    doc.line(cx + s * 0.55, cy - s * 0.05, cx, cy - s * 0.55);
    doc.line(cx - s * 0.4, cy - s * 0.3, cx, cy - s * 0.75);
    doc.line(cx + s * 0.4, cy - s * 0.3, cx, cy - s * 0.75);
    doc.circle(cx - s * 0.25, cy + s * 0.15, s * 0.05, 'S');
    doc.circle(cx + s * 0.15, cy - s * 0.1, s * 0.05, 'S');
    doc.circle(cx + s * 0.1, cy - s * 0.45, s * 0.05, 'S');
    doc.line(cx - s * 0.8, cy + s * 1.0, cx + s * 0.8, cy + s * 1.0);
}

function drawChimarrao(doc, cx, cy, size) {
    const s = size * 0.8;
    doc.ellipse(cx, cy + s * 0.15, s * 0.45, s * 0.55, 'S');
    doc.ellipse(cx, cy - s * 0.3, s * 0.3, s * 0.1, 'S');
    doc.rect(cx - s * 0.26, cy - s * 0.3, s * 0.52, s * 0.15, 'S');
    doc.rect(cx + s * 0.08, cy - s * 0.9, s * 0.08, s * 0.65, 'S');
    doc.ellipse(cx + s * 0.12, cy - s * 0.92, s * 0.08, s * 0.04, 'S');
    for (let i = 0; i < 4; i++) {
        doc.ellipse(cx - s * 0.35 + i * s * 0.22, cy + s * 0.3, s * 0.05, s * 0.08, 'S');
    }
    doc.circle(cx - s * 0.15, cy + s * 0.1, s * 0.04, 'S');
    doc.circle(cx + s * 0.1, cy - s * 0.05, s * 0.04, 'S');
    doc.circle(cx + s * 0.2, cy + s * 0.2, s * 0.04, 'S');
}

function drawCavalo(doc, cx, cy, size) {
    const s = size * 0.9;
    doc.ellipse(cx, cy + s * 0.1, s * 0.55, s * 0.25, 'S');
    doc.ellipse(cx - s * 0.55, cy - s * 0.15, s * 0.12, s * 0.22, 'S');
    doc.line(cx - s * 0.6, cy - s * 0.35, cx - s * 0.6, cy - s * 0.5);
    doc.line(cx - s * 0.5, cy - s * 0.35, cx - s * 0.5, cy - s * 0.5);
    pdfTriangle(doc, cx - s * 0.67, cy - s * 0.35, cx - s * 0.6, cy - s * 0.5, cx - s * 0.53, cy - s * 0.38, 'S');
    pdfTriangle(doc, cx - s * 0.57, cy - s * 0.35, cx - s * 0.5, cy - s * 0.5, cx - s * 0.43, cy - s * 0.38, 'S');
    doc.circle(cx - s * 0.6, cy - s * 0.18, s * 0.03, 'F');
    doc.line(cx - s * 0.4, cy - s * 0.3, cx - s * 0.15, cy - s * 0.05);
    doc.line(cx - s * 0.3, cy - s * 0.35, cx - s * 0.1, cy - s * 0.1);
    doc.line(cx - s * 0.42, cy, cx - s * 0.42, cy + s * 0.5);
    doc.line(cx - s * 0.22, cy + s * 0.1, cx - s * 0.22, cy + s * 0.5);
    doc.line(cx + s * 0.2, cy + s * 0.1, cx + s * 0.2, cy + s * 0.5);
    doc.line(cx + s * 0.4, cy + s * 0.1, cx + s * 0.4, cy + s * 0.5);
    doc.line(cx + s * 0.5, cy, cx + s * 0.8, cy - s * 0.1);
    doc.line(cx + s * 0.55, cy + s * 0.1, cx + s * 0.85, cy + s * 0.05);
    doc.line(cx - s * 0.8, cy + s * 0.55, cx + s * 0.8, cy + s * 0.55);
}

const PDF_DRAWINGS = [drawStar, drawHouse, drawCat, drawFlower, drawSun, drawHeart, drawButterfly, drawTree, drawFish, drawCar, drawPinheiro, drawChimarrao, drawCavalo];
