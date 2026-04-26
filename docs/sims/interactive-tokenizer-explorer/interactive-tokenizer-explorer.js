// Interactive Tokenizer Explorer - p5.js
// CANVAS_HEIGHT: 720
// Bloom Level: Understand (L2) - interpret
// Learning objective: Interpret how a tokenizer segments text into subword
// units, and predict the token count of a string before sending it to an API.

let canvas;
let canvasWidth = 880;
let drawHeight = 600;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

// Controls
let textInput;
let tokenizerSelect;
let btnShort, btnLong, btnCode, btnJP;

// Pre-baked example texts
const EXAMPLES = {
    short: 'Write a haiku about red pandas.',
    long: 'Red pandas, also known as the lesser panda or firefox, are small mammals native to the eastern Himalayas and southwestern China. They have reddish-brown fur, a long shaggy tail, and a waddling gait due to their shorter front legs. Although classified in the order Carnivora, their diet consists mainly of bamboo. Red pandas are solitary except during mating season and are most active in the early morning and late afternoon. They are excellent climbers and spend most of their time in trees. The species is listed as Endangered on the IUCN Red List.',
    code: 'def tokenize(text):\n    tokens = []\n    for word in text.split():\n        tokens.append(word.lower())\n    return tokens',
    jp: 'レッサーパンダは小型の哺乳類です。'
};

// Token color palette (cycled by token id)
const PALETTE = [
    [251, 191, 36], [96, 165, 250], [167, 139, 250], [248, 113, 113],
    [52, 211, 153], [251, 146, 60], [129, 140, 248], [244, 114, 182]
];

let tokens = []; // [{text, id, color, leadingSpace, x, y, w, h}]
let lastInputText = '';
let lastTokenizer = '';

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

    textInput = createElement('textarea', EXAMPLES.short);
    textInput.parent(document.querySelector('main'));
    textInput.attribute('rows', '3');
    textInput.style('width', '600px');
    textInput.style('font-family', 'Arial, sans-serif');
    textInput.style('font-size', '14px');
    textInput.style('padding', '6px');
    textInput.style('resize', 'vertical');
    textInput.input(retokenize);

    tokenizerSelect = createSelect();
    tokenizerSelect.parent(document.querySelector('main'));
    tokenizerSelect.option('BPE (cl100k-style)', 'bpe');
    tokenizerSelect.option('SentencePiece (Gemini-style)', 'sp');
    tokenizerSelect.changed(retokenize);

    btnShort = createButton('Load: short prompt');
    btnShort.parent(document.querySelector('main'));
    btnShort.mousePressed(() => loadExample('short'));

    btnLong = createButton('Load: long document');
    btnLong.parent(document.querySelector('main'));
    btnLong.mousePressed(() => loadExample('long'));

    btnCode = createButton('Load: code snippet');
    btnCode.parent(document.querySelector('main'));
    btnCode.mousePressed(() => loadExample('code'));

    btnJP = createButton('Load: Japanese');
    btnJP.parent(document.querySelector('main'));
    btnJP.mousePressed(() => loadExample('jp'));

    positionControls();
    retokenize();
}

function loadExample(key) {
    textInput.value(EXAMPLES[key]);
    retokenize();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    textInput.position(margin, drawHeight + 14);
    textInput.style('width', (containerWidth - 2 * margin - 8) + 'px');
    tokenizerSelect.position(margin, drawHeight + 80);
    btnShort.position(margin + 240, drawHeight + 80);
    btnLong.position(margin + 380, drawHeight + 80);
    btnCode.position(margin + 510, drawHeight + 80);
    btnJP.position(margin + 630, drawHeight + 80);
}

