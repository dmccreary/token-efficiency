// Cross-Vendor Token Count Drift - p5.js
// CANVAS_HEIGHT: 820
// Bloom Level: Evaluate (L5) - assess
// Learning objective: Assess which vendor offers the lowest cost for a given
// content shape by comparing tokenizations across all three vendors.

let canvas;
const canvasWidth = 920;
const drawHeight = 600;
const controlHeight = 220;
const canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

let textArea;
let btnEnglish, btnCode, btnMulti, btnLong;
let claudeModel, openaiModel, geminiModel;

// Sample texts (default)
const SAMPLES = {
    english: 'The agent processes user requests asynchronously, dispatching tool calls in parallel where possible to minimize wall-clock latency.',
    code: 'function tokenizeText(input) {\n  const tokens = input.match(/\\w+|[^\\s\\w]/g);\n  return tokens.filter(t => t.length > 0);\n}',
    multi: 'The agent processes requests. エージェントはリクエストを処理します。 The Japanese characters often cost more tokens.',
    long: 'In a typical retrieval-augmented generation pipeline, the application first embeds the user query, retrieves the top-k most relevant document chunks from a vector database, concatenates those chunks into a context window, and finally sends the augmented prompt to the language model along with the user message. The cost of this pipeline scales with both the number of retrieved chunks and the average chunk size. '.repeat(20)
};

// Pricing (USD per 1M input tokens — illustrative)
const RATES = {
    claude: { 'sonnet': 3.00, 'haiku': 0.80 },
    openai: { 'gpt-4o': 2.50, 'gpt-4o-mini': 0.15 },
    gemini: { 'pro': 1.25, 'flash': 0.075 }
};

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    const w = el.clientWidth;
    containerWidth = Math.max(720, Math.min(w, canvasWidth));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');

    textArea = createElement('textarea', SAMPLES.english);
    textArea.parent(document.querySelector('main'));
    textArea.attribute('rows', '3');
    textArea.style('font-family', 'Menlo, monospace');
    textArea.style('font-size', '12px');
    textArea.style('padding', '6px');

    btnEnglish = createButton('Load: English prose');
    btnCode    = createButton('Load: Code snippet');
    btnMulti   = createButton('Load: Multilingual');
    btnLong    = createButton('Load: Long document');
    [btnEnglish, btnCode, btnMulti, btnLong].forEach(b => b.parent(document.querySelector('main')));
    btnEnglish.mousePressed(() => textArea.value(SAMPLES.english));
    btnCode.mousePressed(()    => textArea.value(SAMPLES.code));
    btnMulti.mousePressed(()   => textArea.value(SAMPLES.multi));
    btnLong.mousePressed(()    => textArea.value(SAMPLES.long));

    claudeModel = createSelect();
    claudeModel.parent(document.querySelector('main'));
    claudeModel.option('Claude Sonnet ($3.00 / 1M)', 'sonnet');
    claudeModel.option('Claude Haiku ($0.80 / 1M)', 'haiku');
    openaiModel = createSelect();
    openaiModel.parent(document.querySelector('main'));
    openaiModel.option('GPT-4o ($2.50 / 1M)', 'gpt-4o');
    openaiModel.option('GPT-4o mini ($0.15 / 1M)', 'gpt-4o-mini');
    geminiModel = createSelect();
    geminiModel.parent(document.querySelector('main'));
    geminiModel.option('Gemini Pro ($1.25 / 1M)', 'pro');
    geminiModel.option('Gemini Flash ($0.075 / 1M)', 'flash');

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    textArea.position(margin, drawHeight + 18);
    textArea.size(containerWidth - 2 * margin, 60);

    const btnY = drawHeight + 90;
    btnEnglish.position(margin, btnY);
    btnCode.position(margin + 150, btnY);
    btnMulti.position(margin + 290, btnY);
    btnLong.position(margin + 420, btnY);

    const selY = drawHeight + 130;
    claudeModel.position(margin,           selY);
    openaiModel.position(margin + 220,     selY);
    geminiModel.position(margin + 460,     selY);
}

