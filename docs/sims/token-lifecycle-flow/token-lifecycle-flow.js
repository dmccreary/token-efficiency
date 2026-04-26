// Token Lifecycle Flow - p5.js
// CANVAS_HEIGHT: 540
// Bloom Level: Understand (L2) - explain
// Learning objective: Explain how raw text is converted to tokens, processed
// in parallel, and emitted autoregressively, including which stages are
// billed as input versus output.

let canvas;
let canvasWidth = 880;
let drawHeight = 440;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

// Controls
let stepBtn, autoBtn, resetBtn;

// State
const inputTokens = [
    { text: 'Write',    color: [96, 165, 250] },
    { text: '·a',       color: [96, 165, 250] },
    { text: '·haiku',   color: [96, 165, 250] },
    { text: '·about',   color: [96, 165, 250] },
    { text: '·pandas',  color: [96, 165, 250] },
    { text: '.',        color: [96, 165, 250] }
];

const outputTokens = [
    'Bamboo', '·leaves', '·rustle', '·in', '·breeze',
    ',', '·red', '·panda', '·rests', '.'
];

let outputProduced = 0; // how many output tokens have been emitted
let autoPlay = false;
let lastAutoTick = 0;
const AUTO_INTERVAL = 600; // ms per token

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

    stepBtn = createButton('Generate next token');
    stepBtn.parent(document.querySelector('main'));
    stepBtn.mousePressed(() => {
        if (outputProduced < outputTokens.length) outputProduced += 1;
    });

    autoBtn = createButton('Auto-play');
    autoBtn.parent(document.querySelector('main'));
    autoBtn.mousePressed(() => {
        autoPlay = !autoPlay;
        autoBtn.html(autoPlay ? 'Pause' : 'Auto-play');
    });

    resetBtn = createButton('Reset');
    resetBtn.parent(document.querySelector('main'));
    resetBtn.mousePressed(() => {
        outputProduced = 0;
        autoPlay = false;
        autoBtn.html('Auto-play');
    });

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    stepBtn.position(margin, drawHeight + 24);
    autoBtn.position(margin + 180, drawHeight + 24);
    resetBtn.position(margin + 280, drawHeight + 24);
}

function draw() {
    background(248, 250, 252);

    if (autoPlay && millis() - lastAutoTick > AUTO_INTERVAL) {
        if (outputProduced < outputTokens.length) {
            outputProduced += 1;
            lastAutoTick = millis();
        } else {
            autoPlay = false;
            autoBtn.html('Auto-play');
        }
    }

    drawHeader();
    drawFlow();
    drawLegend();
    drawControlLabel();

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
    text('Token Lifecycle: Input → Model → Output', margin, 12);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Input tokens are read in parallel (cheap). Output tokens are emitted one at a time (expensive).',
         margin, 34);
}

function drawFlow() {
    const y0 = 70;
    const w = containerWidth - 2 * margin;
    const h = 350;

    // Five stages laid out left-to-right
    // 1. Raw Text  2. Input Tokens  3. LLM  4. Output Tokens  5. Generated Text
    const stageW = (w - 4 * 18) / 5;
    const stageH = 200;
    const stageY = y0 + 20;
    const xs = [];
    for (let i = 0; i < 5; i++) {
        xs.push(margin + i * (stageW + 18));
    }

    // Stage 1: Raw Text
    drawStageBox(xs[0], stageY, stageW, stageH, 'Raw Text', '#e0e7ff');
    fill(31, 41, 55);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('"Write a haiku\nabout pandas."', xs[0] + stageW / 2, stageY + stageH / 2);

    // Arrow 1: tokenize
    drawArrow(xs[0] + stageW, xs[1], stageY + stageH / 2, 'tokenize');

    // Stage 2: Input Tokens
    drawStageBox(xs[1], stageY, stageW, stageH, 'Input tokens (read in parallel)', '#dbeafe');
    drawTokenStrip(inputTokens, xs[1] + 8, stageY + 36, stageW - 16, stageH - 50, false);
    // input cost label
    fill(2, 119, 189);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    textStyle(BOLD);
    text(inputTokens.length + ' tokens · input price', xs[1] + stageW / 2, stageY + stageH - 8);
    textStyle(NORMAL);

    // Arrow 2: send to model
    drawArrow(xs[1] + stageW, xs[2], stageY + stageH / 2, 'send');

    // Stage 3: LLM
    drawStageBox(xs[2], stageY, stageW, stageH, 'LLM (Transformer)', '#f1f5f9');
    // Stylized model
    push();
    translate(xs[2] + stageW / 2, stageY + stageH / 2);
    fill(120, 113, 108);
    noStroke();
    rectMode(CENTER);
    rect(0, -10, stageW * 0.65, 70, 6);
    rectMode(CORNER);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    text('Attention\n+ FFN', 0, -10);
    textStyle(NORMAL);
    pop();
    // Note
    fill(71, 85, 105);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text('processes input once;\nthen generates one\ntoken at a time',
         xs[2] + stageW / 2, stageY + stageH - 8);

    // Arrow 3: generate next token
    drawArrow(xs[2] + stageW, xs[3], stageY + stageH / 2, 'generate');

    // Stage 4: Output Tokens
    drawStageBox(xs[3], stageY, stageW, stageH, 'Output tokens (one at a time)', '#fed7aa');
    drawOutputStrip(xs[3] + 8, stageY + 36, stageW - 16, stageH - 50);
    fill(193, 68, 14);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    textStyle(BOLD);
    text(outputProduced + ' / ' + outputTokens.length + ' tokens · output price (≈5x)',
         xs[3] + stageW / 2, stageY + stageH - 8);
    textStyle(NORMAL);

    // Arrow 4: detokenize
    drawArrow(xs[3] + stageW, xs[4], stageY + stageH / 2, 'detokenize');

    // Stage 5: Generated Text
    drawStageBox(xs[4], stageY, stageW, stageH, 'Generated Text', '#fff7ed');
    fill(31, 41, 55);
    textAlign(CENTER, CENTER);
    textSize(13);
    const generatedText = outputTokens.slice(0, outputProduced)
        .map(t => t.startsWith('·') ? ' ' + t.slice(1) : t).join('');
    if (generatedText.length > 0) {
        text('"' + generatedText + (outputProduced < outputTokens.length ? '…' : '') + '"',
             xs[4] + stageW / 2, stageY + stageH / 2, stageW - 16);
    } else {
        fill(148, 163, 184);
        text('(awaiting first token)', xs[4] + stageW / 2, stageY + stageH / 2);
    }
}

