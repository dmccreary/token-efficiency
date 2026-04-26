// Anthropic Prompt Caching Lifecycle - p5.js
// CANVAS_HEIGHT: 720
// Bloom Level: Apply (L3) - calculate
// Learning objective: Calculate the cumulative cost of N requests with and
// without caching, and identify the break-even point (always reached after request 2).

// Anthropic prompt caching pricing model (current published rates):
//   Cache write tokens: 1.25x the normal input price
//   Cache read tokens:  0.10x the normal input price
//   Output tokens:      5x the normal input price (i.e. typical output multiplier)
// We use a unit price of $1 per 1M input tokens for clean arithmetic;
// learner can think of the relative shape, not absolute dollars.
const PRICE_INPUT      = 1.00;   // baseline normal input
const PRICE_CACHE_WRITE = 1.25;  // cache write multiplier
const PRICE_CACHE_READ  = 0.10;  // cache read multiplier
const PRICE_OUTPUT      = 5.00;  // output multiplier (5x typical for Sonnet-class)

// ---- Layout ----
let canvas;
let canvasWidth = 820;
let drawHeight = 420;
let controlHeight = 300;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

// ---- Controls ----
let sysSlider, userSlider, outSlider, reqSlider;
let cacheToggle, ttlToggle;
let staleButton, resetButton;

// ---- State ----
let staleAfterRequest = -1; // index after which a TTL gap was inserted (cache invalidates)

const D_SYS  = 5000;
const D_USER = 200;
const D_OUT  = 500;
const D_REQ  = 10;

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

    // Sliders + toggles + buttons
    sysSlider  = createSlider(500, 10000, D_SYS, 100);
    userSlider = createSlider(50,   500,  D_USER, 10);
    outSlider  = createSlider(100, 2000,  D_OUT,  50);
    reqSlider  = createSlider(1,   20,    D_REQ,  1);

    [sysSlider, userSlider, outSlider, reqSlider].forEach(s => {
        s.parent(document.querySelector('main'));
        s.style('width', '260px');
    });

    cacheToggle = createCheckbox('Enable prompt caching', true);
    cacheToggle.parent(document.querySelector('main'));

    ttlToggle = createCheckbox('Use 1-hour TTL (vs 5-min default)', false);
    ttlToggle.parent(document.querySelector('main'));

    staleButton = createButton('Add stale gap (TTL expires) at request ' + Math.ceil(D_REQ / 2));
    staleButton.parent(document.querySelector('main'));
    staleButton.mousePressed(() => {
        const half = Math.ceil(reqSlider.value() / 2);
        staleAfterRequest = (staleAfterRequest === half) ? -1 : half;
        updateStaleButtonLabel();
    });

    resetButton = createButton('Reset');
    resetButton.parent(document.querySelector('main'));
    resetButton.mousePressed(() => {
        sysSlider.value(D_SYS);
        userSlider.value(D_USER);
        outSlider.value(D_OUT);
        reqSlider.value(D_REQ);
        cacheToggle.checked(true);
        ttlToggle.checked(false);
        staleAfterRequest = -1;
        updateStaleButtonLabel();
    });

    positionControls();
}

function updateStaleButtonLabel() {
    const half = Math.ceil(reqSlider.value() / 2);
    if (staleAfterRequest > 0) {
        staleButton.html('Remove stale gap (currently after R' + staleAfterRequest + ')');
    } else {
        staleButton.html('Add stale gap (TTL expires) after R' + half);
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    const col1 = margin;
    const col2 = containerWidth / 2 + margin / 2;
    const sliderW = (containerWidth - 3 * margin) / 2;
    [sysSlider, userSlider, outSlider, reqSlider].forEach(s => s.style('width', sliderW + 'px'));

    sysSlider.position(col1, drawHeight + 50);
    userSlider.position(col2, drawHeight + 50);
    outSlider.position(col1, drawHeight + 110);
    reqSlider.position(col2, drawHeight + 110);

    cacheToggle.position(col1, drawHeight + 165);
    ttlToggle.position(col2,  drawHeight + 165);

    staleButton.position(col1, drawHeight + 210);
    resetButton.position(col1, drawHeight + 250);
}

// ---- Compute per-request token breakdown ----
// Returns array of { write, read, uncached, output, costThis, costNoCache }
function computeRequests() {
    const sys = sysSlider.value();
    const usr = userSlider.value();
    const out = outSlider.value();
    const n   = reqSlider.value();
    const cacheOn = cacheToggle.checked();

    const reqs = [];
    for (let i = 1; i <= n; i++) {
        // A "fresh cache" point: first request, or a TTL-expired request
        const isFreshCache = (i === 1) || (i === staleAfterRequest + 1 && staleAfterRequest > 0);

        let write = 0, read = 0, uncached = usr, output = out;
        if (cacheOn) {
            if (isFreshCache) {
                write = sys;        // we pay 1.25x to write the cache
                read = 0;
                uncached = usr;
            } else {
                write = 0;
                read = sys;         // we pay 0.10x to read
                uncached = usr;
            }
        } else {
            // No caching: every request pays full price for the system prompt
            write = 0; read = 0; uncached = sys + usr; output = out;
        }

        // Cost (in unit currency where 1 = full input price)
        const costThis =
            write    * PRICE_CACHE_WRITE +
            read     * PRICE_CACHE_READ  +
            uncached * PRICE_INPUT       +
            output   * PRICE_OUTPUT;
        // No-cache reference
        const costNoCache = (sys + usr) * PRICE_INPUT + out * PRICE_OUTPUT;

        reqs.push({ i, write, read, uncached, output, costThis, costNoCache, isFreshCache });
    }
    return reqs;
}

function draw() {
    background(248, 250, 252);
    const reqs = computeRequests();

    drawTitleBar();
    drawRequestCards(reqs);
    drawLineChart(reqs);
    drawControlLabels();

    // Divider
    stroke(203, 213, 225);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();
}

function drawTitleBar() {
    fill(31, 41, 55);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(17);
    textStyle(BOLD);
    text('Anthropic Prompt Caching Lifecycle', margin, 14);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Per-request token breakdown (top) and cumulative cost vs. no-cache (bottom)',
         margin, 36);
}

