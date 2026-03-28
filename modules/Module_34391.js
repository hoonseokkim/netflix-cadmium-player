/**
 * Netflix Cadmium Playercore - Module 34391
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 * Exports: Kbb, Qnb, q_b
 * Purpose: Utility module
 */

// Webpack module 34391
// Parameters: t (module), b (exports)

var a;
export const Qnb = a = (function() {
    class d {
    constructor(p) {
        this.MC = p;
        this.reset();
    }
    wpb(p, c) {
        this.Bca() && (this.fq += p,
        this.th += p,
        this.la += c,
        this.rg.push({
            la: c,
            th: p
        }));
    }
    Y8() {
        var p;
        for (; this.th > this.MC; ) {
            p = this.rg.shift();
            this.la -= p.la;
            this.th -= p.th;
        }
    }
    Bca() {
        return !isNaN(this.fq);
    }
    reset() {
        this.rg = [];
        this.fq = NaN;
        this.th = this.la = 0;
    }
    setInterval(p) {
        this.MC = p;
        this.Y8();
    }
    start(p) {
        this.Bca() || (this.fq = p);
    }
    add(p, c, g) {
        this.Bca() || (this.fq = c);
        c > this.fq && this.wpb(c - this.fq, 0);
        this.wpb(g > this.fq ? g - this.fq : 0, p);
        this.Y8();
    }
    get() {
        return {
            Fa: Math.floor(8 * this.la / this.th),
            xg: 0
        };
    }
    reset() {
        this.window.reset();
        this.qN = 0;
        this.vC = NaN;
    }
    add(p, c, g) {
        this.FMa() && g > this.vC && (c > this.vC && (this.qN += c - this.vC),
        this.vC = NaN);
        this.window.add(p, c - this.qN, g - this.qN);
    }
    start(p) {
        this.FMa() && p > this.vC && (this.qN += p - this.vC,
        this.vC = NaN);
        this.window.start(p - this.qN);
    }
    stop(p) {
        this.vC = this.FMa() ? Math.min(p, this.vC) : p;
    }
    get() {
        return this.window.get();
    }
    setInterval(p) {
        this.window.setInterval(p);
    }
    FMa() {
        return !isNaN(this.vC);
    }
    reset() {
        this.rg = [];
        this.la = this.th = 0;
    }
    add(p, c, g, f) {
        f && (c = g - c,
        this.th += c,
        this.la += p,
        this.rg.push({
            th: c,
            la: p
        }),
        this.Y8());
    }
    start() {}
    stop() {}
    get() {
        return {
            Fa: Math.floor(8 * this.la / this.th),
            xg: 0
        };
    }
    setInterval(p, c) {
        this.MC = p;
        this.zJb = c;
        this.Y8();
    }
    Y8() {
        var p;
        for (; this.th > this.MC || this.rg.length > this.zJb; ) {
            p = this.rg.shift();
            this.la -= p.la;
            this.th -= p.th;
        }
    }
}
return d;
}
)();
export const q_b = a;
t = (function() {
    function d(p) {
        this.qN = 0;
        this.vC = NaN;
        this.window = new a(p);
    }
    return d;
}
)();
export const Kbb = t;
t = (function() {
    function d(p, c) {
        this.MC = p;
        this.zJb = c;
        this.reset();
    }
    return d;
}
)();
export const Qnb = t;

// Detected exports: Kbb, Qnb, q_b
