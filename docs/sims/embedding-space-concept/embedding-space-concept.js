// Embedding Space Concept - p5.js
// CANVAS_HEIGHT: 620
// Bloom Level: Understand (L2) - classify
// Learning objective: Classify words by their position in a 2D embedding
// projection and infer that nearness in embedding space reflects semantic
// similarity.

let canvas;
let canvasWidth = 880;
let drawHeight = 500;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
const margin = 16;

// Controls
let queryInput, findBtn, clearBtn, clusterCheck;

// Data: hand-positioned 2D coordinates approximating semantic clusters.
// Coordinates are in [0,1] x [0,1].
const POINTS = [
    // Animal cluster (upper-left)
    { word: 'panda',      x: 0.20, y: 0.20, cluster: 'animal' },
    { word: 'bear',       x: 0.27, y: 0.15, cluster: 'animal' },
    { word: 'fox',        x: 0.13, y: 0.27, cluster: 'animal' },
    { word: 'wolf',       x: 0.18, y: 0.30, cluster: 'animal' },
    { word: 'tiger',      x: 0.30, y: 0.25, cluster: 'animal' },
    // Vehicle cluster (lower-right)
    { word: 'car',        x: 0.75, y: 0.78, cluster: 'vehicle' },
    { word: 'truck',      x: 0.82, y: 0.74, cluster: 'vehicle' },
    { word: 'bus',        x: 0.78, y: 0.85, cluster: 'vehicle' },
    { word: 'bicycle',    x: 0.68, y: 0.82, cluster: 'vehicle' },
    { word: 'motorcycle', x: 0.85, y: 0.80, cluster: 'vehicle' },
    // Food cluster (upper-right)
    { word: 'bamboo',     x: 0.72, y: 0.20, cluster: 'food' },
    { word: 'apple',      x: 0.80, y: 0.25, cluster: 'food' },
    { word: 'rice',       x: 0.75, y: 0.32, cluster: 'food' },
    { word: 'bread',      x: 0.85, y: 0.18, cluster: 'food' },
    { word: 'pasta',      x: 0.78, y: 0.12, cluster: 'food' }
];

const CLUSTER_COLORS = {
    animal:  [46, 125, 50],
    vehicle: [2, 119, 189],
    food:    [193, 68, 14],
    unknown: [120, 113, 108]
};

// Heuristic word-to-cluster mapping for the "find nearest" simulation
const WORD_HINTS = {
    animal:  ['cat', 'dog', 'lion', 'mouse', 'rabbit', 'bird', 'eagle', 'frog', 'horse', 'cow', 'sheep', 'pig', 'elephant', 'giraffe', 'monkey', 'snake', 'fish', 'shark', 'whale', 'dolphin', 'panda', 'bear', 'fox', 'wolf', 'tiger', 'leopard', 'rat'],
    vehicle: ['plane', 'airplane', 'boat', 'ship', 'train', 'tram', 'scooter', 'helicopter', 'rocket', 'submarine', 'taxi', 'van', 'sedan', 'suv', 'jet', 'car', 'truck', 'bus', 'bicycle', 'motorcycle'],
    food:    ['banana', 'orange', 'grape', 'cheese', 'butter', 'sugar', 'salt', 'pepper', 'tomato', 'potato', 'onion', 'carrot', 'lettuce', 'milk', 'yogurt', 'cake', 'cookie', 'sandwich', 'pizza', 'soup', 'noodle', 'noodles', 'salad', 'bamboo', 'apple', 'rice', 'bread', 'pasta', 'meat']
};

