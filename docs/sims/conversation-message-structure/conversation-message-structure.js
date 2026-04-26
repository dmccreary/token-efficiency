// Conversation Message Structure - p5.js
// CANVAS_HEIGHT: 660
// Bloom Level: Analyze (L4) - examine
// Learning objective: Examine how a multi-turn conversation accumulates input
// tokens on every new turn, and identify the system-prompt prefix as a prime
// cache target.

let canvas;
let canvasWidth = 880;
let drawHeight = 520;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

// Cache pricing (relative): write 1.25x, read 0.10x
const CACHE_WRITE_MULT = 1.25;
const CACHE_READ_MULT  = 0.10;

// Conversation state
let messages = []; // [{role, tokens}]
let cumulativeFull = []; // cumulative input tokens per turn (full price)
let cumulativeCached = []; // cumulative input tokens per turn (cache discounted)
let turnNumber = 0; // user/assistant pair count

// Controls
let sysSlider, sendBtn, resetBtn, cacheCheck;
let scrollOffset = 0;

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    const w = el.clientWidth;
    containerWidth = Math.max(420, Math.min(w, canvasWidth));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');

    sysSlider = createSlider(200, 4000, 800, 50);
    sysSlider.parent(document.querySelector('main'));
    sysSlider.style('width', '220px');
    sysSlider.input(rebuildState);

    sendBtn = createButton('Send next turn');
    sendBtn.parent(document.querySelector('main'));
    sendBtn.mousePressed(addTurn);

    resetBtn = createButton('Reset conversation');
    resetBtn.parent(document.querySelector('main'));
    resetBtn.mousePressed(resetConversation);

    cacheCheck = createCheckbox('Cache the system prompt', false);
    cacheCheck.parent(document.querySelector('main'));
    cacheCheck.changed(rebuildState);

    resetConversation();
    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    const y = drawHeight + 14;
    sysSlider.position(margin + 200, y + 4);
    sendBtn.position(margin, y + 40);
    resetBtn.position(margin + 160, y + 40);
    cacheCheck.position(margin + 340, y + 44);
}

function resetConversation() {
    messages = [{ role: 'System', tokens: sysSlider.value() }];
    turnNumber = 0;
    cumulativeFull = [sysSlider.value()];
    cumulativeCached = [sysSlider.value() * CACHE_WRITE_MULT];
    rebuildState();
}

function rebuildState() {
    // Always keep system message tokens in sync with slider
    if (messages.length > 0 && messages[0].role === 'System') {
        messages[0].tokens = sysSlider.value();
    }
    recomputeCumulative();
}

function addTurn() {
    if (turnNumber >= 8) return; // cap visible turns
    turnNumber += 1;
    // User: 50-200; Assistant: 300-600
    const userTokens = Math.floor(50 + Math.random() * 150);
    const asstTokens = Math.floor(300 + Math.random() * 300);
    messages.push({ role: 'User', tokens: userTokens });
    messages.push({ role: 'Assistant', tokens: asstTokens });
    recomputeCumulative();
}

function recomputeCumulative() {
    // For turn t, the input sent equals: system prompt + every prior assistant + new user.
    // For the cache-discounted line: system prompt is paid at write multiplier on turn 1,
    // and at read multiplier on subsequent turns. Other tokens are full price.
    const sys = messages[0].tokens;
    cumulativeFull = [sys];
    cumulativeCached = [sys * CACHE_WRITE_MULT];

    let runFull = sys;
    let runCached = sys * CACHE_WRITE_MULT;

    for (let t = 1; t <= turnNumber; t++) {
        // On turn t the input is: sys + sum of all prior user/assistant pairs + new user msg
        // Already-sent tokens are re-billed since that's how stateless APIs work.
        const userIdx = 1 + (t - 1) * 2;
        const asstIdx = userIdx + 1;
        const userTokens = messages[userIdx] ? messages[userIdx].tokens : 0;
        // The history re-sent on this turn = sys + all prior user+assistant pairs (turns 1..t-1)
        let priorHistory = 0;
        for (let k = 1; k <= t - 1; k++) {
            const u = messages[1 + (k - 1) * 2];
            const a = messages[2 + (k - 1) * 2];
            if (u) priorHistory += u.tokens;
            if (a) priorHistory += a.tokens;
        }
        // Tokens billed this turn = sys + priorHistory + userTokens
        const billedFull = sys + priorHistory + userTokens;
        // Cached: sys at read multiplier, rest at full
        const billedCached = sys * CACHE_READ_MULT + priorHistory + userTokens;

        runFull += billedFull;
        runCached += billedCached;
        cumulativeFull.push(runFull);
        cumulativeCached.push(runCached);
    }
}

