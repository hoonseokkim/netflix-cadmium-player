/**
 * Netflix Cadmium Playercore - Module 72697
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 72697
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.j6 = void 0;
d = a(48170);
p = a(52571);
t = (function() {
    function c(g, f, e) {
        this.MC = g;
        this.rj = f;
        this.fMb = e;
        this.window = Math.floor((g + f - 1) / f);
        this.reset();
    }
    c.prototype.shift = function() {
        this.fMb && this.fMb(this.mr(0));
        this.ph.shift();
        this.times.shift();
    }
    ;
    c.prototype.mr = function(g) {
        return this.otb(this.ph[g], g);
    }
    ;
    c.prototype.update = function(g, f) {
        this.ph[g] = (this.ph[g] || 0) + f;
    }
    ;
    c.prototype.push = function() {
        this.ph.push(0);
        this.times.push(0);
        this.time += this.rj;
    }
    ;
    c.prototype.add = function(g, f, e) {
        var h, k, l;
        if (null === this.time) {
            h = Math.max(Math.floor((e - f + this.rj - 1) / this.rj), 1);
            for (this.time = f; this.ph.length < h; )
                this.push();
        }
        for (; this.time <= e; )
            (this.push(),
            this.ph.length > this.window && this.shift());
        if (null === this.lu || f < this.lu)
            this.lu = f;
        if (f > this.time - this.rj)
            this.update(this.ph.length - 1, g);
        else if (f === e)
            (h = this.ph.length - Math.max(Math.ceil((this.time - e) / this.rj), 1),
            0 <= h && this.update(h, g));
        else
            for (h = 1; h <= this.ph.length; ++h) {
                k = this.time - h * this.rj;
                l = k + this.rj;
                if (!(k > e)) {
                    if (l < f)
                        break;
                    this.update(this.ph.length - h, Math.round(g * (Math.min(l, e) - Math.max(k, f)) / (e - f)));
                }
            }
        for (; this.ph.length > this.window; )
            this.shift();
    }
    ;
    c.prototype.start = function(g) {
        null === this.lu && (this.lu = g);
        null === this.time && (this.time = g);
    }
    ;
    c.prototype.stop = function(g) {
        var f, e;
        if (null !== this.time)
            if (g - this.time > 10 * this.MC)
                this.reset();
            else {
                for (; this.time <= g; )
                    (this.push(),
                    this.ph.length > this.window && this.shift());
                f = this.ph.length - Math.ceil((this.time - g) / this.rj);
                e = this.ph.length - Math.ceil((this.time - this.lu) / this.rj);
                d.u && (0,
                p.assert)(f >= e, "end index must be after start index");
                if (0 <= f)
                    if ((0 > e && (this.lu = this.time - this.rj * this.ph.length,
                    e = 0),
                    e === f))
                        this.times[e] += g - this.lu;
                    else if (f > e)
                        for ((this.times[e] += (this.time - this.lu) % this.rj,
                        this.times[f] += this.rj - (this.time - g) % this.rj,
                        g = e + 1); g < f; ++g)
                            this.times[g] = this.rj;
                this.lu = null;
            }
    }
    ;
    c.prototype.otb = function(g, f) {
        f = this.NUa(f);
        return 0 === f ? null : 8 * g / f;
    }
    ;
    c.prototype.NUa = function(g) {
        var f;
        f = this.times[g];
        null !== this.lu && (g = this.time - (this.ph.length - g - 1) * this.rj,
        g > this.lu && (f = g - this.lu <= this.rj ? f + (g - this.lu) : this.rj));
        return f;
    }
    ;
    c.prototype.get = function(g, f) {
        var e, h;
        e = this.ph.map(this.otb, this);
        if ("last" === g)
            for (g = 0; g < e.length; ++g)
                null === e[g] && (e[g] = 0 < g ? e[g - 1] : 0);
        else if ("average" === g) {
            f = 1 - Math.pow(.5, 1 / ((f || 2E3) / this.rj));
            h = void 0;
            for (g = 0; g < e.length; ++g)
                null === e[g] ? e[g] = Math.floor(h || 0) : h = void 0 !== h ? f * e[g] + (1 - f) * h : e[g];
        }
        return e;
    }
    ;
    c.prototype.reset = function() {
        this.ph = [];
        this.times = [];
        this.lu = this.time = null;
    }
    ;
    c.prototype.setInterval = function(g) {
        this.window = Math.floor((g + this.rj - 1) / this.rj);
    }
    ;
    return c;
}
)();
b.j6 = t;


// Detected exports: j6