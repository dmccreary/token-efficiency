// Budget Hierarchy Roll-Up - p5.js
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - organize
// LO: Organize per-session costs into the hierarchical budget structure (PR → engineer → repo → organization).

let canvas;
let cw = 800, ch = 600;
let containerW;
let timeWindow, atRiskToggle;

const LEVELS = [
    { name: 'Session',      cap: 5000,    consumed: 1700 },
    { name: 'PR',           cap: 50000,   consumed: 24000 },
    { name: 'Engineer',     cap: 200000,  consumed: 138000 },
    { name: 'Repo',         cap: 1000000, consumed: 480000 },
    { name: 'Organization', cap: 8000000, consumed: 4900000 }
];

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    containerW = Math.max(360, Math.min(el.clientWidth, cw));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerW, ch);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');
    timeWindow = createSelect();
    timeWindow.parent(document.querySelector('main'));
    timeWindow.option('This session');
    timeWindow.option('This PR');
    timeWindow.option('This week');
    timeWindow.option('This month');
    timeWindow.selected('This month');
    atRiskToggle = createCheckbox('Highlight at-risk levels (>75% of cap)', true);
    atRiskToggle.parent(document.querySelector('main'));
    positionControls();
}
function windowResized() { updateCanvasSize(); resizeCanvas(containerW, ch); positionControls(); }
function positionControls() {
    timeWindow.position(20, ch - 60);
    atRiskToggle.position(220, ch - 56);
}

function colorFor(pct, hl) {
    if (!hl) return [2, 119, 189];
    if (pct >= 0.90) return [198, 40, 40];
    if (pct >= 0.75) return [245, 158, 11];
    return [46, 125, 50];
}

function draw() {
    background(248, 250, 252);
    noStroke();
    fill(31, 41, 55);
    textSize(17); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Budget Hierarchy Roll-Up', 20, 16);
    textStyle(NORMAL); textSize(11); fill(100, 116, 139);
    text('Each level rolls up costs from items below. Click a level to inspect contributing items.', 20, 38);

    const hl = atRiskToggle.checked();
    const baseY = 80, levelH = 60, gap = 14;
    let totalH = LEVELS.length * (levelH + gap);
    LEVELS.forEach((lvl, i) => {
        const widthFactor = 0.30 + i * 0.16; // each lower level is wider
        const w = containerW * widthFactor;
        const x = (containerW - w) / 2;
        const y = baseY + i * (levelH + gap);
        const pct = lvl.consumed / lvl.cap;
        const c = colorFor(pct, hl);

        // Background bar
        noStroke();
        fill(241, 245, 249);
        rect(x, y, w, levelH, 6);
        // Filled portion
        fill(c[0], c[1], c[2], 200);
        rect(x, y, Math.min(w, w * pct), levelH, 6);
        // Border
        noFill(); stroke(203, 213, 225);
        rect(x, y, w, levelH, 6);
        noStroke();

        // Labels
        fill(31, 41, 55);
        textAlign(LEFT, CENTER); textSize(13); textStyle(BOLD);
        text(lvl.name, x + 12, y + 22);
        textStyle(NORMAL); textSize(11); fill(55, 71, 79);
        text(`${(lvl.consumed/1000).toFixed(0)}K of ${(lvl.cap/1000).toFixed(0)}K tokens (${(pct*100).toFixed(0)}%)`, x + 12, y + 42);

        // Roll-up arrow
        if (i < LEVELS.length - 1) {
            stroke(148, 163, 184); strokeWeight(2);
            const cx = containerW / 2;
            line(cx, y + levelH, cx, y + levelH + gap);
            // Arrow head
            line(cx - 4, y + levelH + gap - 4, cx, y + levelH + gap);
            line(cx + 4, y + levelH + gap - 4, cx, y + levelH + gap);
            strokeWeight(1); noStroke();
        }
    });

    // Time-window label
    fill(100, 116, 139); textAlign(LEFT, BOTTOM); textSize(11);
    text('Time window:', 20, ch - 65);
}
