/**
 * Netflix Cadmium Playercore - Module 28855
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Lbb, pEa, r_b
 * Purpose: Logging, Configuration, Enum definitions
 */

// Webpack module 28855
// Parameters: t (module), b (exports), a (require)

var d, p;
export const pEa = d = a(22970).__importDefault(a(17267));
t = (function() {
    class c {
    constructor(g, f) {
        undefined === f && (f = 0);
        this.initial = f;
        this.reset();
        this.NXc(g);
    }
    NXc(g) {
        this.alpha = Math.pow(.5, 1 / g);
        this.fB = g;
    }
    reset(g) {
        g && undefined !== g.Fa && d.default.wc(g.Fa) ? (this.count = this.initial,
        this.Fa = g.Fa,
        g.xg && d.default.wc(g.xg) ? this.mL = g.xg + g.Fa * g.Fa : this.mL = g.Fa * g.Fa) : this.mL = this.Fa = this.count = 0;
    }
    add(g) {
        var f;
        if (d.default.wc(g)) {
            this.count++;
            f = this.alpha;
            this.Fa = f * this.Fa + (1 - f) * g;
            this.mL = f * this.mL + (1 - f) * g * g;
        }
    }
    tWa() {
        var g, f;
        if (0 === this.count)
            return {
                Fa: 0,
                xg: 0
            };
        g = 1 - Math.pow(this.alpha, this.count);
        f = this.Fa / g;
        return {
            Fa: f,
            xg: Math.max(this.mL / g - f * f, 0)
        };
    }
    get() {
        var g;
        g = this.tWa();
        return {
            Fa: Math.floor(g.Fa),
            xg: Math.floor(g.xg)
        };
    }
    getState() {
        return 0 === this.count ? null : {
            a: Number(this.Fa.toPrecision(6)),
            s: Number(this.mL.toPrecision(6)),
            n: this.count
        };
    }
    Jg(g) {
        if (d.default.Ad(g) || !d.default.has(g, "a") || !d.default.has(g, "s") || !d.default.isFinite(g.a) || !d.default.isFinite(g.s))
            return (this.mL = this.Fa = this.count = 0,
            false);
        this.Fa = g.a;
        this.mL = g.s;
        d.default.has(g, "n") && d.default.wc(g.n) ? this.count = g.n : this.count = 16 * this.fB;
        return true;
    }
    setInterval(g) {
        this.fB = g;
        this.alpha = -Math.log(.5) / g;
    }
    reset(g) {
        this.HE = this.startTime = null;
        this.Fa = g && d.default.isFinite(g.Fa) ? g.Fa : 0;
    }
    start(g) {
        d.default.Ad(this.startTime) && (this.startTime = g);
        d.default.Ad(this.HE) && (this.HE = g);
    }
    add(g, f, e) {
        var h, k, l;
        d.default.Ad(this.startTime) && (this.startTime = f);
        d.default.Ad(this.HE) && (this.HE = f);
        this.startTime = Math.min(this.startTime, f);
        f = Math.max(e - f, 1);
        h = this.alpha;
        k = Math.max(e, this.HE);
        l = k - this.HE;
        e = k - e;
        this.Fa = this.Fa * (0 < l ? Math.exp(-h * l) : 1) + 8 * g / f * (1 - Math.exp(-h * f)) * (0 < e ? Math.exp(-h * e) : 1);
        this.HE = k;
    }
    get(g) {
        var f, e;
        f = d.default.Ad(this.HE) ? 0 : this.HE;
        e = d.default.Ad(this.startTime) ? 0 : this.startTime;
        g = Math.max(g, f);
        f = this.Fa * Math.exp(-this.alpha * (g - f));
        g = 1 - Math.exp(-this.alpha * (g - e));
        0 < g && (f /= g);
        return {
            Fa: Math.floor(f),
            xg: 0
        };
    }
    toString() {
        return "ewma(" + this.fB + ")";
    }
    setInterval(g) {
        this.fS.setInterval(g);
    }
    reset(g) {
        this.fS.reset(g);
        this.offset = 0;
        this.Gt = null;
    }
    start(g) {
        !d.default.Ad(this.Gt) && g > this.Gt && (this.offset += g - this.Gt,
        this.Gt = null);
        this.fS.start(g - this.offset);
    }
    add(g, f, e) {
        !d.default.Ad(this.Gt) && e > this.Gt && (this.offset += f > this.Gt ? f - this.Gt : 0,
        this.Gt = null);
        this.fS.add(g, f - this.offset, e - this.offset);
    }
    stop(g) {
        var f;
        f = this.fS.time;
        this.Gt = Math.max(d.default.Ad(f) ? 0 : f + this.offset, d.default.Ad(this.Gt) ? g : Math.min(this.Gt, g));
    }
    get(g) {
        return this.fS.get((this.Gt ? this.Gt : g) - this.offset);
    }
    toString() {
        return this.fS.toString();
    }
}
return c;
}
)();
export const Lbb = t;
p = (function() {
    function c(g) {
        this.setInterval(g);
        this.reset();
    }
    Object.defineProperties(c.prototype, {
        time: {
            get: function() {
                return this.HE;
            },
            enumerable: false,
            configurable: true
        }
    });
    return c;
}
)();
export const r_b = p;
t = (function() {
    function c(g) {
        this.fS = new p(g);
        this.offset = 0;
        this.Gt = null;
    }
    return c;
}
)();
export const pEa = t;

// Detected exports: Lbb, pEa, r_b
