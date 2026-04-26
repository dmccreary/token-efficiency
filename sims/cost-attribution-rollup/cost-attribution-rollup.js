// Cost Attribution Rollup - p5.js with tabs
// CANVAS_HEIGHT: 600
// Bloom Level: Analyze (L4) - differentiate
// LO: Differentiate cost-per-request, cost-per-feature, cost-per-user, and cost-per-outcome from the same data.

let canvas;
const cw = 800, ch = 600;
let containerW;
let tabBtns = [];
let sortSelect;
let activeTab = 1; // 0=Request 1=Feature 2=User 3=Outcome

// Pre-baked dataset of 30 requests
const FEATURES = ['summarize', 'chat', 'classify'];
const USERS = ['u1', 'u2', 'u3', 'u4', 'u5'];
const MODELS = ['haiku', 'sonnet'];
const REQUESTS = [];
(function gen() {
    let seed = 42;
    function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (let i = 1; i <= 30; i++) {
        const feature = FEATURES[Math.floor(rand() * 3)];
        const user = USERS[Math.floor(rand() * 5)];
        const model = rand() < 0.7 ? 'haiku' : 'sonnet';
        const inputT = Math.round(500 + rand() * 5000);
        const outputT = Math.round(100 + rand() * 1000);
        const success = rand() < 0.85;
        // Cost: rough $/MTok
        const inP = model === 'haiku' ? 1.0 : 3.0;
        const outP = model === 'haiku' ? 5.0 : 15.0;
        const cost = (inputT * inP + outputT * outP) / 1e6;
        REQUESTS.push({ id: i, feature, user, model, inputT, outputT, success, cost });
    }
    // Inject one outlier
    REQUESTS[5].inputT = 22000; REQUESTS[5].outputT = 4500;
    REQUESTS[5].cost = (22000 * 3 + 4500 * 15) / 1e6;
    REQUESTS[5].model = 'sonnet';
})();

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    containerW = Math.max(360, Math.min(el.clientWidth, cw));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerW, ch);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');
    ['By Request', 'By Feature', 'By User', 'By Outcome'].forEach((label, i) => {
        const b = createButton(label);
        b.parent(document.querySelector('main'));
        b.mousePressed(() => { activeTab = i; });
        tabBtns.push(b);
    });
    sortSelect = createSelect();
    sortSelect.parent(document.querySelector('main'));
    sortSelect.option('Sort: total cost desc');
    sortSelect.option('Sort: total cost asc');
    sortSelect.option('Sort: count desc');
    positionControls();
}
function windowResized() { updateCanvasSize(); resizeCanvas(containerW, ch); positionControls(); }
function positionControls() {
    tabBtns.forEach((b, i) => b.position(20 + i * 100, ch - 90));
    sortSelect.position(440, ch - 88);
}

function aggBy(keyFn) {
    const map = {};
    REQUESTS.forEach(r => {
        const k = keyFn(r);
        if (!map[k]) map[k] = { key: k, total: 0, count: 0, success: 0 };
        map[k].total += r.cost; map[k].count++; if (r.success) map[k].success++;
    });
    return Object.values(map);
}

function getSortedRollup() {
    let data;
    if (activeTab === 1) data = aggBy(r => r.feature);
    else if (activeTab === 2) data = aggBy(r => r.user);
    else if (activeTab === 3) {
        // Cost per successful outcome by feature
        data = aggBy(r => r.feature).map(d => ({ ...d, costPerSuccess: d.success > 0 ? d.total / d.success : Infinity, successRate: d.success / d.count }));
    }
    if (!data) return null;
    const sortKey = sortSelect.value();
    if (sortKey && sortKey.includes('count')) data.sort((a,b) => b.count - a.count);
    else if (sortKey && sortKey.includes('asc')) data.sort((a,b) => a.total - b.total);
    else data.sort((a,b) => b.total - a.total);
    return data;
}

function draw() {
    background(248, 250, 252);
    noStroke();
    fill(31, 41, 55); textSize(17); textStyle(BOLD); textAlign(LEFT, TOP);
    text('Cost Attribution — same data, four lenses', 20, 16);
    textStyle(NORMAL); textSize(11); fill(100, 116, 139);
    text('30-request sample. Click a tab to switch the rollup dimension.', 20, 38);

    // Highlight active tab
    tabBtns.forEach((b, i) => b.style('background-color', i === activeTab ? '#c1440e' : '#fff'));
    tabBtns.forEach((b, i) => b.style('color', i === activeTab ? '#fff' : '#1f2937'));

    // Render content
    const px = 20, py = 70, pw = containerW - 40, phMax = ch - 180;
    fill(255); stroke(226, 232, 240);
    rect(px, py, pw, phMax, 6);
    noStroke();

    if (activeTab === 0) {
        // By request: top-10 sorted bar
        const sorted = [...REQUESTS].sort((a,b) => b.cost - a.cost).slice(0, 10);
        const maxCost = sorted[0].cost;
        sorted.forEach((r, i) => {
            const y = py + 14 + i * 28;
            const barW = (r.cost / maxCost) * (pw - 250);
            fill(2, 119, 189); rect(px + 240, y, barW, 18, 3);
            fill(31, 41, 55); textAlign(LEFT, CENTER); textSize(11);
            text(`R${r.id}  ${r.feature.padEnd(11)} ${r.user} ${r.model}`, px + 12, y + 9);
            textAlign(RIGHT, CENTER);
            text('$' + r.cost.toFixed(4), px + 230, y + 9);
        });
        fill(100, 116, 139); textSize(11); textAlign(LEFT, BOTTOM);
        text('Top 10 of 30 requests sorted by cost — note the outlier dominating', px + 12, py + phMax - 8);
    } else {
        const data = getSortedRollup();
        const maxTotal = Math.max(...data.map(d => d.total));
        data.forEach((d, i) => {
            const y = py + 14 + i * 38;
            const barW = (d.total / maxTotal) * (pw - 320);
            fill(46, 125, 50); rect(px + 240, y, barW, 14, 3);
            fill(31, 41, 55); textAlign(LEFT, CENTER); textSize(13); textStyle(BOLD);
            text(d.key, px + 12, y + 8);
            textStyle(NORMAL); textSize(11); fill(55, 71, 79);
            text(`${d.count} reqs · avg $${(d.total/d.count).toFixed(4)}`, px + 12, y + 22);
            textAlign(RIGHT, CENTER); textSize(11); fill(31, 41, 55);
            text('$' + d.total.toFixed(4), px + 230, y + 14);
            if (activeTab === 3) {
                fill(100, 116, 139); textAlign(LEFT, CENTER); textSize(10);
                text(`success ${(d.successRate * 100).toFixed(0)}% · cost/success $${d.costPerSuccess.toFixed(4)}`, px + 240 + barW + 8, y + 14);
            }
        });
    }
}
