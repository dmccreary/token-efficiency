// Sample Size Calculator for LLM A/B Tests
// CANVAS_HEIGHT: 700
// Bloom Level: Apply (L3) - calculate
// Learning objective: Calculate the sample size needed to detect a target
// effect at a chosen power and significance level for an LLM A/B test.

// ---- Layout ----
let canvas;
let canvasWidth = 800;
let drawHeight = 410;
let controlHeight = 290;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;
let margin = 16;

// ---- Controls ----
let effectSlider, cvSlider, powerSlider, alphaSlider;
let cupedCheckbox, resetButton;

// ---- Defaults ----
const D_EFFECT = 0.10;   // 10% relative MDE
const D_CV     = 0.50;   // 50% coefficient of variation
const D_POWER  = 0.80;   // 80% power
const D_ALPHA  = 0.05;   // 5% significance
const D_CUPED  = false;  // CUPED off
const CUPED_REDUCTION = 0.50; // 50% variance reduction

function updateCanvasSize() {
    const el = document.querySelector('main').parentElement;
    const w = el.clientWidth;
    containerWidth = Math.max(360, Math.min(w, canvasWidth));
}

function setup() {
    updateCanvasSize();
    canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Arial');

    // Sliders
    effectSlider = createSlider(0.01, 0.50, D_EFFECT, 0.01);
    cvSlider     = createSlider(0.10, 2.00, D_CV,     0.05);
    powerSlider  = createSlider(0.50, 0.99, D_POWER,  0.01);
    alphaSlider  = createSlider(0.01, 0.20, D_ALPHA,  0.01);

    [effectSlider, cvSlider, powerSlider, alphaSlider].forEach(s => {
        s.parent(document.querySelector('main'));
        s.style('width', '300px');
    });

    cupedCheckbox = createCheckbox('Apply CUPED 50% variance reduction', D_CUPED);
    cupedCheckbox.parent(document.querySelector('main'));

    resetButton = createButton('Reset to defaults');
    resetButton.parent(document.querySelector('main'));
    resetButton.mousePressed(() => {
        effectSlider.value(D_EFFECT);
        cvSlider.value(D_CV);
        powerSlider.value(D_POWER);
        alphaSlider.value(D_ALPHA);
        cupedCheckbox.checked(D_CUPED);
    });

    positionControls();
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    positionControls();
}

function positionControls() {
    // Two-column layout for sliders
    const col1X = margin;
    const col2X = containerWidth / 2 + margin / 2;
    const sliderWidth = (containerWidth - 3 * margin) / 2;

    [effectSlider, cvSlider, powerSlider, alphaSlider].forEach(s =>
        s.style('width', sliderWidth + 'px')
    );

    // Row 1
    effectSlider.position(col1X, drawHeight + 50);
    cvSlider.position(col2X, drawHeight + 50);
    // Row 2
    powerSlider.position(col1X, drawHeight + 110);
    alphaSlider.position(col2X, drawHeight + 110);

    cupedCheckbox.position(col1X, drawHeight + 175);
    resetButton.position(col1X, drawHeight + 220);
}

function draw() {
    background(248, 250, 252);

    // Read inputs
    const effect = effectSlider.value();
    const cv     = cvSlider.value();
    const power  = powerSlider.value();
    const alpha  = alphaSlider.value();
    const cuped  = cupedCheckbox.checked();

    // Compute sample size
    const cvEff = cuped ? cv * Math.sqrt(1 - CUPED_REDUCTION) : cv;
    const n = sampleSizePerGroup(effect, cvEff, power, alpha);
    const nNoCuped = sampleSizePerGroup(effect, cv, power, alpha);

    // ----- Draw display area -----
    drawHeader();
    drawResult(n, nNoCuped, cuped);
    drawTradeoffChart(effect, cv, power, alpha, cuped);
    drawControlLabels(effect, cv, power, alpha);

    // Divider
    stroke(203, 213, 225);
    line(0, drawHeight, containerWidth, drawHeight);
    noStroke();
}

function drawHeader() {
    fill(31, 41, 55);
    noStroke();
    textSize(18);
    textAlign(LEFT, TOP);
    text('Sample Size Calculator for LLM A/B Tests', margin, 16);

    textSize(12);
    fill(100, 116, 139);
    text('Adjust the four inputs to see the required samples per group update live.',
         margin, 38);
}

function drawResult(n, nNoCuped, cuped) {
    // Big number readout
    const cx = containerWidth / 2;
    fill(55, 71, 79);
    textAlign(CENTER, TOP);
    textSize(13);
    text('Required samples per group', cx, 70);

    // Big N
    fill(193, 68, 14); // Pemba russet
    textSize(56);
    textStyle(BOLD);
    const nDisplay = formatNumber(n);
    text(nDisplay, cx, 90);
    textStyle(NORMAL);

    // Total samples
    textSize(12);
    fill(100, 116, 139);
    text('Total: ' + formatNumber(n * 2) + ' samples (both groups)', cx, 165);

    // CUPED comparison (if on)
    if (cuped) {
        fill(46, 125, 50);
        textSize(12);
        const reduction = Math.round((1 - n / nNoCuped) * 100);
        text('CUPED reduces N from ' + formatNumber(nNoCuped) +
             ' (' + reduction + '% smaller)', cx, 185);
    }
}

