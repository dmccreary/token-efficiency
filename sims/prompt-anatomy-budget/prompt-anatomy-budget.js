// Prompt Anatomy Budget - p5.js stacked bar with budget overlay
// CANVAS_HEIGHT: 620
// Bloom Level: Apply (L3) - implement
// LO: Implement a prompt length budget by allocating tokens across components.

let canvas;
const cw = 800, ch = 620;
let containerW;
const COMPONENTS = [
    { name: 'System prompt',     value: 3200, min: 200,  max: 10000, color: [2, 119, 189] },
    { name: 'Tool definitions',  value: 1200, min: 100,  max: 5000,  color: [124, 58, 237] },
    { name: 'Few-shot',          value: 1500, min: 0,    max: 5000,  color: [193, 68, 14] },
    { name: 'Retrieved context', value: 1500, min: 0,    max: 5000,  color: [245, 158, 11] },
    { name: 'User message',      value:  600, min: 50,   max: 2000,  color: [55, 71, 79] },
    { name: 'Reserve for output',value: 1000, min: 200,  max: 4000,  color: [46, 125, 50] }
];
let sliders = [];
let budgetSlider;
let autoShrinkBtn, autoPruneBtn, autoCompressBtn;

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    containerW = Math.max(360, Math.min(el.clientWidth, cw));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerW, ch);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');
    COMPONENTS.forEach(c => {
        const s = createSlider(c.min, c.max, c.value, 50);
        s.parent(document.querySelector('main'));
        s.style('width', '300px');
        sliders.push(s);
    });
    budgetSlider = createSlider(4000, 16000, 8000, 500);
    budgetSlider.parent(document.querySelector('main'));
    budgetSlider.style('width', '300px');
    autoShrinkBtn = createButton('Auto-shrink system prompt');
    autoShrinkBtn.parent(document.querySelector('main'));
    autoShrinkBtn.mousePressed(() => sliders[0].value(Math.max(800, sliders[0].value() * 0.6)));
    autoPruneBtn = createButton('Auto-prune few-shot');
    autoPruneBtn.parent(document.querySelector('main'));
    autoPruneBtn.mousePressed(() => sliders[2].value(Math.max(0, sliders[2].value() * 0.4)));
    autoCompressBtn = createButton('Auto-compress retrieved');
    autoCompressBtn.parent(document.querySelector('main'));
    autoCompressBtn.mousePressed(() => sliders[3].value(Math.max(0, sliders[3].value() * 0.5)));
    positionControls();
}
function windowResized() { updateCanvasSize(); resizeCanvas(containerW, ch); positionControls(); }
function positionControls() {
    const col1 = 20, col2 = containerW / 2 + 10;
    sliders.forEach((s, i) => {
        const col = i % 2 === 0 ? col1 : col2;
        const row = Math.floor(i / 2);
        s.position(col, 290 + row * 56);
    });
    budgetSlider.position(col1, 460);
    autoShrinkBtn.position(col1, 510);
    autoPruneBtn.position(col1 + 200, 510);
    autoCompressBtn.position(col1 + 380, 510);
}

function draw() {
    background(248, 250, 252);
    noStroke();
    fill(31, 41, 55); textSize(17); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Prompt Anatomy and Budget', 20, 16);
    textStyle(NORMAL); textSize(11); fill(100, 116, 139);
    text('Allocate tokens across prompt components within a budget.', 20, 38);

    const values = sliders.map(s => s.value());
    const total = values.reduce((a,b) => a+b, 0);
    const budget = budgetSlider.value();
    const overBudget = total > budget;

    // Stacked bar
    const barX = 20, barY = 80, barH = 60, barW = containerW - 40;
    const scale = barW / Math.max(total, budget);
    let cursor = barX;
    COMPONENTS.forEach((c, i) => {
        const w = values[i] * scale;
        fill(c.color[0], c.color[1], c.color[2]);
        rect(cursor, barY, w, barH);
        // In-bar label
        if (w > 50) {
            fill(255); textAlign(LEFT, CENTER); textSize(10);
            text(c.name + ' ' + values[i], cursor + 6, barY + barH / 2);
        }
        cursor += w;
    });

    // Budget marker
    const budgetX = barX + budget * scale;
    stroke(198, 40, 40); strokeWeight(2);
    line(budgetX, barY - 6, budgetX, barY + barH + 6);
    noStroke();
    fill(198, 40, 40); textAlign(CENTER, BOTTOM); textSize(11); textStyle(BOLD);
    text('Budget ' + budget, budgetX, barY - 8);
    textStyle(NORMAL);

    // Status
    fill(overBudget ? color(198, 40, 40) : color(46, 125, 50));
    textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
    text(overBudget
        ? `OVER BUDGET by ${total - budget} tokens — use auto-actions or shrink components.`
        : `WITHIN BUDGET — using ${total} of ${budget} tokens (${Math.round(total/budget*100)}%).`,
        20, 160);
    textStyle(NORMAL);

    // Component labels under chart
    fill(100, 116, 139); textAlign(LEFT, TOP); textSize(10);
    text('Adjust each slider below; auto-actions trim aggressively in one click.', 20, 200);

    // Slider labels
    fill(31, 41, 55); textAlign(LEFT, TOP); textSize(11);
    COMPONENTS.forEach((c, i) => {
        const col = i % 2 === 0 ? 20 : containerW / 2 + 10;
        const row = Math.floor(i / 2);
        text(c.name + ': ' + values[i], col, 270 + row * 56);
    });
    text('Total budget: ' + budget, 20, 444);
}