function drawStageBox(x, y, w, h, label, bg) {
    stroke(203, 213, 225);
    fill(bg);
    rect(x, y, w, h, 6);
    noStroke();
    fill(55, 71, 79);
    textAlign(CENTER, TOP);
    textSize(11);
    textStyle(BOLD);
    text(label, x + w / 2, y + 8);
    textStyle(NORMAL);
}

function drawArrow(xFrom, xTo, y, label) {
    stroke(120, 113, 108);
    strokeWeight(2);
    line(xFrom, y, xTo, y);
    // arrowhead
    fill(120, 113, 108);
    noStroke();
    triangle(xTo, y, xTo - 8, y - 5, xTo - 8, y + 5);
    // label
    fill(100, 116, 139);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    textStyle(ITALIC);
    text(label, (xFrom + xTo) / 2, y - 6);
    textStyle(NORMAL);
    strokeWeight(1);
}

function drawTokenStrip(arr, x, y, w, h, isOutput) {
    const chipH = 22;
    const chipGap = 4;
    const chipPad = 6;
    let cx = x;
    let cy = y;
    textSize(11);
    arr.forEach((t, i) => {
        const txt = typeof t === 'string' ? t : t.text;
        const tw = textWidth(txt) + chipPad * 2;
        if (cx + tw > x + w) {
            cx = x;
            cy += chipH + chipGap;
        }
        if (cy + chipH > y + h) return;
        const col = isOutput ? [251, 146, 60] : (typeof t === 'object' ? t.color : [96, 165, 250]);
        fill(...col);
        rect(cx, cy, tw, chipH, 3);
        fill(31, 41, 55);
        textAlign(CENTER, CENTER);
        text(txt, cx + tw / 2, cy + chipH / 2);
        cx += tw + chipGap;
    });
}

function drawOutputStrip(x, y, w, h) {
    const chipH = 22;
    const chipGap = 4;
    const chipPad = 6;
    let cx = x;
    let cy = y;
    textSize(11);
    for (let i = 0; i < outputTokens.length; i++) {
        const txt = outputTokens[i];
        const tw = textWidth(txt) + chipPad * 2 + 8; // +8 for the $
        if (cx + tw > x + w) {
            cx = x;
            cy += chipH + chipGap + 8;
        }
        if (cy + chipH > y + h) break;
        const emitted = i < outputProduced;
        if (emitted) {
            fill(251, 146, 60);
        } else {
            stroke(203, 213, 225);
            fill(241, 245, 249);
            noFill();
            stroke(203, 213, 225);
        }
        if (emitted) {
            noStroke();
            rect(cx, cy, tw, chipH, 3);
        } else {
            fill(241, 245, 249);
            stroke(203, 213, 225);
            rect(cx, cy, tw, chipH, 3);
            noStroke();
        }
        if (emitted) {
            fill(31, 41, 55);
        } else {
            fill(148, 163, 184);
        }
        textAlign(CENTER, CENTER);
        text(txt, cx + tw / 2 - 4, cy + chipH / 2);
        // $ badge
        if (emitted) {
            fill(193, 68, 14);
            textAlign(RIGHT, TOP);
            textSize(10);
            textStyle(BOLD);
            text('$', cx + tw - 2, cy - 2);
            textStyle(NORMAL);
            textSize(11);
        }
        cx += tw + chipGap;
    }
}

function drawLegend() {
    const y = drawHeight - 14;
    textAlign(LEFT, BOTTOM);
    textSize(10);
    fill(96, 165, 250);
    rect(margin, y - 8, 12, 10);
    fill(71, 85, 105);
    text('input tokens (read once, in parallel - cheaper)', margin + 18, y);
    fill(251, 146, 60);
    rect(margin + 320, y - 8, 12, 10);
    fill(71, 85, 105);
    text('output tokens (generated one at a time - pricier, ~5x)', margin + 338, y);
}

function drawControlLabel() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Step through generation', margin, drawHeight + 6);
    textStyle(NORMAL);
}
