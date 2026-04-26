// BPE Tokenization Pipeline - p5.js
// CANVAS_HEIGHT: 760
// Bloom Level: Understand (L2) - explain
// Learning objective: Explain the role of each stage in the tokenization
// pipeline and identify which stage is responsible for which class of
// cross-vendor token-count differences.

let canvas;
let canvasWidth = 880;
let drawHeight = 660;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

// Controls
let textInput, prevBtn, nextBtn, resetBtn;

// State
const DEFAULT_INPUT = 'Write a haiku about café pandas.';
let currentText = DEFAULT_INPUT;
let mergeStep = 0; // 0..MAX_MERGE_STEPS
const MAX_MERGE_STEPS = 4;

// Hardcoded merge sequence applied in stage 4. We illustrate on the chunk "haiku".
// For other inputs, we apply the same merge ordering conceptually.
const MERGES = [
    { left: 'h', right: 'a', result: 'ha' },
    { left: 'ha', right: 'i', result: 'hai' },
    { left: 'hai', right: 'k', result: 'haik' },
    { left: 'haik', right: 'u', result: 'haiku' }
];

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

    textInput = createInput(DEFAULT_INPUT);
    textInput.parent(document.querySelector('main'));
    textInput.style('width', '420px');
    textInput.style('font-size', '14px');
    textInput.style('padding', '6px');
    textInput.input(() => { currentText = textInput.value(); mergeStep = 0; });

    prevBtn = createButton('< Step Back');
    prevBtn.parent(document.querySelector('main'));
    prevBtn.mousePressed(() => { mergeStep = Math.max(0, mergeStep - 1); });

    nextBtn = createButton('Step Forward >');
    nextBtn.parent(document.querySelector('main'));
    nextBtn.mousePressed(() => { mergeStep = Math.min(MAX_MERGE_STEPS, mergeStep + 1); });

    resetBtn = createButton('Reset');
    resetBtn.parent(document.querySelector('main'));
    resetBtn.mousePressed(() => {
        textInput.value(DEFAULT_INPUT);
        currentText = DEFAULT_INPUT;
        mergeStep = 0;
    });

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    textInput.position(margin + 60, drawHeight + 18);
    prevBtn.position(margin, drawHeight + 56);
    nextBtn.position(margin + 110, drawHeight + 56);
    resetBtn.position(margin + 250, drawHeight + 56);
}

function draw() {
    background(248, 250, 252);
    drawHeader();
    drawStages();
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
    text('BPE Tokenization Pipeline', margin, 12);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Four sequential stages turn raw text into a token sequence. Each stage isolates one source of cross-vendor variation.',
         margin, 34);
}

function drawStages() {
    const x0 = margin;
    const w = containerWidth - 2 * margin;
    let y = 64;
    const stageH = 130;
    const gap = 14;

    // Stage 1: Unicode Normalize
    drawStage1(x0, y, w, stageH);
    y += stageH + gap;

    // Stage 2: Pre-tokenize
    drawStage2(x0, y, w, stageH);
    y += stageH + gap;

    // Stage 3: Initialize as bytes
    drawStage3(x0, y, w, stageH);
    y += stageH + gap;

    // Stage 4: Apply merges
    drawStage4(x0, y, w, stageH + 12);
}

function drawStageBox(x, y, w, h, num, label, sublabel) {
    stroke(203, 213, 225);
    fill(255);
    rect(x, y, w, h, 6);
    noStroke();
    // Step badge
    fill(2, 119, 189);
    rect(x + 8, y + 8, 20, 20, 4);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(num, x + 18, y + 18);
    textStyle(NORMAL);
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text(label, x + 36, y + 9);
    textStyle(NORMAL);
    fill(100, 116, 139);
    textSize(10);
    text(sublabel, x + 36, y + 26);
}

function drawStage1(x, y, w, h) {
    drawStageBox(x, y, w, h, '1', 'Unicode Normalize (NFC)',
                 'Composes precomposed forms; collapses combining-character sequences.');

    // Show "café" with combining accent (raw) vs precomposed (normalized)
    const colW = (w - 60) / 2;
    const cx1 = x + 30;
    const cx2 = x + 30 + colW;
    const innerY = y + 50;

    // Left: raw bytes
    fill(254, 226, 226);
    rect(cx1, innerY, colW - 8, 60, 4);
    fill(127, 29, 29);
    textAlign(LEFT, TOP);
    textSize(11);
    textStyle(BOLD);
    text('Raw input', cx1 + 8, innerY + 6);
    textStyle(NORMAL);
    textSize(13);
    fill(31, 41, 55);
    text(currentText, cx1 + 8, innerY + 24);
    fill(120, 113, 108);
    textSize(9);
    text('"é" may be U+0065 + U+0301 (e + combining acute)', cx1 + 8, innerY + 44);

    // Right: normalized
    fill(220, 252, 231);
    rect(cx2, innerY, colW - 8, 60, 4);
    fill(20, 83, 45);
    textAlign(LEFT, TOP);
    textSize(11);
    textStyle(BOLD);
    text('After NFC', cx2 + 8, innerY + 6);
    textStyle(NORMAL);
    textSize(13);
    fill(31, 41, 55);
    text(currentText.normalize('NFC'), cx2 + 8, innerY + 24);
    fill(120, 113, 108);
    textSize(9);
    text('"é" becomes a single codepoint U+00E9.', cx2 + 8, innerY + 44);
}

