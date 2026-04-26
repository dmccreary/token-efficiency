// OpenAI Token Usage Object Anatomy - labeled JSON to billing categories
// CANVAS_HEIGHT: 640
// Bloom Level: Remember (L1) - identify
// Learning objective: Identify each field of the OpenAI token usage object
// and map it to its billing category.

let canvas;
const canvasWidth = 880;
const drawHeight = 560;
const controlHeight = 80;
const canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

let modelToggle;
let resetButton;

// Two response shapes
const RESPONSE_GPT4O = {
    id: '"chatcmpl-9XqL2..."',
    model: '"gpt-4o-2024-08-06"',
    choices: '[ { "message": { "role": "assistant", "content": "..." }, "finish_reason": "stop" } ]',
    usage: {
        prompt_tokens: 1280,
        completion_tokens: 240,
        total_tokens: 1520
    }
};
const RESPONSE_O3 = {
    id: '"chatcmpl-aZ9k8..."',
    model: '"o3-2025-01-31"',
    choices: '[ { "message": { "role": "assistant", "content": "..." }, "finish_reason": "stop" } ]',
    usage: {
        prompt_tokens: 1280,
        completion_tokens: 1840,
        total_tokens: 3120,
        completion_tokens_details: {
            reasoning_tokens: 1600
        }
    }
};

// Rate-card lookup (illustrative $/1M tokens)
const RATES = {
    'gpt-4o': { input: 2.50, output: 10.00 },
    'o3':     { input: 2.00, output: 8.00 }
};

// Hover state
let hoverField = null;

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    const w = el.clientWidth;
    containerWidth = Math.max(540, Math.min(w, canvasWidth));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');

    modelToggle = createCheckbox('Show o3 (reasoning model) response', false);
    modelToggle.parent(document.querySelector('main'));

    resetButton = createButton('Reset hover');
    resetButton.parent(document.querySelector('main'));
    resetButton.mousePressed(() => { hoverField = null; });

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    modelToggle.position(margin, drawHeight + 20);
    resetButton.position(margin, drawHeight + 50);
}

function getResponse() {
    return modelToggle && modelToggle.checked() ? RESPONSE_O3 : RESPONSE_GPT4O;
}

// Layout zones
function jsonZone() {
    return { x: margin, y: 60, w: containerWidth * 0.55 - margin, h: drawHeight - 80 };
}
function boxZone() {
    const j = jsonZone();
    return { x: j.x + j.w + 100, y: j.y, w: containerWidth - j.x - j.w - 100 - margin, h: j.h };
}

// JSON field clickable rows: each has an id and a y-position computed at draw time
// We store rectangles after each draw so mouse hover works.
let fieldRects = [];

function draw() {
    background(248, 250, 252);
    drawTitle();
    fieldRects = [];

    drawJsonBlock();
    drawBillingBoxes();
    drawConnectingLines();
    drawRateCard();
    drawHoverDetail();

    // Divider
    stroke(203, 213, 225);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();
}

function drawTitle() {
    fill(31, 41, 55);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(17);
    textStyle(BOLD);
    text('OpenAI Token Usage Object Anatomy', margin, 14);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Hover any blue field on the left; the matching billing category on the right highlights.',
        margin, 36);
}

function drawJsonBlock() {
    const z = jsonZone();
    stroke(226, 232, 240);
    fill(255);
    rect(z.x, z.y, z.w, z.h, 4);
    noStroke();

    // Block label
    fill(55, 71, 79);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Chat Completions response', z.x + 8, z.y + 6);
    textStyle(NORMAL);

    const lineH = 18;
    let y = z.y + 28;
    const x = z.x + 12;
    const r = getResponse();
    const isO3 = modelToggle && modelToggle.checked();

    textFont('Menlo');
    textSize(11.5);
    // Render with field-level hit rectangles
    line1(x, y, '{'); y += lineH;
    fieldRects.push(addLine(x + 16, y, '"id":', r.id + ',', 'id'));            y += lineH;
    fieldRects.push(addLine(x + 16, y, '"model":', r.model + ',', 'model'));   y += lineH;
    fieldRects.push(addLine(x + 16, y, '"choices":', '[ ... ],', 'choices'));  y += lineH;
    fieldRects.push(addLine(x + 16, y, '"usage":', '{', 'usage'));              y += lineH;
    fieldRects.push(addLine(x + 32, y, '"prompt_tokens":', r.usage.prompt_tokens + ',', 'prompt_tokens')); y += lineH;
    fieldRects.push(addLine(x + 32, y, '"completion_tokens":', r.usage.completion_tokens + ',', 'completion_tokens')); y += lineH;
    fieldRects.push(addLine(x + 32, y, '"total_tokens":', r.usage.total_tokens + (isO3 ? ',' : ''), 'total_tokens')); y += lineH;
    if (isO3) {
        fieldRects.push(addLine(x + 32, y, '"completion_tokens_details":', '{', 'completion_tokens_details')); y += lineH;
        fieldRects.push(addLine(x + 48, y, '"reasoning_tokens":', r.usage.completion_tokens_details.reasoning_tokens + '', 'reasoning_tokens')); y += lineH;
        line1(x + 32, y, '}'); y += lineH;
    }
    line1(x + 16, y, '}'); y += lineH;
    line1(x, y, '}'); y += lineH;
    textFont('Arial');
}

