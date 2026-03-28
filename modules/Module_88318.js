/**
 * Netflix Cadmium Playercore - Module 88318
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 */

// Webpack module 88318
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    this.Eb = {
        lea: g.maxc || 25,
        WQa: g.c || .5,
        QSc: g.rc || "none",
        fB: g.hl || 7200
    };
    this.h9();
    this.c$b = this.Eb.QSc;
    this.B8b = this.Eb.fB;
    this.YLa = Math.exp(Math.log(2) / this.B8b);
    this.YLa = Math.max(this.YLa, 1);
    this.Kma = 1;
}
p = a(17267);  // import from Module_17267
c = a(15913).TDigest;
new (a(66164).platform.Console)("ASEJS_NETWORK_HISTORY","media|asejs");
d.prototype.getState = function() {
    var g;
    if (0 === this.Rg.size())
        return null;
    g = this.Rg.kk([.25, .75]);
    if (g[0] === g[1])
        return null;
    this.Rg.size() > this.Eb.lea && this.Rg.op();
    g = this.Rg.Ij(false).reduce((function(f, e) {
        p.wc(e.Gf) && p.wc(e.n) && f.push({
            mean: e.Gf,
            n: e.n / this.Kma
        });
        return f;
    }
    ).bind(this), []);
    return {
        tdigest: JSON.stringify(g)
    };
}
;
d.prototype.Jg = function(g) {
    var f;
    if (p.Ad(g) || !p.has(g, "tdigest") || !p.Ri(g.tdigest))
        return false;
    try {
        f = JSON.parse(g.tdigest);
    } catch (e) {
        return false;
    }
    f.forEach(function(e) {
        p.isFinite(e.n) || (e.n = 1);
    });
    g = f.map(function(e) {
        return {
            Gf: e.mean,
            n: e.n
        };
    });
    this.Kma = 1;
    this.Rg.x3a(g);
    undefined === this.Rg.kk(0) && this.h9();
}
;
d.prototype.get = function() {
    var g, f;
    g = this.Rg;
    f = g.kk([0, .1, .25, .5, .75, .9, 1]);
    return {
        min: f[0],
        Q1a: f[1],
        Xw: f[2],
        ft: f[3],
        Yw: f[4],
        R1a: f[5],
        max: f[6],
        nn: g.Ij(false)
    };
}
;
d.syc = function(g) {
    var f;
    f = new d({});
    p.Ad(g) || p.Ny(g) || !p.isArray(g.nn) || (f.Rg.x3a(g.nn),
    undefined === f.Rg.kk(0) && f.h9());
    g = f.Rg.kk([.25, .75]);
    return g[0] === g[1] ? null : function(e) {
        return f.Rg.kk(e);
    }
    ;
}
;
d.prototype.add = function(g) {
    var f;
    f = 1;
    "ewma" === this.c$b && (this.Kma = f = this.Kma * this.YLa);
    this.Rg.push(g, f);
}
;
d.prototype.toString = function() {
    return "TDigestHist(" + this.Rg.summary() + ")";
}
;
d.prototype.h9 = function() {
    this.Rg = new c(this.Eb.WQa,this.Eb.lea);
}
;
t.exports = {
    rmb: d

