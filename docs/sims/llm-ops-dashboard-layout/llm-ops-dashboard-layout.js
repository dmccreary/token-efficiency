// LLM Ops Dashboard Layout - p5.js wireframe of a 6-panel observability dashboard
// CANVAS_HEIGHT: 640
// Bloom Level: Apply (L3) - implement
// Learning objective: Implement an LLM observability dashboard with the panels
// needed to answer cost, latency, and cache-effectiveness questions for a
// production team.

let canvas;
let canvasWidth = 920;
let drawHeight = 530;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 12;

// Controls
let stateToggle, alertToggle;

// Hover state
let hoverIdx = -1;

const PANELS = [
    {
        id: 'cost_time',
        title: 'Cost over time',
        subtitle: '$ per hour, last 24h',
        chart: 'line',
        question: 'Are we trending up or down on spend?',
        decision: 'Drives weekly cost reviews and triggers investigation when spend climbs day-over-day.',
        alerts: 'Spike alert: hourly $ above 30-day P95 baseline.'
    },
    {
        id: 'cost_feature',
        title: 'Cost by feature',
        subtitle: 'stacked area, last 24h',
        chart: 'stacked',
        question: 'Which feature is responsible for the cost we see?',
        decision: 'Drives feature-level budget decisions and per-feature optimization priorities.',
        alerts: 'Spike alert: any feature exceeds 2x its 7-day mean share.'
    },
    {
        id: 'cost_model',
        title: 'Cost by model',
        subtitle: 'stacked bar, last 24h',
        chart: 'stackedbar',
        question: 'Are we paying for the right model tier per call?',
        decision: 'Drives routing decisions: should this feature drop from Opus to Sonnet?',
        alerts: 'Tier alert: Opus traffic exceeds 30% of total without owner approval.'
    },
    {
        id: 'cache',
        title: 'Cache hit rate',
        subtitle: '% over time, last 24h',
        chart: 'line',
        question: 'Is caching working as intended?',
        decision: 'Drives prompt-template hygiene and stable-prefix audits when hit rate drops.',
        alerts: 'Drop alert: hit rate falls below 70% for two consecutive 5-min windows.'
    },
    {
        id: 'latency',
        title: 'Latency P50 / P95 / P99',
        subtitle: 'ms over time, last 24h',
        chart: 'multiline',
        question: 'Is the user experience degrading?',
        decision: 'Drives capacity planning, model routing, and incident response.',
        alerts: 'P95 alert: P95 exceeds 4000ms for 5 minutes.'
    },
    {
        id: 'tokens',
        title: 'Token volume',
        subtitle: 'in / out tokens per minute',
        chart: 'twoline',
        question: 'Is overall demand changing? Is the input/output ratio drifting?',
        decision: 'Drives capacity reservations and informs cost forecasts.',
        alerts: 'Surge alert: per-minute tokens above 30-day P99.'
    }
];

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    const w = el.clientWidth;
    containerWidth = Math.max(640, Math.min(w, canvasWidth));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');

    stateToggle = createCheckbox('Incident state (otherwise: healthy)', false);
    stateToggle.parent(document.querySelector('main'));

    alertToggle = createCheckbox('Alert overlay (highlight panels firing alerts)', false);
    alertToggle.parent(document.querySelector('main'));

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    stateToggle.position(margin, drawHeight + 10);
    alertToggle.position(margin, drawHeight + 38);
}

function panelRect(idx) {
    const cols = 3;
    const padding = 10;
    const top = 50; // header strip
    const w = (containerWidth - margin * 2 - padding * (cols - 1)) / cols;
    const h = (drawHeight - top - margin - padding) / 2;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return {
        x: margin + col * (w + padding),
        y: top + row * (h + padding),
        w: w,
        h: h
    };
}

function inRect(mx, my, r) {
    return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
}

function mouseMoved() {
    hoverIdx = -1;
    for (let i = 0; i < PANELS.length; i++) {
        const r = panelRect(i);
        if (inRect(mouseX, mouseY, r)) {
            hoverIdx = i;
            return;
        }
    }
}

function isPanelAlerting(idx, incident) {
    if (!incident) return false;
    // In incident state, the cost-by-feature, cache, latency, and tokens panels fire
    return ['cost_feature', 'cache', 'latency', 'tokens', 'cost_time'].includes(PANELS[idx].id);
}

function drawHeaderStrip() {
    fill(55, 71, 79);
    noStroke();
    rect(0, 0, containerWidth, 40);
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(15);
    textStyle(BOLD);
    text('LLM Ops Dashboard — Production', margin, 20);
    textStyle(NORMAL);
    textSize(11);
    fill(203, 213, 225);
    textAlign(RIGHT, CENTER);
    text('last 24h • prod-us-east • all features', containerWidth - margin, 20);
}