function draw() {
    background(248, 250, 252);
    drawHeader();
    drawMessageStack();
    drawChart();
    drawAnnotation();
    drawControlLabels();

    stroke(203, 213, 225);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();
}

function drawHeader() {
    fill(31, 41, 55);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(17);
    textStyle(BOLD);
    text('Conversation Message Structure', margin, 12);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Each new turn re-sends every prior message. The system prompt is the same on every request.',
         margin, 34);
}

function drawMessageStack() {
    const x0 = margin;
    const y0 = 60;
    const colW = (containerWidth - 3 * margin) * 0.58;
    const h = drawHeight - y0 - 12;

    stroke(226, 232, 240);
    fill(255);
    rect(x0, y0, colW, h, 4);
    noStroke();

    fill(55, 71, 79);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Conversation history (sent on every turn)', x0 + 8, y0 + 6);
    textStyle(NORMAL);

    // Compute layout
    const innerX = x0 + 12;
    const innerW = colW - 24;
    let yCursor = y0 + 28;
    const cardGap = 8;
    const sysHeight = 56;
    const msgHeight = 36;

    // System card
    const sys = messages[0];
    fill(71, 85, 105); // dark slate
    rect(innerX, yCursor, innerW, sysHeight, 4);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('SYSTEM', innerX + 10, yCursor + 8);
    textStyle(NORMAL);
    textSize(11);
    text('"You are a helpful assistant…"', innerX + 10, yCursor + 26);
    textAlign(RIGHT, TOP);
    textSize(11);
    text(sys.tokens.toLocaleString() + ' tokens', innerX + innerW - 10, yCursor + 8);
    // Cache target ribbon
    if (cacheCheck.checked()) {
        fill(193, 68, 14);
        textAlign(RIGHT, TOP);
        textSize(10);
        text('CACHED', innerX + innerW - 10, yCursor + 26);
    }
    yCursor += sysHeight + cardGap;

    // User/Assistant cards
    for (let i = 1; i < messages.length; i++) {
        const m = messages[i];
        if (yCursor + msgHeight > y0 + h - 10) break;
        if (m.role === 'User') {
            fill(2, 119, 189);
        } else {
            fill(193, 68, 14);
        }
        rect(innerX, yCursor, innerW, msgHeight, 4);
        fill(255);
        textAlign(LEFT, TOP);
        textSize(11);
        textStyle(BOLD);
        text(m.role.toUpperCase(), innerX + 10, yCursor + 6);
        textStyle(NORMAL);
        const turnIdx = Math.ceil(i / 2);
        const sample = m.role === 'User' ? '"Tell me about red pandas"' : '"Red pandas are small mammals…"';
        text(sample, innerX + 10, yCursor + 22);
        textAlign(RIGHT, TOP);
        text('T' + turnIdx + '  ' + m.tokens + ' tokens', innerX + innerW - 10, yCursor + 6);
        yCursor += msgHeight + cardGap;
    }

    // If we ran out of room
    const visibleEnd = yCursor;
    if (visibleEnd > y0 + h - 10 && messages.length > 1) {
        fill(148, 163, 184);
        textAlign(CENTER, BOTTOM);
        textSize(10);
        text('(scrolled — newest turns above)', x0 + colW / 2, y0 + h - 4);
    }
}