let queryPoint = null; // {word, x, y, cluster, neighbors}

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

    queryInput = createInput('');
    queryInput.parent(document.querySelector('main'));
    queryInput.attribute('placeholder', 'Type a word (e.g. dog, plane, cheese)');
    queryInput.style('width', '300px');
    queryInput.style('font-size', '14px');
    queryInput.style('padding', '6px');

    findBtn = createButton('Find nearest');
    findBtn.parent(document.querySelector('main'));
    findBtn.mousePressed(findNearest);

    clearBtn = createButton('Clear query');
    clearBtn.parent(document.querySelector('main'));
    clearBtn.mousePressed(() => { queryPoint = null; queryInput.value(''); });

    clusterCheck = createCheckbox('Show cluster regions', true);
    clusterCheck.parent(document.querySelector('main'));

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, canvasHeight);
    positionControls();
}

function positionControls() {
    queryInput.position(margin, drawHeight + 36);
    findBtn.position(margin + 320, drawHeight + 34);
    clearBtn.position(margin + 430, drawHeight + 34);
    clusterCheck.position(margin, drawHeight + 76);
}

function inferCluster(word) {
    const w = (word || '').trim().toLowerCase();
    if (!w) return null;
    for (const cl of Object.keys(WORD_HINTS)) {
        if (WORD_HINTS[cl].includes(w)) return cl;
    }
    return 'unknown';
}

function findNearest() {
    const word = (queryInput.value() || '').trim().toLowerCase();
    if (!word) return;
    const cluster = inferCluster(word);
    // Place the query near the centroid of its inferred cluster (or center if unknown)
    let cx, cy;
    if (cluster === 'unknown' || cluster === null) {
        cx = 0.5; cy = 0.5;
    } else {
        const members = POINTS.filter(p => p.cluster === cluster);
        cx = members.reduce((s, p) => s + p.x, 0) / members.length;
        cy = members.reduce((s, p) => s + p.y, 0) / members.length;
        // Add a small random offset so the marker doesn't sit exactly on a centroid
        cx += (Math.random() - 0.5) * 0.05;
        cy += (Math.random() - 0.5) * 0.05;
    }
    // Find 3 nearest existing points by Euclidean distance
    const dists = POINTS.map(p => ({ p, d: Math.hypot(p.x - cx, p.y - cy) }));
    dists.sort((a, b) => a.d - b.d);
    const neighbors = dists.slice(0, 3);
    queryPoint = { word, x: cx, y: cy, cluster, neighbors };
}

function draw() {
    background(248, 250, 252);
    drawHeader();
    drawScatter();
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
    text('Embedding Space Concept', margin, 12);
    textStyle(NORMAL);
    textSize(11);
    fill(100, 116, 139);
    text('Words near each other share meaning. Three clusters appear: animals, vehicles, foods.',
         margin, 34);
}