// Simplified BPE-style tokenizer.
// This is a *concept* tokenizer, not a real model tokenizer. The pattern is
// what we want learners to see: words are split into chunks, leading spaces
// stay attached, common prefixes get merged.
function tokenizeBPE(input) {
    const result = [];
    if (!input) return result;
    // Pre-tokenize: split on whitespace boundaries but keep the leading space
    const re = /(\s+)?(\S+)|(\s+)/g;
    let m;
    while ((m = re.exec(input)) !== null) {
        if (m[3] !== undefined) {
            // pure whitespace at end of string — usually subsumed; skip
            continue;
        }
        const lead = m[1] || '';
        const word = m[2] || '';
        if (!word) continue;
        // leading space + word
        const piece = lead.length > 0 ? '·' + word : word;
        // Heuristic: words of <= 4 chars are 1 token, 5-7 chars 1 token,
        // 8-12 chars 2 tokens (split mid-word), 13+ chars 3 tokens.
        const sub = bpeSubsplit(word, lead.length > 0);
        for (const s of sub) result.push(s);
    }
    return result;
}

function bpeSubsplit(word, hasLeadingSpace) {
    const parts = [];
    const display = hasLeadingSpace ? '·' + word : word;
    const len = word.length;
    if (len <= 7) {
        parts.push(display);
    } else if (len <= 12) {
        const cut = Math.ceil(len / 2);
        parts.push((hasLeadingSpace ? '·' : '') + word.slice(0, cut));
        parts.push(word.slice(cut));
    } else {
        const cut1 = Math.ceil(len / 3);
        const cut2 = Math.ceil((2 * len) / 3);
        parts.push((hasLeadingSpace ? '·' : '') + word.slice(0, cut1));
        parts.push(word.slice(cut1, cut2));
        parts.push(word.slice(cut2));
    }
    return parts;
}

// SentencePiece-style: splits at slightly different boundaries.
// Simulates the observation that SentencePiece tokenizers often produce
// 5-15% different counts on the same string.
function tokenizeSentencePiece(input) {
    const result = [];
    if (!input) return result;
    const re = /(\s+)?(\S+)|(\s+)/g;
    let m;
    while ((m = re.exec(input)) !== null) {
        if (m[3] !== undefined) continue;
        const lead = m[1] || '';
        const word = m[2] || '';
        if (!word) continue;
        const sub = spSubsplit(word, lead.length > 0);
        for (const s of sub) result.push(s);
    }
    return result;
}

function spSubsplit(word, hasLeadingSpace) {
    const parts = [];
    const len = word.length;
    if (len <= 5) {
        parts.push((hasLeadingSpace ? '_' : '') + word);
    } else if (len <= 9) {
        // SP tends to keep slightly longer chunks
        parts.push((hasLeadingSpace ? '_' : '') + word.slice(0, Math.ceil(len * 0.6)));
        parts.push(word.slice(Math.ceil(len * 0.6)));
    } else {
        const cut1 = Math.ceil(len / 3);
        const cut2 = Math.ceil((2 * len) / 3);
        parts.push((hasLeadingSpace ? '_' : '') + word.slice(0, cut1));
        parts.push(word.slice(cut1, cut2));
        parts.push(word.slice(cut2));
    }
    return parts;
}

// Very simplified token-id assignment: hash of token text into a 50000-range.
function tokenIdOf(text) {
    let h = 5381;
    for (let i = 0; i < text.length; i++) {
        h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    }
    return Math.abs(h) % 50000;
}

function retokenize() {
    const txt = textInput.value();
    const fam = tokenizerSelect.value();
    if (txt === lastInputText && fam === lastTokenizer) return;
    lastInputText = txt;
    lastTokenizer = fam;

    const raw = fam === 'sp' ? tokenizeSentencePiece(txt) : tokenizeBPE(txt);

    // Color by token text identity — same text gets same color.
    const colorMap = new Map();
    let colorIdx = 0;
    tokens = raw.map((t) => {
        let c;
        if (colorMap.has(t)) {
            c = colorMap.get(t);
        } else {
            c = PALETTE[colorIdx % PALETTE.length];
            colorMap.set(t, c);
            colorIdx++;
        }
        return { text: t, id: tokenIdOf(t), color: c };
    });
}

