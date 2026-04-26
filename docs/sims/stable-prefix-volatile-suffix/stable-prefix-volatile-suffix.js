// Stable Prefix / Volatile Suffix - p5.js
// CANVAS_HEIGHT: 580
// Bloom Level: Understand (L2) - classify
// LO: Classify prompt components as stable or volatile and place the cache boundary correctly.

let canvas;
const cw = 800, ch = 580;
let containerW;
let timestampBtn, restructureBtn, resetBtn;
let segments = [
    { name: 'System prompt',     tokens: 3000, type: 'stable' },
    { name: 'Tool definitions',  tokens: 1200, type: 'stable' },
    { name: 'Few-shot examples', tokens: 1500, type: 'stable' },
    { name: 'Retrieved context', tokens: 1500, type: 'mixed' },
    { name: 'Conversation hist', tokens: 800,  type: 'mixed' },
    { name: 'Current user msg',  tokens: 200,  type: 'volatile' }
];
let boundaryAt = 5; // index — boundary is just before this segment
let dragging = false;
let typeBtns = [];

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    containerW = Math.max(360, Math.min(el.clientWidth, cw));
}
function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerW, ch);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');
    timestampBtn = createButton('Anti-pattern: timestamp in system prompt');
    timestampBtn.parent(document.querySelector('main'));
    timestampBtn.mousePressed(() => { segments[0].type = 'volatile'; segments[0].name = 'System prompt + timestamp'; });
    restructureBtn = createButton('Restructure: move volatile to the end');
    restructureBtn.parent(document.querySelector('main'));
    restructureBtn.mousePressed(() => {
        const stable = segments.filter(s => s.type === 'stable');
        const mixed = segments.filter(s => s.type === 'mixed');
        const volatile_ = segments.filter(s => s.type === 'volatile');
        segments = [...stable, ...mixed, ...volatile_];
        boundaryAt = stable.length + mixed.length;
    });
    resetBtn = createButton('Reset');
    resetBtn.parent(document.querySelector('main'));
    resetBtn.mousePressed(() => {
        segments = [
            { name: 'System prompt',     tokens: 3000, type: 'stable' },
            { name: 'Tool definitions',  tokens: 1200, type: 'stable' },
            { name: 'Few-shot examples', tokens: 1500, type: 'stable' },
            { name: 'Retrieved context', tokens: 1500, type: 'mixed' },
            { name: 'Conversation hist', tokens: 800,  type: 'mixed' },
            { name: 'Current user msg',  tokens: 200,  type: 'volatile' }
        ];
        boundaryAt = 5;
    });
    positionControls();
}
function windowResized() { updateCanvasSize(); resizeCanvas(containerW, ch); positionControls(); }
function positionControls() {
    timestampBtn.position(20, 470);
    restructureBtn.position(280, 470);
    resetBtn.position(540, 470);
}

function colorFor(type) {
    if (type === 'stable')   return [46, 125, 50];
    if (type === 'volatile') return [193, 68, 14];
    return [245, 158, 11]; // mixed = yellow
}
function totalTokens() { return segments.reduce((a, s) => a + s.tokens, 0); }
function cachedTokens() {
    let cached = 0;
    for (let i = 0; i < segments.length; i++) {
        if (i < boundaryAt && segments[i].type !== 'volatile') cached += segments[i].tokens;
    }
    return cached;
}