function drawScatter() {
    const x0 = margin;
    const y0 = 60;
    const w = containerWidth - 2 * margin;
    const h = drawHeight - y0 - 8;

    stroke(226, 232, 240);
    fill(255);
    rect(x0, y0, w, h, 6);
    noStroke();

    const padL = 50, padR = 16, padT = 16, padB = 36;
    const innerL = x0 + padL;
    const innerR = x0 + w - padR;
    const innerT = y0 + padT;
    const innerB = y0 + h - padB;
    const toX = (vx) => map(vx, 0, 1, innerL, innerR);
    const toY = (vy) => map(vy, 0, 1, innerT, innerB);

    // Cluster regions
    if (clusterCheck.checked()) {
        const groups = {};
        POINTS.forEach(p => {
            if (!groups[p.cluster]) groups[p.cluster] = [];
            groups[p.cluster].push(p);
        });
        for (const cl of Object.keys(groups)) {
            const pts = groups[cl];
            const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
            const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
            // Approximate radius
            let rad = 0;
            for (const p of pts) {
                rad = Math.max(rad, Math.hypot(p.x - cx, p.y - cy));
            }
            rad *= 1.4;
            const c = CLUSTER_COLORS[cl];
            noStroke();
            fill(c[0], c[1], c[2], 36);
            ellipse(toX(cx), toY(cy), rad * (innerR - innerL) * 2, rad * (innerB - innerT) * 2);
        }
    }

    // Axes
    stroke(203, 213, 225);
    strokeWeight(1);
    line(innerL, innerB, innerR, innerB);
    line(innerL, innerT, innerL, innerB);
    noStroke();
    fill(100, 116, 139);
    textSize(10);
    textAlign(CENTER, TOP);
    text('Embedding dim 1', (innerL + innerR) / 2, innerB + 6);
    push();
    translate(x0 + 14, (innerT + innerB) / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    text('Embedding dim 2', 0, 0);
    pop();

    // Plot points
    POINTS.forEach(p => {
        const c = CLUSTER_COLORS[p.cluster];
        const px = toX(p.x);
        const py = toY(p.y);
        fill(...c);
        noStroke();
        circle(px, py, 10);
        fill(31, 41, 55);
        textSize(11);
        textAlign(LEFT, CENTER);
        text(p.word, px + 8, py);
    });

    // Query marker
    if (queryPoint) {
        const qx = toX(queryPoint.x);
        const qy = toY(queryPoint.y);
        // Draw lines to neighbors first
        queryPoint.neighbors.forEach(n => {
            const nx = toX(n.p.x);
            const ny = toY(n.p.y);
            stroke(193, 68, 14);
            strokeWeight(1.5);
            drawingContext.setLineDash([4, 3]);
            line(qx, qy, nx, ny);
            drawingContext.setLineDash([]);
            // Distance label
            noStroke();
            fill(193, 68, 14);
            textSize(10);
            textAlign(CENTER, CENTER);
            text(n.d.toFixed(2), (qx + nx) / 2 + 4, (qy + ny) / 2 - 6);
        });
        strokeWeight(1);
        // Star marker
        push();
        translate(qx, qy);
        fill(250, 204, 21);
        stroke(180, 83, 9);
        strokeWeight(1.5);
        beginShape();
        for (let i = 0; i < 10; i++) {
            const ang = -HALF_PI + i * (TWO_PI / 10);
            const r = (i % 2 === 0) ? 9 : 4;
            vertex(cos(ang) * r, sin(ang) * r);
        }
        endShape(CLOSE);
        pop();
        noStroke();
        fill(31, 41, 55);
        textAlign(LEFT, CENTER);
        textSize(12);
        textStyle(BOLD);
        text('"' + queryPoint.word + '"', qx + 12, qy - 12);
        textStyle(NORMAL);

        // Result panel
        const px = innerR - 200;
        const py = innerT + 10;
        fill(255, 251, 235);
        stroke(217, 119, 6);
        rect(px, py, 190, 86, 4);
        noStroke();
        fill(120, 53, 15);
        textAlign(LEFT, TOP);
        textSize(11);
        textStyle(BOLD);
        text('Nearest neighbors:', px + 8, py + 6);
        textStyle(NORMAL);
        queryPoint.neighbors.forEach((n, i) => {
            fill(31, 41, 55);
            text((i + 1) + '. ' + n.p.word, px + 12, py + 24 + i * 16);
            fill(193, 68, 14);
            text('d=' + n.d.toFixed(2), px + 110, py + 24 + i * 16);
        });
    }

    // Legend
    const lx = innerL + 4;
    const ly = innerT + 4;
    textAlign(LEFT, TOP);
    textSize(10);
    let lineY = ly;
    Object.keys(CLUSTER_COLORS).filter(c => c !== 'unknown').forEach(cl => {
        const col = CLUSTER_COLORS[cl];
        fill(...col);
        circle(lx + 6, lineY + 6, 8);
        fill(71, 85, 105);
        text(cl, lx + 16, lineY + 2);
        lineY += 14;
    });
}

function drawControlLabels() {
    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(12);
    textStyle(BOLD);
    text('Find nearest neighbor', margin, drawHeight + 14);
    textStyle(NORMAL);
    fill(100, 116, 139);
    textSize(10);
    text('Type a word and click "Find nearest". The marker is placed near its semantic cluster.',
         margin, drawHeight + 100);
}