function drawStage2(x, y, w, h) {
    drawStageBox(x, y, w, h, '2', 'Pre-Tokenize',
                 'Splits on whitespace + punctuation. Leading-space pieces are highlighted.');

    // Pre-token chunks
    const chunks = preTokenize(currentText.normalize('NFC'));
    const innerX = x + 30;
    const innerY = y + 56;
    const innerW = w - 60;
    let cx = innerX;
    let cy = innerY;
    textSize(13);
    chunks.forEach((c) => {
        const display = c.lead ? '·' + c.text : c.text;
        const tw = textWidth(display) + 14;
        if (cx + tw > innerX + innerW) { cx = innerX; cy += 30; }
        if (c.lead) {
            fill(254, 215, 170); // amber for leading space
        } else {
            fill(191, 219, 254); // light blue
        }
        rect(cx, cy, tw, 24, 3);
        fill(31, 41, 55);
        textAlign(LEFT, CENTER);
        text(display, cx + 7, cy + 12);
        cx += tw + 6;
    });
}

function drawStage3(x, y, w, h) {
    drawStageBox(x, y, w, h, '3', 'Initialize as bytes',
                 'Each pre-token chunk starts as a sequence of single-byte tokens. Showing chunk "haiku".');

    // For pedagogy, show one chunk decomposed to bytes
    const chunk = 'haiku';
    const innerX = x + 30;
    const innerY = y + 60;

    // Left: chunk
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(11);
    text('Chunk:', innerX, innerY - 4);
    fill(191, 219, 254);
    rect(innerX + 50, innerY - 8, 60, 24, 3);
    fill(31, 41, 55);
    textAlign(CENTER, CENTER);
    textSize(13);
    text(chunk, innerX + 80, innerY + 4);

    // Arrow
    stroke(120, 113, 108);
    strokeWeight(2);
    line(innerX + 120, innerY + 4, innerX + 150, innerY + 4);
    fill(120, 113, 108);
    noStroke();
    triangle(innerX + 150, innerY + 4, innerX + 142, innerY - 1, innerX + 142, innerY + 9);

    // Bytes
    textAlign(LEFT, TOP);
    textSize(11);
    fill(31, 41, 55);
    text('Bytes:', innerX + 160, innerY - 4);
    let bx = innerX + 210;
    for (let i = 0; i < chunk.length; i++) {
        fill(229, 231, 235);
        rect(bx, innerY - 8, 30, 24, 3);
        fill(31, 41, 55);
        textAlign(CENTER, CENTER);
        textSize(13);
        text(chunk[i], bx + 15, innerY + 4);
        textAlign(CENTER, TOP);
        textSize(9);
        fill(120, 113, 108);
        text('U+' + chunk.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'),
             bx + 15, innerY + 18);
        bx += 36;
    }
    fill(100, 116, 139);
    textAlign(LEFT, TOP);
    textSize(10);
    text('5 byte-tokens, ready to be merged.', innerX, innerY + 50);
}

function drawStage4(x, y, w, h) {
    drawStageBox(x, y, w, h, '4', 'Apply Merge Rules in order',
                 'Step through the merges. Each merge fuses two adjacent tokens.');

    // Compute current state of bytes after applying mergeStep merges
    let parts = ['h', 'a', 'i', 'k', 'u'];
    for (let i = 0; i < mergeStep; i++) {
        const m = MERGES[i];
        const idx = parts.findIndex((p, j) => j < parts.length - 1 && p === m.left && parts[j + 1] === m.right);
        if (idx >= 0) {
            parts = [...parts.slice(0, idx), m.result, ...parts.slice(idx + 2)];
        }
    }

    // Render parts as chips
    const innerX = x + 30;
    const innerY = y + 60;
    let cx = innerX;
    textSize(13);
    parts.forEach((p, idx) => {
        const tw = textWidth(p) + 14;
        // Highlight the chip(s) just merged
        let isJust = false;
        if (mergeStep > 0) {
            const m = MERGES[mergeStep - 1];
            if (p === m.result && idx === parts.findIndex(q => q === m.result)) isJust = true;
        }
        if (isJust) {
            fill(254, 215, 170);
            stroke(217, 119, 6);
            strokeWeight(2);
        } else {
            fill(191, 219, 254);
            noStroke();
        }
        rect(cx, innerY, tw, 28, 4);
        noStroke();
        fill(31, 41, 55);
        textAlign(CENTER, CENTER);
        text(p, cx + tw / 2, innerY + 14);
        cx += tw + 8;
    });

    // Show the rule that just fired
    fill(100, 116, 139);
    textAlign(LEFT, TOP);
    textSize(11);
    if (mergeStep === 0) {
        text('Step 0 of 4: bytes only — no merges applied yet.', innerX, innerY + 40);
    } else {
        const m = MERGES[mergeStep - 1];
        fill(193, 68, 14);
        textStyle(BOLD);
        text('Just applied: "' + m.left + '" + "' + m.right + '" → "' + m.result + '"',
             innerX, innerY + 40);
        textStyle(NORMAL);
    }

    // Step counter
    fill(120, 113, 108);
    textAlign(RIGHT, TOP);
    textSize(11);
    text('Step ' + mergeStep + ' / ' + MAX_MERGE_STEPS, x + w - 14, y + 12);

    // Final token count
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(11);
    text('Current token count for "haiku" chunk: ' + parts.length, innerX, innerY + 60);
    if (mergeStep === MAX_MERGE_STEPS) {
        fill(46, 125, 50);
        textStyle(BOLD);
        text('Fully merged: "haiku" is now one token.', innerX, innerY + 78);
        textStyle(NORMAL);
    }
}

function preTokenize(s) {
    const out = [];
    const re = /(\s+)?(\S+)/g;
    let m;
    while ((m = re.exec(s)) !== null) {
        out.push({ lead: !!m[1], text: m[2] });
    }
    return out;
}

function drawControlLabels() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Input:', margin, drawHeight + 22);
    textStyle(NORMAL);
}