function drawPanel(idx, incident, alertOverlay) {
    const p = PANELS[idx];
    const r = panelRect(idx);
    const alerting = isPanelAlerting(idx, incident);

    // Card background
    if (alertOverlay && alerting) {
        fill(254, 242, 242);
        stroke(198, 40, 40);
        strokeWeight(2);
    } else if (hoverIdx === idx) {
        fill(255);
        stroke(2, 119, 189);
        strokeWeight(2);
    } else {
        fill(255);
        stroke(226, 232, 240);
        strokeWeight(1);
    }
    rect(r.x, r.y, r.w, r.h, 6);
    noStroke();

    // Header
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text(p.title, r.x + 10, r.y + 8);
    textStyle(NORMAL);
    fill(100, 116, 139);
    textSize(10);
    text(p.subtitle, r.x + 10, r.y + 24);

    // Alert badge
    if (alertOverlay && alerting) {
        fill(198, 40, 40);
        rect(r.x + r.w - 56, r.y + 8, 48, 16, 8);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10);
        textStyle(BOLD);
        text('ALERT', r.x + r.w - 32, r.y + 16);
        textStyle(NORMAL);
    }

    // Chart area
    const cx = r.x + 10;
    const cy = r.y + 44;
    const cw = r.w - 20;
    const ch = r.h - 54;
    drawMiniChart(p, cx, cy, cw, ch, incident);
}

function drawMiniChart(panel, x, y, w, h, incident) {
    push();
    // Frame
    stroke(241, 245, 249);
    strokeWeight(1);
    noFill();
    rect(x, y, w, h);
    noStroke();

    const seed = panel.id.length * 7;
    if (panel.chart === 'line') {
        drawLine(panel, x, y, w, h, incident, seed);
    } else if (panel.chart === 'stacked') {
        drawStackedArea(x, y, w, h, incident, seed);
    } else if (panel.chart === 'stackedbar') {
        drawStackedBar(x, y, w, h, incident);
    } else if (panel.chart === 'multiline') {
        drawMultiLine(x, y, w, h, incident, seed);
    } else if (panel.chart === 'twoline') {
        drawTwoLine(x, y, w, h, incident, seed);
    }
    pop();
}

function noiseAt(i, seed) {
    return Math.sin((i + seed) * 0.7) * 0.5 + Math.sin((i + seed) * 0.27) * 0.3;
}

function drawLine(panel, x, y, w, h, incident, seed) {
    const n = 24;
    const isCache = panel.id === 'cache';
    const isCost = panel.id === 'cost_time';
    stroke(2, 119, 189);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        let v;
        if (isCache) {
            // Healthy: high; incident: cliff drop after t=0.7
            v = incident
                ? (i > 16 ? 0.08 : 0.85) + noiseAt(i, seed) * 0.04
                : 0.85 + noiseAt(i, seed) * 0.05;
        } else if (isCost) {
            v = incident
                ? 0.35 + (i > 14 ? (i - 14) * 0.08 : 0) + noiseAt(i, seed) * 0.05
                : 0.35 + noiseAt(i, seed) * 0.08;
        } else {
            v = 0.5 + noiseAt(i, seed) * 0.1;
        }
        v = constrain(v, 0.02, 0.98);
        const px = x + t * w;
        const py = y + h - v * h;
        vertex(px, py);
    }
    endShape();

    // Threshold line for the cache panel
    if (isCache) {
        stroke(198, 40, 40, 200);
        strokeWeight(1);
        drawingContext.setLineDash([4, 4]);
        line(x, y + h - 0.7 * h, x + w, y + h - 0.7 * h);
        drawingContext.setLineDash([]);
    }
}

function drawStackedArea(x, y, w, h, incident, seed) {
    const n = 18;
    // Three stacked features
    const colors = ['#0277bd', '#7b1fa2', '#c1440e'];
    const shares = incident ? [0.25, 0.65, 0.10] : [0.45, 0.35, 0.20];
    let prevTop = new Array(n).fill(y + h);
    for (let s = 0; s < 3; s++) {
        const layer = [];
        for (let i = 0; i < n; i++) {
            const baseHeight = shares[s] * h * (1 + noiseAt(i + s * 5, seed) * 0.15);
            layer.push(baseHeight);
        }
        fill(colors[s]);
        noStroke();
        beginShape();
        for (let i = 0; i < n; i++) {
            const px = x + (i / (n - 1)) * w;
            vertex(px, prevTop[i]);
        }
        for (let i = n - 1; i >= 0; i--) {
            const px = x + (i / (n - 1)) * w;
            const py = prevTop[i] - layer[i];
            vertex(px, py);
            prevTop[i] = py;
        }
        endShape(CLOSE);
    }
}