// ---- Illustrative tokenization simulators (NOT bit-exact) ----
// Each vendor uses a slightly different BPE; we simulate the COUNT shape:
//  - Claude (Anthropic): ~1.2x English baseline, slightly aggressive on punctuation
//  - OpenAI (cl100k):    ~1.0x English baseline (reference)
//  - Gemini (SentencePiece): ~0.95x English on prose, but worse on code

function tokenizeClaude(text) {
    // approx: split on word + punctuation, slightly more aggressive on CJK
    const baseTokens = text.match(/\w+|\S/g) || [];
    // CJK / non-Latin: each char becomes ~1 token
    const cjk = (text.match(/[　-鿿]/g) || []).length;
    const count = Math.max(1, Math.round(baseTokens.length * 1.05) + Math.round(cjk * 1.5));
    return { count, baseTokens };
}
function tokenizeOpenAI(text) {
    const baseTokens = text.match(/\w+|\S/g) || [];
    const cjk = (text.match(/[　-鿿]/g) || []).length;
    const count = Math.max(1, Math.round(baseTokens.length * 0.92) + Math.round(cjk * 1.2));
    return { count, baseTokens };
}
function tokenizeGemini(text) {
    const baseTokens = text.match(/\w+|\S/g) || [];
    // Gemini SentencePiece tends to be more efficient on prose
    const cjk = (text.match(/[　-鿿]/g) || []).length;
    // but slightly worse on code (treats punctuation as separate tokens)
    const codeChars = (text.match(/[\(\){};=<>\\\[\]]/g) || []).length;
    const count = Math.max(1, Math.round(baseTokens.length * 0.85) + Math.round(cjk * 1.0) + Math.round(codeChars * 0.5));
    return { count, baseTokens };
}

function draw() {
    background(248, 250, 252);
    drawHeader();
    drawColumns();
    drawCostBars();
    // Divider
    stroke(203, 213, 225);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();
    // Control labels
    drawControlLabels();
}

function drawHeader() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(17);
    textStyle(BOLD);
    text('Cross-Vendor Token Count Drift', margin, 14);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Type or paste text below; see how each vendor tokenizes it and which is cheapest for the input.',
        margin, 36);
}

function drawColumns() {
    const text = textArea.value();
    const claude = tokenizeClaude(text);
    const oai    = tokenizeOpenAI(text);
    const gem    = tokenizeGemini(text);

    const colY = 65;
    const colH = 360;
    const totalW = containerWidth - 2 * margin;
    const colW = (totalW - 16) / 3;
    const cols = [
        { name: 'Claude (Anthropic)', tok: claude, color: [193, 68, 14] },
        { name: 'OpenAI',             tok: oai,    color: [2, 119, 189] },
        { name: 'Gemini (Google)',    tok: gem,    color: [46, 125, 50] }
    ];
    // Determine cheapest by raw token count for green-highlight
    const minCount = Math.min(claude.count, oai.count, gem.count);
    cols.forEach((col, idx) => {
        const x = margin + idx * (colW + 8);
        const isCheapest = col.tok.count === minCount;
        // Frame
        stroke(...col.color);
        strokeWeight(isCheapest ? 3 : 1.5);
        fill(255);
        rect(x, colY, colW, colH, 4);
        noStroke();
        strokeWeight(1);

        // Header
        fill(...col.color);
        textAlign(LEFT, TOP);
        textSize(13);
        textStyle(BOLD);
        text(col.name, x + 10, colY + 8);
        textStyle(NORMAL);
        textSize(11);
        fill(71, 85, 105);
        text(`${col.tok.count} tokens`, x + 10, colY + 28);
        if (isCheapest) {
            fill(46, 125, 50);
            textStyle(BOLD);
            text('Cheapest count', x + colW - 102, colY + 28);
            textStyle(NORMAL);
        }

        // Token chips
        drawChips(col.tok.baseTokens.slice(0, 80), x + 8, colY + 50, colW - 16, colH - 60, col.color);
    });
}