function draw() {
    background(248, 250, 252);
    drawHeader();
    drawCounters();
    drawTokenChips();
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
    text('Interactive Tokenizer Explorer', margin, 12);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Type or paste text. Watch how the tokenizer slices it into chips. Same text = same color.',
         margin, 34);
}

function drawCounters() {
    const txt = lastInputText;
    const chars = txt.length;
    const words = (txt.match(/\S+/g) || []).length;
    const tCount = tokens.length;

    const y = 60;
    const boxW = (containerWidth - 4 * margin) / 3;
    const items = [
        { label: 'Characters', value: chars, color: [120, 113, 108] },
        { label: 'Words',      value: words, color: [2, 119, 189] },
        { label: 'Tokens',     value: tCount, color: [193, 68, 14] }
    ];

    items.forEach((item, i) => {
        const x = margin + i * (boxW + margin);
        stroke(226, 232, 240);
        fill(255);
        rect(x, y, boxW, 56, 4);
        noStroke();
        fill(100, 116, 139);
        textAlign(LEFT, TOP);
        textSize(11);
        text(item.label, x + 12, y + 8);
        fill(...item.color);
        textSize(20);
        textStyle(BOLD);
        textAlign(LEFT, TOP);
        text(item.value.toLocaleString(), x + 12, y + 26);
        textStyle(NORMAL);
    });

    // Ratio annotation
    if (tCount > 0 && words > 0) {
        fill(100, 116, 139);
        textSize(11);
        textAlign(RIGHT, TOP);
        const ratio = (tCount / words).toFixed(2);
        text('Avg tokens / word: ' + ratio, containerWidth - margin, y + 8);
        const cpt = chars > 0 ? (chars / tCount).toFixed(2) : '0';
        text('Avg chars / token: ' + cpt, containerWidth - margin, y + 24);
    }
}

function drawTokenChips() {
    const y0 = 130;
    const xL = margin;
    const xR = containerWidth - margin;
    const w = xR - xL;
    const h = drawHeight - y0 - 12;

    stroke(226, 232, 240);
    fill(255);
    rect(xL, y0, w, h, 4);
    noStroke();

    fill(55, 71, 79);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Token chips (· = leading space, _ = SentencePiece prefix)', xL + 8, y0 + 6);
    textStyle(NORMAL);

    if (tokens.length === 0) {
        fill(148, 163, 184);
        textAlign(CENTER, CENTER);
        textSize(12);
        text('Type something in the text box below.', xL + w / 2, y0 + h / 2);
        return;
    }

    // Layout chips with wrapping
    const chipPad = 8;
    const chipH = 30;
    const chipGap = 6;
    const innerX = xL + 12;
    const innerW = w - 24;
    let cx = innerX;
    let cy = y0 + 32;

    textSize(13);
    for (let i = 0; i < tokens.length && cy + chipH * 2 < y0 + h - 8; i++) {
        const t = tokens[i];
        const tw = textWidth(t.text) + chipPad * 2;
        if (cx + tw > innerX + innerW) {
            cx = innerX;
            cy += chipH + 24 + chipGap;
        }
        // Chip background
        fill(...t.color);
        rect(cx, cy, tw, chipH, 4);
        // Chip text
        fill(31, 41, 55);
        textAlign(LEFT, CENTER);
        textSize(13);
        text(t.text, cx + chipPad, cy + chipH / 2);
        // Token id below
        fill(100, 116, 139);
        textSize(10);
        textAlign(LEFT, TOP);
        text('id: ' + t.id, cx + 1, cy + chipH + 2);
        cx += tw + chipGap;
    }

    // If clipped
    if (cy + chipH * 2 >= y0 + h - 8 && tokens.length > 0) {
        fill(148, 163, 184);
        textAlign(RIGHT, BOTTOM);
        textSize(10);
        text('(showing first chips — full count above)', xL + w - 8, y0 + h - 4);
    }
}

function drawControlLabels() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Input text', margin, drawHeight + 2);
    text('Tokenizer', margin, drawHeight + 64);
    textStyle(NORMAL);
}