function drawStackedBar(x, y, w, h, incident) {
    const colors = ['#0277bd', '#7b1fa2', '#c1440e'];
    const labels = ['Sonnet', 'Haiku', 'Opus'];
    const shares = incident ? [0.40, 0.20, 0.40] : [0.62, 0.30, 0.08];
    const bars = 6;
    const bw = w / (bars + bars * 0.4);
    const gap = bw * 0.4;
    for (let b = 0; b < bars; b++) {
        let cy = y + h;
        const total = h * (0.6 + Math.sin(b) * 0.08 + 0.2);
        for (let s = 0; s < 3; s++) {
            const sh = total * shares[s] * (0.9 + Math.sin(b + s) * 0.05);
            fill(colors[s]);
            noStroke();
            rect(x + b * (bw + gap) + gap / 2, cy - sh, bw, sh);
            cy -= sh;
        }
    }
}

function drawMultiLine(x, y, w, h, incident, seed) {
    const n = 24;
    const colors = ['#16a34a', '#f59e0b', '#dc2626']; // P50, P95, P99
    const bases = [0.20, 0.45, 0.70];
    const incBoost = incident ? [0.05, 0.20, 0.25] : [0, 0, 0];
    for (let s = 0; s < 3; s++) {
        stroke(colors[s]);
        strokeWeight(1.6);
        noFill();
        beginShape();
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            const incRamp = incident && i > 14 ? (i - 14) / 9 : 0;
            const v = bases[s] + noiseAt(i + s * 11, seed) * 0.04 + incBoost[s] * incRamp;
            const px = x + t * w;
            const py = y + h - constrain(v, 0.02, 0.95) * h;
            vertex(px, py);
        }
        endShape();
    }
}

function drawTwoLine(x, y, w, h, incident, seed) {
    const n = 24;
    const colors = ['#0277bd', '#c1440e'];
    const bases = [0.55, 0.25];
    for (let s = 0; s < 2; s++) {
        stroke(colors[s]);
        strokeWeight(1.6);
        noFill();
        beginShape();
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            const surge = incident && i > 16 ? (i - 16) * 0.05 : 0;
            const v = bases[s] + noiseAt(i + s * 13, seed) * 0.06 + surge * (s === 0 ? 1.2 : 0.4);
            const px = x + t * w;
            const py = y + h - constrain(v, 0.02, 0.95) * h;
            vertex(px, py);
        }
        endShape();
    }
}

function drawHoverPopup() {
    if (hoverIdx < 0) return;
    const p = PANELS[hoverIdx];
    const r = panelRect(hoverIdx);
    const text1 = 'Q: ' + p.question;
    const text2 = 'Decision: ' + p.decision;
    const text3 = 'Alert rule: ' + p.alerts;
    const lines = [text1, '', text2, '', text3];

    // Position popup below or above panel
    const popW = 320;
    let popX = r.x;
    if (popX + popW > containerWidth - 8) popX = containerWidth - popW - 8;
    let popY = r.y + r.h + 8;
    const popH = 96;
    if (popY + popH > drawHeight - 4) popY = r.y - popH - 8;

    fill(15, 23, 42, 240);
    stroke(2, 119, 189);
    strokeWeight(1);
    rect(popX, popY, popW, popH, 4);
    noStroke();
    fill(248, 250, 252);
    textAlign(LEFT, TOP);
    textSize(11);
    let ty = popY + 8;
    for (const l of lines) {
        if (l === '') { ty += 4; continue; }
        const wrapped = wrapText(l, popW - 16);
        for (const w of wrapped) {
            text(w, popX + 8, ty);
            ty += 13;
        }
    }
}

function wrapText(s, maxW) {
    const words = s.split(' ');
    const out = [];
    let cur = '';
    for (const w of words) {
        const test = cur ? cur + ' ' + w : w;
        if (textWidth(test) > maxW) {
            if (cur) out.push(cur);
            cur = w;
        } else {
            cur = test;
        }
    }
    if (cur) out.push(cur);
    return out;
}

function drawControlsLabel() {
    fill(31, 41, 55);
    textAlign(LEFT, CENTER);
    textSize(11);
    textStyle(NORMAL);
    text('Hover any panel to see what question it answers and what decision it drives.',
         margin, drawHeight + 78);
    text('In incident state, the alert overlay highlights which panels would have fired.',
         margin, drawHeight + 94);
}

function draw() {
    background(248, 250, 252);
    const incident = stateToggle.checked();
    const alertOverlay = alertToggle.checked();

    drawHeaderStrip();

    for (let i = 0; i < PANELS.length; i++) {
        drawPanel(i, incident, alertOverlay);
    }

    // Hover popup on top
    drawHoverPopup();

    // Divider
    stroke(203, 213, 225);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();

    drawControlsLabel();
}