function line1(x, y, txt) {
    fill(71, 85, 105);
    textAlign(LEFT, TOP);
    text(txt, x, y);
}
function addLine(x, y, key, val, fieldId) {
    // Highlight target fields (anything related to usage / model)
    const isHighlighted = ['model','prompt_tokens','completion_tokens','total_tokens',
                           'reasoning_tokens','completion_tokens_details','usage'].includes(fieldId);
    const isHovered = hoverField === fieldId;
    const w = textWidth(key + ' ' + val);
    if (isHighlighted) {
        noStroke();
        fill(isHovered ? 219 : 240, isHovered ? 234 : 249, isHovered ? 254 : 255);
        rect(x - 4, y - 2, w + 14, 16, 2);
    }
    fill(2, 119, 189); // key
    text(key, x, y);
    fill(71, 85, 105); // value
    text(' ' + val, x + textWidth(key), y);
    return { id: fieldId, x: x - 4, y: y - 2, w: w + 14, h: 16 };
}

function drawBillingBoxes() {
    const z = boxZone();
    stroke(226, 232, 240);
    fill(255);
    rect(z.x, z.y, z.w, z.h, 4);
    noStroke();

    fill(55, 71, 79);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Billing categories', z.x + 8, z.y + 6);
    textStyle(NORMAL);

    // Stack four boxes
    const isO3 = modelToggle && modelToggle.checked();
    const boxes = [
        { id: 'box-input',     label: 'Input',    sub: 'usage.prompt_tokens',     value: getResponse().usage.prompt_tokens,     color: [2,119,189],   match: 'prompt_tokens' },
        { id: 'box-output',    label: 'Output',   sub: 'usage.completion_tokens', value: getResponse().usage.completion_tokens, color: [193,68,14],   match: 'completion_tokens' },
        { id: 'box-reasoning', label: 'Reasoning (sub-component of Output)', sub: 'usage.completion_tokens_details.reasoning_tokens',
            value: isO3 ? getResponse().usage.completion_tokens_details.reasoning_tokens : '— (not present on gpt-4o)',
            color: [124,58,237], match: 'reasoning_tokens', dim: !isO3 },
        { id: 'box-total',     label: 'Total (check)', sub: 'usage.total_tokens',  value: getResponse().usage.total_tokens,      color: [46,125,50],   match: 'total_tokens' }
    ];
    const boxH = (z.h - 28 - 12) / boxes.length;
    let by = z.y + 28;
    boxRects = [];
    boxes.forEach(b => {
        const isHover = hoverField === b.match;
        const dim = b.dim;
        stroke(...b.color);
        strokeWeight(isHover ? 3 : 1.4);
        fill(dim ? '#f1f5f9' : (isHover ? '#eff6ff' : '#fff'));
        rect(z.x + 8, by, z.w - 16, boxH - 6, 4);
        noStroke();
        strokeWeight(1);

        textAlign(LEFT, TOP);
        textSize(13);
        fill(...b.color);
        textStyle(BOLD);
        text(b.label, z.x + 16, by + 8);
        textStyle(NORMAL);

        textSize(11);
        fill(100, 116, 139);
        textFont('Menlo');
        text(b.sub, z.x + 16, by + 28);
        textFont('Arial');

        textSize(15);
        fill(31, 41, 55);
        textStyle(BOLD);
        text(typeof b.value === 'number' ? b.value.toLocaleString() : b.value, z.x + 16, by + 46);
        textStyle(NORMAL);

        boxRects.push({ id: 'box-' + b.match, x: z.x + 8, y: by, w: z.w - 16, h: boxH - 6, match: b.match });
        by += boxH;
    });
}
let boxRects = [];

