// Sampling Parameter Explorer - p5.js
// CANVAS_HEIGHT: 620
// Bloom Level: Apply (L3) - demonstrate
// LO: Demonstrate how temperature and top-p modify a fixed token probability distribution.

let canvas;
const cw = 800, ch = 620;
let containerW;
let tempSlider, topPSlider, sample1Btn, sample100Btn, resetBtn;

const TOKENS = [
    { tok: 'tree',     base: 0.45 },
    { tok: 'bamboo',   base: 0.20 },
    { tok: 'branch',   base: 0.10 },
    { tok: 'rock',     base: 0.07 },
    { tok: 'fence',    base: 0.05 },
    { tok: 'ladder',   base: 0.05 },
    { tok: 'stairs',   base: 0.04 },
    { tok: 'wall',     base: 0.02 },
    { tok: 'roof',     base: 0.01 },
    { tok: 'mountain', base: 0.01 }
];
let lastSampled = -1;
let sampleCounts = new Array(TOKENS.length).fill(0);
let sampleN = 0;

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    containerW = Math.max(360, Math.min(el.clientWidth, cw));
}
function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerW, ch);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');
    tempSlider = createSlider(0, 2, 1, 0.05);
    tempSlider.parent(document.querySelector('main')); tempSlider.style('width', '300px');
    topPSlider = createSlider(0, 1, 1, 0.05);
    topPSlider.parent(document.querySelector('main')); topPSlider.style('width', '300px');
    sample1Btn = createButton('Sample 1 token');
    sample1Btn.parent(document.querySelector('main'));
    sample1Btn.mousePressed(() => { lastSampled = sampleOne(); sampleCounts[lastSampled]++; sampleN++; });
    sample100Btn = createButton('Sample 100 times');
    sample100Btn.parent(document.querySelector('main'));
    sample100Btn.mousePressed(() => { for (let i = 0; i < 100; i++) { const idx = sampleOne(); sampleCounts[idx]++; sampleN++; } lastSampled = -1; });
    resetBtn = createButton('Reset to defaults');
    resetBtn.parent(document.querySelector('main'));
    resetBtn.mousePressed(() => { tempSlider.value(1); topPSlider.value(1); sampleCounts.fill(0); sampleN = 0; lastSampled = -1; });
    positionControls();
}
function windowResized() { updateCanvasSize(); resizeCanvas(containerW, ch); positionControls(); }
function positionControls() {
    tempSlider.position(20, 480);
    topPSlider.position(20, 530);
    sample1Btn.position(380, 478);
    sample100Btn.position(490, 478);
    resetBtn.position(620, 478);
}

function modifiedDistribution() {
    const t = Math.max(0.01, tempSlider.value());
    const topP = topPSlider.value();
    // Apply temperature to logits (treat base as already-softmax probabilities, recover logits)
    const logits = TOKENS.map(c => Math.log(Math.max(1e-9, c.base)));
    const scaled = logits.map(l => l / t);
    const maxL = Math.max(...scaled);
    const exps = scaled.map(l => Math.exp(l - maxL));
    const sumE = exps.reduce((a,b) => a+b, 0);
    let probs = exps.map(e => e / sumE);
    // Apply top-p (nucleus): sort desc, keep until cumulative >= topP, zero rest, renormalize
    const sortedIdx = probs.map((p, i) => [p, i]).sort((a,b) => b[0] - a[0]);
    let cum = 0; const keep = new Set();
    for (const [p, i] of sortedIdx) { keep.add(i); cum += p; if (cum >= topP) break; }
    let cleared = probs.map((p, i) => keep.has(i) ? p : 0);
    const s2 = cleared.reduce((a,b) => a+b, 0);
    if (s2 > 0) cleared = cleared.map(p => p / s2);
    return { probs: cleared, kept: keep };
}
function sampleOne() {
    const { probs } = modifiedDistribution();
    let r = Math.random();
    for (let i = 0; i < probs.length; i++) { r -= probs[i]; if (r <= 0) return i; }
    return probs.length - 1;
}

function draw() {
    background(248, 250, 252);
    noStroke();
    fill(31, 41, 55); textSize(17); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Sampling Parameter Explorer', 20, 16);
    textStyle(NORMAL); textSize(11); fill(100, 116, 139);
    text('"The red panda climbed the ___" — modify the distribution with temperature and top-p.', 20, 38);

    const { probs, kept } = modifiedDistribution();
    // Draw bars
    const x0 = 60, y0 = 80, w = containerW - 80, h = 320;
    fill(255); stroke(226, 232, 240); rect(x0, y0, w, h, 4); noStroke();
    const barSlot = w / TOKENS.length;
    const maxP = 1;
    TOKENS.forEach((tok, i) => {
        const cx = x0 + barSlot * i + barSlot / 2;
        const barW = barSlot * 0.7;
        const pNew = probs[i];
        const inNucleus = kept.has(i);
        // Theoretical bar
        const barH = pNew * (h - 40);
        if (inNucleus) fill(2, 119, 189);
        else fill(203, 213, 225);
        rect(cx - barW/2, y0 + h - 20 - barH, barW, barH, 3);
        // Sampled-frequency overlay
        if (sampleN > 0) {
            const empP = sampleCounts[i] / sampleN;
            const empH = empP * (h - 40);
            stroke(193, 68, 14); strokeWeight(2); noFill();
            rect(cx - barW/2, y0 + h - 20 - empH, barW, empH);
            strokeWeight(1); noStroke();
        }
        // Highlight last sampled token
        if (lastSampled === i) {
            stroke(46, 125, 50); strokeWeight(3); noFill();
            rect(cx - barW/2 - 2, y0 + h - 20 - barH - 2, barW + 4, barH + 4);
            strokeWeight(1); noStroke();
        }
        // Token label
        fill(31, 41, 55); textSize(10); textAlign(CENTER, TOP);
        text(tok.tok, cx, y0 + h - 16);
        // Prob label above bar
        fill(100, 116, 139); textSize(9); textAlign(CENTER, BOTTOM);
        text(pNew.toFixed(2), cx, y0 + h - 20 - barH - 2);
    });

    // Controls labels
    fill(31, 41, 55); textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
    text('Controls', 20, 430);
    textStyle(NORMAL); textSize(12); fill(55, 71, 79);
    text('Temperature: ' + tempSlider.value().toFixed(2) + ' (lower = sharper, higher = flatter)', 20, 460);
    text('Top-P: ' + topPSlider.value().toFixed(2) + ' (lower = nucleus narrower)', 20, 510);
    if (sampleN > 0) {
        fill(193, 68, 14); textSize(11);
        text(`Empirical (orange outline): ${sampleN} samples drawn.`, 20, 575);
    }
}