function drawChart() {
    const x0 = margin + (containerWidth - 3 * margin) * 0.58 + margin;
    const y0 = 60;
    const w = containerWidth - x0 - margin;
    const h = 280;

    stroke(226, 232, 240);
    fill(255);
    rect(x0, y0, w, h, 4);
    noStroke();

    fill(55, 71, 79);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Cumulative input tokens', x0 + 8, y0 + 6);
    textStyle(NORMAL);

    const xL = x0 + 44;
    const xR = x0 + w - 12;
    const yT = y0 + 28;
    const yB = y0 + h - 26;

    // Find max value
    let maxY = 0;
    for (const v of cumulativeFull) if (v > maxY) maxY = v;
    if (cacheCheck.checked()) {
        for (const v of cumulativeCached) if (v > maxY) maxY = v;
    }
    if (maxY < 100) maxY = 100;

    // Gridlines + Y labels
    stroke(241, 245, 249);
    fill(148, 163, 184);
    textSize(9);
    textAlign(RIGHT, CENTER);
    for (let k = 0; k <= 4; k++) {
        const v = (maxY * k) / 4;
        const y = map(v, 0, maxY, yB, yT);
        line(xL, y, xR, y);
        noStroke();
        text(formatTokens(v), xL - 4, y);
        stroke(241, 245, 249);
    }
    noStroke();

    // X labels
    fill(148, 163, 184);
    textSize(9);
    textAlign(CENTER, TOP);
    const nPts = cumulativeFull.length;
    for (let i = 0; i < nPts; i++) {
        const x = nPts === 1 ? (xL + xR) / 2 : map(i, 0, nPts - 1, xL, xR);
        const lbl = i === 0 ? 'sys' : 'T' + i;
        text(lbl, x, yB + 4);
    }

    // X axis label
    fill(100, 116, 139);
    textSize(10);
    textAlign(CENTER, BOTTOM);
    text('Turn', (xL + xR) / 2, y0 + h - 4);

    // Series: full price (always)
    drawLineSeries(cumulativeFull, xL, xR, yT, yB, maxY, [120, 113, 108], false);

    // Series: cached (only when toggle on)
    if (cacheCheck.checked()) {
        drawLineSeries(cumulativeCached, xL, xR, yT, yB, maxY, [46, 125, 50], false);
    }

    // Legend
    const lx = x0 + 8;
    const ly = y0 + h - 60;
    textAlign(LEFT, TOP);
    textSize(10);
    fill(120, 113, 108);
    rect(lx, ly + 2, 12, 3);
    fill(71, 85, 105);
    text('Full-price input', lx + 18, ly);
    if (cacheCheck.checked()) {
        fill(46, 125, 50);
        rect(lx, ly + 18, 12, 3);
        fill(71, 85, 105);
        text('With caching', lx + 18, ly + 16);
    }

    // Y axis label
    push();
    translate(x0 + 14, (yT + yB) / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    fill(100, 116, 139);
    textSize(10);
    text('Cumulative tokens', 0, 0);
    pop();
}

function drawLineSeries(values, xL, xR, yT, yB, maxY, color, dashed) {
    const n = values.length;
    stroke(...color);
    strokeWeight(2);
    noFill();
    if (dashed) drawingContext.setLineDash([5, 4]);
    beginShape();
    for (let i = 0; i < n; i++) {
        const x = n === 1 ? (xL + xR) / 2 : map(i, 0, n - 1, xL, xR);
        const y = map(values[i], 0, maxY, yB, yT);
        vertex(x, y);
    }
    endShape();
    drawingContext.setLineDash([]);

    fill(...color);
    noStroke();
    for (let i = 0; i < n; i++) {
        const x = n === 1 ? (xL + xR) / 2 : map(i, 0, n - 1, xL, xR);
        const y = map(values[i], 0, maxY, yB, yT);
        circle(x, y, 5);
    }
    strokeWeight(1);
}

function drawAnnotation() {
    const x0 = margin + (containerWidth - 3 * margin) * 0.58 + margin;
    const y0 = 350;
    const w = containerWidth - x0 - margin;

    fill(254, 243, 199);
    stroke(217, 119, 6);
    strokeWeight(1);
    rect(x0, y0, w, 60, 4);
    noStroke();
    fill(120, 53, 15);
    textAlign(LEFT, TOP);
    textSize(11);
    textStyle(BOLD);
    text('Cache target', x0 + 10, y0 + 8);
    textStyle(NORMAL);
    text('The same system prompt is sent on every turn —', x0 + 10, y0 + 26);
    text('a prime candidate for prompt caching.', x0 + 10, y0 + 42);

    // Stats
    if (turnNumber > 0) {
        const final = cumulativeFull[cumulativeFull.length - 1];
        const finalCached = cumulativeCached[cumulativeCached.length - 1];
        const sys = messages[0].tokens;
        const sysShare = (sys * cumulativeFull.length) / final;
        fill(71, 85, 105);
        textAlign(LEFT, TOP);
        textSize(11);
        text('Total input billed (full price): ' + formatTokens(final),
             x0 + 10, y0 + 76);
        if (cacheCheck.checked()) {
            const savings = final > 0 ? Math.round((1 - finalCached / final) * 100) : 0;
            fill(46, 125, 50);
            text('With caching: ' + formatTokens(finalCached) +
                 '  (savings ' + savings + '%)',
                 x0 + 10, y0 + 94);
        }
        fill(71, 85, 105);
        text('System prompt share of total: ' + Math.round(sysShare * 100) + '%',
             x0 + 10, y0 + 112);
    }
}

function drawControlLabels() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text('Controls', margin, drawHeight + 14);
    textStyle(NORMAL);
    textSize(11);
    fill(55, 71, 79);
    text('System prompt size: ' + sysSlider.value().toLocaleString() + ' tokens',
         margin, drawHeight + 32);
}

function formatTokens(v) {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K';
    return Math.round(v).toString();
}