function draw() {
    background(248, 250, 252);
    noStroke();
    fill(31, 41, 55); textSize(17); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Stable Prefix / Volatile Suffix — cache boundary placement', 20, 16);
    textStyle(NORMAL); textSize(11); fill(100, 116, 139);
    text('Drag the dashed line to set the cache boundary. Toggle segment types by clicking them.', 20, 38);

    // Draw the horizontal segmented bar
    const barX = 20, barY = 100, barW = containerW - 40, barH = 80;
    const total = totalTokens();
    let cursor = barX;
    let segPositions = [];
    segments.forEach((s, i) => {
        const w = (s.tokens / total) * barW;
        const c = colorFor(s.type);
        fill(c[0], c[1], c[2]);
        rect(cursor, barY, w, barH);
        // Border on hover
        if (mouseX >= cursor && mouseX <= cursor + w && mouseY >= barY && mouseY <= barY + barH) {
            stroke(31, 41, 55); strokeWeight(2); noFill();
            rect(cursor, barY, w, barH);
            strokeWeight(1); noStroke();
        }
        // Label
        fill(255); textAlign(CENTER, CENTER); textSize(11);
        if (w > 50) text(s.name, cursor + w/2, barY + barH/2 - 6);
        if (w > 40) text(s.tokens, cursor + w/2, barY + barH/2 + 8);
        segPositions.push({ x: cursor, w });
        cursor += w;
    });

    // Cache boundary line
    let boundaryX;
    if (boundaryAt >= segments.length) boundaryX = barX + barW;
    else boundaryX = segPositions[boundaryAt].x;
    stroke(7, 89, 133); strokeWeight(3);
    drawingContext.setLineDash([6, 4]);
    line(boundaryX, barY - 12, boundaryX, barY + barH + 12);
    drawingContext.setLineDash([]);
    noStroke();
    fill(7, 89, 133); textAlign(CENTER, BOTTOM); textSize(11); textStyle(BOLD);
    text('CACHE BOUNDARY', boundaryX, barY - 14);
    textStyle(NORMAL);

    // Stats
    const cached = cachedTokens();
    const eligibility = total > 0 ? (cached / total * 100).toFixed(1) : 0;
    fill(31, 41, 55); textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
    text(`Cached tokens: ${cached}    Uncached: ${total - cached}    Cache eligibility: ${eligibility}%`, 20, 220);
    textStyle(NORMAL); fill(100, 116, 139); textSize(11);
    text('Cache eligibility = stable+mixed tokens BEFORE the boundary.', 20, 250);

    // Status / advice
    let advice = '';
    if (eligibility < 30) advice = 'Boundary too far left (cached portion is small) — move it right past your stable segments.';
    else if (cursor && segments.some(s => s.type === 'volatile')) {
        const volBefore = segments.slice(0, boundaryAt).some(s => s.type === 'volatile');
        if (volBefore) advice = 'WARNING: a volatile segment is BEFORE the boundary. The cache will invalidate every request.';
        else advice = 'Boundary placement looks reasonable. Stable segments cache; volatile segments live after.';
    }
    fill(31, 41, 55); textSize(12); textAlign(LEFT, TOP);
    text(advice, 20, 280, containerW - 40);

    // Click on segments to cycle type
    if (frameCount % 1 === 0 && mouseIsPressed && !dragging) {
        // Skip — handled in mousePressed
    }

    // Legend
    fill(31, 41, 55); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
    text('Click a segment to toggle its type:', 20, 340);
    textStyle(NORMAL);
    [['stable', 'Stable (green): same across requests'], ['mixed', 'Mixed (yellow): sometimes stable, sometimes not'], ['volatile', 'Volatile (orange): changes per request']].forEach(([type, label], i) => {
        const c = colorFor(type);
        fill(c[0], c[1], c[2]); rect(20, 365 + i * 22, 14, 14);
        fill(55, 71, 79); textAlign(LEFT, CENTER); textSize(11);
        text(label, 40, 372 + i * 22);
    });
}

function mousePressed() {
    // Drag boundary if near it
    const barX = 20, barY = 100, barW = containerW - 40, barH = 80;
    if (mouseY < barY - 12 || mouseY > barY + barH + 12) return;
    const total = totalTokens();
    let cursor = barX;
    let positions = [barX];
    segments.forEach(s => { cursor += (s.tokens / total) * barW; positions.push(cursor); });
    let nearest = 0, bestDist = Infinity;
    positions.forEach((px, i) => { if (Math.abs(mouseX - px) < bestDist) { bestDist = Math.abs(mouseX - px); nearest = i; } });
    if (bestDist < 30) {
        boundaryAt = nearest;
        dragging = true;
    } else {
        // Click on segment toggles type
        for (let i = 0; i < positions.length - 1; i++) {
            if (mouseX >= positions[i] && mouseX <= positions[i+1] && mouseY >= barY && mouseY <= barY + barH) {
                const order = ['stable', 'mixed', 'volatile'];
                segments[i].type = order[(order.indexOf(segments[i].type) + 1) % 3];
                break;
            }
        }
    }
}
function mouseReleased() { dragging = false; }
function mouseDragged() {
    if (!dragging) return;
    const barX = 20, barW = containerW - 40;
    const total = totalTokens();
    let cursor = barX;
    let positions = [barX];
    segments.forEach(s => { cursor += (s.tokens / total) * barW; positions.push(cursor); });
    let nearest = 0, bestDist = Infinity;
    positions.forEach((px, i) => { if (Math.abs(mouseX - px) < bestDist) { bestDist = Math.abs(mouseX - px); nearest = i; } });
    boundaryAt = nearest;
}