function drawChips(tokens, x, y, w, h, color) {
    let cx = x + 4;
    let cy = y + 4;
    const lineH = 18;
    textSize(10);
    textFont('Menlo');
    textAlign(LEFT, TOP);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const tw = Math.max(14, textWidth(t) + 8);
        if (cx + tw > x + w - 4) {
            cx = x + 4;
            cy += lineH;
            if (cy + lineH > y + h - 6) break;
        }
        // chip bg
        fill(color[0], color[1], color[2], 30);
        stroke(color[0], color[1], color[2], 80);
        rect(cx, cy, tw, lineH - 4, 3);
        noStroke();
        fill(31, 41, 55);
        text(t, cx + 4, cy + 1);
        cx += tw + 3;
    }
    if (tokens.length > 80) {
        fill(100, 116, 139);
        textSize(10);
        text('... (more tokens hidden)', x + 4, y + h - 16);
    }
    textFont('Arial');
}

function drawCostBars() {
    const text = textArea.value();
    const claude = tokenizeClaude(text);
    const oai    = tokenizeOpenAI(text);
    const gem    = tokenizeGemini(text);
    const cm = claudeModel.value();
    const om = openaiModel.value();
    const gm = geminiModel.value();
    const cR = RATES.claude[cm];
    const oR = RATES.openai[om];
    const gR = RATES.gemini[gm];
    const costs = [
        { name: `Claude ${cm}`,  count: claude.count, rate: cR, cost: claude.count * cR / 1e6, color: [193, 68, 14] },
        { name: `OpenAI ${om}`,  count: oai.count,    rate: oR, cost: oai.count    * oR / 1e6, color: [2, 119, 189] },
        { name: `Gemini ${gm}`,  count: gem.count,    rate: gR, cost: gem.count    * gR / 1e6, color: [46, 125, 50] }
    ];
    const minCost = Math.min(...costs.map(c => c.cost));
    const maxCost = Math.max(...costs.map(c => c.cost));

    const y0 = 440;
    const h = 150;
    fill(255);
    stroke(226, 232, 240);
    rect(margin, y0, containerWidth - 2 * margin, h, 4);
    noStroke();
    fill(55, 71, 79);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Per-vendor cost for this input', margin + 10, y0 + 8);
    textStyle(NORMAL);

    const barX0 = margin + 140;
    const barW = containerWidth - 2 * margin - 140 - 100;
    costs.forEach((c, idx) => {
        const by = y0 + 36 + idx * 30;
        const isCheap = (c.cost === minCost);
        // Label
        fill(31, 41, 55);
        textSize(11);
        textAlign(LEFT, CENTER);
        text(c.name, margin + 10, by + 9);
        // Bar
        const w = (c.cost / maxCost) * barW;
        fill(c.color[0], c.color[1], c.color[2], isCheap ? 230 : 140);
        rect(barX0, by, w, 18, 3);
        // Cost label
        fill(31, 41, 55);
        textAlign(LEFT, CENTER);
        textSize(11);
        const dollarStr = '$' + c.cost.toFixed(6);
        text(dollarStr, barX0 + w + 6, by + 9);
        if (isCheap) {
            fill(46, 125, 50);
            textStyle(BOLD);
            textAlign(RIGHT, CENTER);
            text('Cheapest', containerWidth - margin - 8, by + 9);
            textStyle(NORMAL);
        }
    });

    // Recommendation line
    const cheapest = costs.reduce((a, b) => a.cost < b.cost ? a : b);
    fill(46, 125, 50);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(`Recommendation: ${cheapest.name} for this input shape ($${cheapest.cost.toFixed(6)})`,
        margin + 10, y0 + h - 22);
    textStyle(NORMAL);
}

function drawControlLabels() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text('Input text', margin, drawHeight + 4);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Load a sample, or paste your own. Cost recomputes live.', margin + 80, drawHeight + 6);

    fill(31, 41, 55);
    textSize(12);
    textStyle(BOLD);
    text('Sample loaders', margin, drawHeight + 78);
    textStyle(NORMAL);

    text('Per-vendor model selectors', margin, drawHeight + 118);
}