function drawConnectingLines() {
    // Connect each fieldRect (matching usage.*) to the corresponding box
    if (!fieldRects.length || !boxRects.length) return;
    stroke(180, 190, 210);
    strokeWeight(1);
    fieldRects.forEach(fr => {
        if (!fr || !fr.id) return;
        const target = boxRects.find(b => b.match === fr.id);
        if (!target) return;
        const x1 = fr.x + fr.w + 2;
        const y1 = fr.y + fr.h / 2;
        const x2 = target.x + 0;
        const y2 = target.y + target.h / 2;
        const isActive = hoverField === fr.id;
        if (isActive) { stroke(193, 68, 14); strokeWeight(2); }
        else          { stroke(203, 213, 225); strokeWeight(1); }
        // Curved line via bezier
        const cx = (x1 + x2) / 2;
        noFill();
        bezier(x1, y1, cx, y1, cx, y2, x2, y2);
    });
    strokeWeight(1);
    noStroke();
}

function drawRateCard() {
    const isO3 = modelToggle && modelToggle.checked();
    const r = isO3 ? RATES.o3 : RATES['gpt-4o'];
    const modelName = isO3 ? 'o3' : 'gpt-4o';
    // Bottom-left under the JSON
    const x = margin + 12;
    const y = drawHeight - 80;
    const w = jsonZone().w - 16;
    stroke(193, 68, 14, 180);
    strokeWeight(1.4);
    fill(255, 247, 237);
    rect(x, y, w, 64, 4);
    noStroke();
    fill(124, 45, 18);
    textSize(11);
    textStyle(BOLD);
    text('Rate card lookup (from "model" field)', x + 8, y + 6);
    textStyle(NORMAL);
    textSize(12);
    fill(31, 41, 55);
    text(`Model: ${modelName}`,         x + 8, y + 24);
    text(`Input:  $${r.input.toFixed(2)} / 1M tokens`,  x + 8, y + 40);
    text(`Output: $${r.output.toFixed(2)} / 1M tokens`, x + 200, y + 40);
}

function drawHoverDetail() {
    if (!hoverField) {
        const z = boxZone();
        fill(100, 116, 139);
        textSize(11);
        textAlign(LEFT, TOP);
        text('Hover a highlighted field on the left to see the math.', z.x + 8, z.y + z.h - 28);
        return;
    }
    const r = getResponse();
    const isO3 = modelToggle && modelToggle.checked();
    const rate = isO3 ? RATES.o3 : RATES['gpt-4o'];
    let math = '';
    switch (hoverField) {
        case 'prompt_tokens':
            math = `Input cost = ${r.usage.prompt_tokens.toLocaleString()} x $${rate.input.toFixed(2)} / 1M = $${(r.usage.prompt_tokens * rate.input / 1e6).toFixed(5)}`;
            break;
        case 'completion_tokens':
            math = `Output cost = ${r.usage.completion_tokens.toLocaleString()} x $${rate.output.toFixed(2)} / 1M = $${(r.usage.completion_tokens * rate.output / 1e6).toFixed(5)}`;
            break;
        case 'reasoning_tokens':
            math = isO3
                ? `Reasoning tokens are billed AS OUTPUT: ${r.usage.completion_tokens_details.reasoning_tokens.toLocaleString()} x $${rate.output.toFixed(2)} / 1M (already inside completion_tokens)`
                : 'Not present on gpt-4o (only reasoning models like o1, o3, o4 emit this field).';
            break;
        case 'total_tokens':
            math = `Sum check: ${r.usage.prompt_tokens.toLocaleString()} + ${r.usage.completion_tokens.toLocaleString()} = ${r.usage.total_tokens.toLocaleString()}`;
            break;
        case 'model':
            math = `Looks up the rate card. Input/Output prices vary per model family.`;
            break;
        case 'usage':
        case 'completion_tokens_details':
            math = '(Container — see fields inside.)';
            break;
        default:
            math = '';
    }
    const z = boxZone();
    fill(255);
    stroke(193, 68, 14);
    strokeWeight(1.2);
    rect(z.x + 4, z.y + z.h - 56, z.w - 8, 48, 4);
    noStroke();
    fill(193, 68, 14);
    textSize(11);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('Math for hovered field', z.x + 12, z.y + z.h - 50);
    textStyle(NORMAL);
    textSize(11);
    fill(31, 41, 55);
    text(math, z.x + 12, z.y + z.h - 32, z.w - 24);
}

function mouseMoved() {
    if (!fieldRects) return;
    let found = null;
    for (const r of fieldRects) {
        if (!r) continue;
        if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
            found = r.id;
            break;
        }
    }
    if (!found) {
        for (const b of boxRects) {
            if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
                found = b.match; break;
            }
        }
    }
    hoverField = found;
}