// ---- Top half: request cards as stacked bars ----
function drawRequestCards(reqs) {
    const y0 = 60;
    const h  = 150;
    const xL = margin;
    const xR = containerWidth - margin;
    const w  = xR - xL;
    const slot = w / reqs.length;
    const barW = Math.min(28, slot - 4);

    // Background frame
    stroke(226, 232, 240);
    fill(255);
    rect(xL, y0, w, h, 4);
    noStroke();

    // Find max stack height (in tokens) for vertical scaling
    let maxStack = 0;
    reqs.forEach(r => {
        const s = r.write + r.read + r.uncached + r.output;
        if (s > maxStack) maxStack = s;
    });
    if (maxStack < 1) maxStack = 1;

    const padTop = 8, padBot = 22;
    const usable = h - padTop - padBot;

    // Color palette
    const colors = {
        write:    [193,  68,  14], // russet (cache write - paid 1.25x)
        read:     [  2, 119, 189], // blue   (cache read - 0.10x, the savings star)
        uncached: [120, 113, 108], // slate  (uncached input)
        output:   [ 46, 125,  50]  // green  (output)
    };

    reqs.forEach((r, idx) => {
        const cx = xL + slot * (idx + 0.5);
        const baseY = y0 + h - padBot;
        let cursorY = baseY;

        // Stack: output, uncached, read, write (bottom-up so output is at bottom)
        const segs = [
            { val: r.output,   c: colors.output },
            { val: r.uncached, c: colors.uncached },
            { val: r.read,     c: colors.read },
            { val: r.write,    c: colors.write }
        ];
        segs.forEach(seg => {
            if (seg.val > 0) {
                const segH = (seg.val / maxStack) * usable;
                fill(...seg.c);
                noStroke();
                rect(cx - barW / 2, cursorY - segH, barW, segH);
                cursorY -= segH;
            }
        });

        // Marker for fresh-cache request (the "write" cycle)
        if (r.isFreshCache && cacheToggle.checked()) {
            stroke(193, 68, 14);
            strokeWeight(2);
            noFill();
            circle(cx, baseY - usable - 4, 8);
            strokeWeight(1);
            noStroke();
        }

        // R-label
        fill(71, 85, 105);
        textAlign(CENTER, TOP);
        textSize(10);
        text('R' + r.i, cx, baseY + 6);
    });

    // Legend (right side, inside the frame)
    const lx = xR - 132;
    const ly = y0 + 8;
    textAlign(LEFT, TOP);
    textSize(10);
    fill(71, 85, 105);
    [
        { c: colors.write,    label: 'Cache write (1.25x)' },
        { c: colors.read,     label: 'Cache read (0.10x)' },
        { c: colors.uncached, label: 'Uncached input' },
        { c: colors.output,   label: 'Output' }
    ].forEach((entry, k) => {
        fill(...entry.c);
        rect(lx, ly + k * 14 + 2, 10, 10);
        fill(71, 85, 105);
        text(entry.label, lx + 14, ly + k * 14);
    });
}