function drawTradeoffChart(effect, cv, power, alpha, cuped) {
    // Small chart: how N changes as effect size varies, with current point marked
    const chartX = margin + 4;
    const chartY = 215;
    const chartW = containerWidth - 2 * (margin + 4);
    const chartH = 175;

    // Frame
    stroke(203, 213, 225);
    fill(255);
    rect(chartX, chartY, chartW, chartH, 4);
    noStroke();

    // Title
    fill(55, 71, 79);
    textAlign(LEFT, TOP);
    textSize(12);
    text('Sample size vs. effect size  (other inputs held at current values)',
         chartX + 8, chartY + 6);

    // Compute curve
    const minE = 0.01, maxE = 0.50;
    const cvEff = cuped ? cv * Math.sqrt(1 - CUPED_REDUCTION) : cv;
    const points = [];
    for (let i = 0; i <= 60; i++) {
        const e = minE + (maxE - minE) * (i / 60);
        const n = sampleSizePerGroup(e, cvEff, power, alpha);
        points.push({ e: e, n: n });
    }
    // Log-scale Y so the curve is readable
    const minLogN = Math.log10(Math.max(10, Math.min(...points.map(p => p.n))));
    const maxLogN = Math.log10(Math.max(...points.map(p => p.n)));
    const padTop = 30, padBot = 22, padL = 50, padR = 14;
    const plotL = chartX + padL, plotR = chartX + chartW - padR;
    const plotT = chartY + padTop, plotB = chartY + chartH - padBot;

    // Y gridlines (log scale, powers of 10)
    stroke(241, 245, 249);
    fill(148, 163, 184);
    textSize(10);
    textAlign(RIGHT, CENTER);
    for (let p = Math.ceil(minLogN); p <= Math.floor(maxLogN); p++) {
        const y = map(p, minLogN, maxLogN, plotB, plotT);
        line(plotL, y, plotR, y);
        noStroke();
        text(formatNumber(Math.pow(10, p)), plotL - 6, y);
        stroke(241, 245, 249);
    }
    noStroke();

    // X axis labels
    fill(148, 163, 184);
    textSize(10);
    textAlign(CENTER, TOP);
    [0.01, 0.10, 0.20, 0.30, 0.40, 0.50].forEach(e => {
        const x = map(e, minE, maxE, plotL, plotR);
        stroke(226, 232, 240);
        line(x, plotT, x, plotB);
        noStroke();
        text(Math.round(e * 100) + '%', x, plotB + 4);
    });

    // Curve
    stroke(55, 71, 79);
    strokeWeight(1.6);
    noFill();
    beginShape();
    for (const pt of points) {
        const x = map(pt.e, minE, maxE, plotL, plotR);
        const y = map(Math.log10(pt.n), minLogN, maxLogN, plotB, plotT);
        vertex(x, y);
    }
    endShape();
    strokeWeight(1);

    // Current point
    const curN = sampleSizePerGroup(effect, cvEff, power, alpha);
    const curX = map(effect, minE, maxE, plotL, plotR);
    const curY = map(Math.log10(curN), minLogN, maxLogN, plotB, plotT);
    fill(193, 68, 14);
    noStroke();
    circle(curX, curY, 9);

    // Axis labels
    fill(100, 116, 139);
    textSize(10);
    textAlign(CENTER, TOP);
    text('Minimum detectable effect (relative)', chartX + chartW / 2, chartY + chartH - 10);
    push();
    translate(chartX + 14, chartY + chartH / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    text('N per group (log)', 0, 0);
    pop();
}

function drawControlLabels(effect, cv, power, alpha) {
    const col1X = margin;
    const col2X = containerWidth / 2 + margin / 2;

    fill(31, 41, 55);
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    text('Inputs', col1X, drawHeight + 14);
    textStyle(NORMAL);

    textSize(12);
    fill(55, 71, 79);
    // Row 1
    text('Minimum detectable effect: ' + Math.round(effect * 100) + '%', col1X, drawHeight + 32);
    text('Baseline coefficient of variation: ' + Math.round(cv * 100) + '%', col2X, drawHeight + 32);
    // Row 2
    text('Statistical power: ' + power.toFixed(2),       col1X, drawHeight + 92);
    text('Significance level (alpha): ' + alpha.toFixed(2), col2X, drawHeight + 92);
}

// ---- Statistics ----
function sampleSizePerGroup(effect, cv, power, alpha) {
    if (effect <= 0) return Infinity;
    const zAlpha = normalInverse(1 - alpha / 2);
    const zBeta  = normalInverse(power);
    const n = 2 * Math.pow(zAlpha + zBeta, 2) * Math.pow(cv, 2) / Math.pow(effect, 2);
    return Math.ceil(n);
}

// Beasley-Springer-Moro approximation of the standard normal inverse CDF
function normalInverse(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
               1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
               6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
               -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
               3.754408661907416e+00];
    const pLow = 0.02425, pHigh = 1 - pLow;
    let q, r;
    if (p < pLow) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
               ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    } else if (p <= pHigh) {
        q = p - 0.5;
        r = q * q;
        return (((((a[0]*r + a[1])*r + a[2])*r + a[3])*r + a[4])*r + a[5]) * q /
               (((((b[0]*r + b[1])*r + b[2])*r + b[3])*r + b[4])*r + 1);
    } else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[0]*q + c[1])*q + c[2])*q + c[3])*q + c[4])*q + c[5]) /
                ((((d[0]*q + d[1])*q + d[2])*q + d[3])*q + 1);
    }
}

// Pretty-print a sample-size number (e.g. 1234 -> "1,234")
function formatNumber(n) {
    if (!isFinite(n)) return '∞';
    if (n >= 1e7) return (n / 1e6).toFixed(1) + 'M';
    return Math.round(n).toLocaleString('en-US');
}
