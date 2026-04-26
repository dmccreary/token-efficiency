// Continuous Cost Operating Model - p5.js concentric-rings infographic
// CANVAS_HEIGHT: 660
// Bloom Level: Create (L6) - design
// LO: Design a continuous cost-monitoring operating model that sustains engineering capability over time.

let canvas;
const cw = 800, ch = 660;
let containerW;
let ownersToggle, customizeToggle;
let activities = []; // hovered activity index

const RINGS = [
    { name: 'Daily',     activities: [
        { label: 'Dashboard checks',           role: 'engineer', artifact: 'No artifact — eyeballs only' },
        { label: 'Alert response',             role: 'engineer', artifact: 'Incident ticket if alert is real' },
        { label: 'Regression-test results',    role: 'engineer', artifact: 'CI report' }
    ] },
    { name: 'Weekly',    activities: [
        { label: 'EM review',                  role: 'em',       artifact: 'Reviewed manager-weekly-report' },
        { label: 'Backlog grooming',           role: 'em',       artifact: 'Updated optimization backlog' },
        { label: 'Manager weekly report',      role: 'em',       artifact: 'manager-weekly-report.md' }
    ] },
    { name: 'Monthly',   activities: [
        { label: 'Cost analysis notebook',     role: 'engineer', artifact: 'Top-N drivers, P50/P95/P99 stats' },
        { label: 'Before-after reports',       role: 'engineer', artifact: 'Per-shipped-optimization evidence' },
        { label: 'Budget vs actual',           role: 'finance',  artifact: 'Variance report, root-cause notes' }
    ] },
    { name: 'Quarterly', activities: [
        { label: 'Set new cost target',        role: 'em',       artifact: 'cost-reduction-target.md' },
        { label: 'Refresh benchmark',          role: 'engineer', artifact: 'reproducible-benchmark.json' },
        { label: 'Update budget policy',       role: 'compliance', artifact: 'budget-policy-document.md' },
        { label: 'Plan next quarter theme',    role: 'em',       artifact: 'OKR or theme doc' }
    ] }
];

const ROLE_COLORS = {
    engineer:   [2, 119, 189],
    em:         [123, 31, 162],
    finance:    [46, 125, 50],
    compliance: [193, 68, 14]
};

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    containerW = Math.max(360, Math.min(el.clientWidth, cw));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerW, ch);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');
    ownersToggle = createCheckbox('Show owners (color by role)', true);
    ownersToggle.parent(document.querySelector('main'));
    customizeToggle = createCheckbox('Highlight critical artifacts', false);
    customizeToggle.parent(document.querySelector('main'));
}
function windowResized() { updateCanvasSize(); resizeCanvas(containerW, ch); }

function activityAt(mx, my) {
    for (let i = 0; i < activities.length; i++) {
        const a = activities[i];
        if (dist(mx, my, a.x, a.y) < 16) return i;
    }
    return -1;
}

function draw() {
    background(248, 250, 252);
    noStroke();
    fill(31, 41, 55);
    textSize(17); textStyle(BOLD); textAlign(CENTER, TOP);
    text('Continuous Cost Operating Model', containerW / 2, 14);
    textStyle(NORMAL); textSize(11); fill(100, 116, 139);
    text('Daily → Weekly → Monthly → Quarterly. Information flows outward.', containerW / 2, 38);

    const cx = containerW / 2, cy = ch / 2 + 20;
    const ringRadii = [80, 140, 200, 260];
    const showOwners = ownersToggle.checked();
    const highlightCritical = customizeToggle.checked();

    activities = []; // rebuild

    // Draw rings (back to front so labels go on top)
    for (let i = ringRadii.length - 1; i >= 0; i--) {
        noFill();
        stroke(203, 213, 225); strokeWeight(1);
        circle(cx, cy, ringRadii[i] * 2);
    }
    // Ring labels
    noStroke();
    fill(71, 85, 105);
    textSize(11); textStyle(BOLD); textAlign(LEFT, CENTER);
    for (let i = 0; i < RINGS.length; i++) {
        text(RINGS[i].name, cx + ringRadii[i] - 5, cy);
    }
    textStyle(NORMAL);

    // Place activity dots evenly around each ring
    for (let r = 0; r < RINGS.length; r++) {
        const ring = RINGS[r];
        const radius = ringRadii[r];
        for (let a = 0; a < ring.activities.length; a++) {
            const ang = -PI / 2 + (a / ring.activities.length) * TWO_PI;
            const x = cx + cos(ang) * radius;
            const y = cy + sin(ang) * radius;
            activities.push({ x, y, ring: r, idx: a, ...ring.activities[a] });
        }
    }

    // Draw activity dots
    activities.forEach(a => {
        const c = showOwners ? (ROLE_COLORS[a.role] || [100,116,139]) : [55,71,79];
        fill(c[0], c[1], c[2]);
        noStroke();
        circle(a.x, a.y, 14);
        // Label
        fill(31, 41, 55);
        textSize(10); textAlign(CENTER, TOP);
        const labelLines = a.label.split(' ');
        const halfWidth = 60;
        textAlign(CENTER, CENTER);
        // Smart label position outside the dot
        const dx = a.x - cx, dy = a.y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const lx = a.x + (dx / len) * 18;
        const ly = a.y + (dy / len) * 18;
        textAlign(dx > 0 ? LEFT : (dx < -0.1 ? RIGHT : CENTER), CENTER);
        text(a.label, lx, ly);
    });

    // Hover detail
    const hovered = activityAt(mouseX, mouseY);
    if (hovered >= 0) {
        const a = activities[hovered];
        // Tooltip card
        const tw = 280, th = 70, tx = constrain(a.x + 18, 10, containerW - tw - 10), ty = constrain(a.y + 18, 10, ch - th - 10);
        fill(255); stroke(203, 213, 225); strokeWeight(1);
        rect(tx, ty, tw, th, 6);
        noStroke();
        fill(193, 68, 14); textSize(12); textStyle(BOLD); textAlign(LEFT, TOP);
        text(a.label, tx + 8, ty + 8);
        textStyle(NORMAL); textSize(10); fill(100, 116, 139);
        text('Role: ' + a.role, tx + 8, ty + 26);
        textSize(10); fill(31, 41, 55);
        text('Produces: ' + a.artifact, tx + 8, ty + 42, tw - 16);
    }

    // Legend
    if (showOwners) {
        fill(31, 41, 55); textAlign(LEFT, TOP); textSize(10);
        const ly = ch - 80;
        const labels = [['Engineer', 'engineer'], ['EM', 'em'], ['Finance', 'finance'], ['Compliance', 'compliance']];
        labels.forEach(([lab, role], i) => {
            const c = ROLE_COLORS[role];
            fill(c[0], c[1], c[2]); circle(20 + i * 100, ly + 6, 10);
            fill(55, 71, 79); text(lab, 30 + i * 100, ly + 2);
        });
    }
}