// ---- Bottom half: cumulative cost line chart ----
function drawLineChart(reqs) {
    const y0 = 220;
    const h  = 175;
    const xL = margin + 50;
    const xR = containerWidth - margin - 8;
    const yT = y0 + 24;
    const yB = y0 + h - 22;

    // Frame
    stroke(226, 232, 240);
    fill(255);
    rect(margin, y0, containerWidth - 2 * margin, h, 4);
    noStroke();

    // Title
    fill(55, 71, 79);
    textAlign(LEFT, TOP);
    textSize(11);
    textStyle(BOLD);
    text('Cumulative cost over requests', margin + 8, y0 + 6);
    textStyle(NORMAL);

    // Compute cumulative series
    let cumA = 0, cumB = 0;
    const seriesA = []; // with caching (or whichever toggle is set)
    const seriesB = []; // hypothetical no-cache
    reqs.forEach(r => {
        cumA += r.costThis;
        cumB += r.costNoCache;
        seriesA.push(cumA);
        seriesB.push(cumB);
    });
    const maxY = Math.max(seriesB[seriesB.length - 1], 1);
    const n = reqs.length;

    // Y gridlines + labels (4 ticks)
    stroke(241, 245, 249);
    fill(148, 163, 184);
    textSize(9);
    textAlign(RIGHT, CENTER);
    for (let k = 0; k <= 4; k++) {
        const v = (maxY * k) / 4;
        const y = map(v, 0, maxY, yB, yT);
        line(xL, y, xR, y);
        noStroke();
        text(formatCost(v), xL - 6, y);
        stroke(241, 245, 249);
    }
    noStroke();

    // X labels every few requests
    fill(148, 163, 184);
    textSize(9);
    textAlign(CENTER, TOP);
    for (let i = 1; i <= n; i++) {
        if (n <= 10 || i === 1 || i === n || i % Math.ceil(n / 8) === 0) {
            const x = map(i, 1, Math.max(n, 2), xL, xR);
            text('R' + i, x, yB + 4);
        }
    }

    // Series B: no-cache (slate dashed)
    drawSeries(seriesB, xL, xR, yT, yB, n, maxY, [120, 113, 108], true);
    // Series A: with-cache (russet)
    drawSeries(seriesA, xL, xR, yT, yB, n, maxY, [193, 68, 14], false);

    // Final values
    textAlign(LEFT, TOP);
    textSize(11);
    const finalA = seriesA[n - 1];
    const finalB = seriesB[n - 1];
    const savings = finalB > 0 ? Math.round((1 - finalA / finalB) * 100) : 0;
    fill(193, 68, 14);
    text('With caching: ' + formatCost(finalA), margin + 8, y0 + h - 38);
    fill(120, 113, 108);
    text('Without caching: ' + formatCost(finalB), margin + 8 + 200, y0 + h - 38);
    fill(46, 125, 50);
    textStyle(BOLD);
    text('Savings: ' + savings + '%', margin + 8 + 420, y0 + h - 38);
    textStyle(NORMAL);

    // Y axis label
    push();
    translate(margin + 12, (yT + yB) / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    fill(100, 116, 139);
    textSize(10);
    text('Cumulative cost (relative units)', 0, 0);
    pop();
}

function drawSeries(values, xL, xR, yT, yB, n, maxY, color, dashed) {
    stroke(...color);
    strokeWeight(2);
    noFill();
    if (dashed) drawingContext.setLineDash([5, 4]);
    beginShape();
    for (let i = 0; i < values.length; i++) {
        const x = map(i + 1, 1, Math.max(n, 2), xL, xR);
        const y = map(values[i], 0, maxY, yB, yT);
        vertex(x, y);
    }
    endShape();
    drawingContext.setLineDash([]);
    // Endpoint dot
    fill(...color);
    noStroke();
    const lx = map(values.length, 1, Math.max(n, 2), xL, xR);
    const ly = map(values[values.length - 1], 0, maxY, yB, yT);
    circle(lx, ly, 6);
    strokeWeight(1);
}

function drawControlLabels() {
    const col1 = margin;
    const col2 = containerWidth / 2 + margin / 2;
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text('Inputs', col1, drawHeight + 14);
    textStyle(NORMAL);

    textSize(12);
    fill(55, 71, 79);
    text('System prompt size: ' + sysSlider.value().toLocaleString() + ' tokens', col1, drawHeight + 32);
    text('User message size: ' + userSlider.value() + ' tokens',                  col2, drawHeight + 32);
    text('Output size: ' + outSlider.value() + ' tokens',                         col1, drawHeight + 92);
    text('Number of requests: ' + reqSlider.value(),                              col2, drawHeight + 92);
}

function formatCost(v) {
    // v is in "input price units" where 1 unit = 1 token at normal input rate.
    // Display as e.g. 12.3K (or 5.4M for very large).
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000)     return (v / 1_000).toFixed(1) + 'K';
    return Math.round(v).toString();
}
