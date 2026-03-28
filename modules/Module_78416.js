/**
 * Netflix Cadmium Playercore - Module 78416
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Purpose: Class definition
 */

// Webpack module 78416
// Parameters: t (module), b (exports), a (require)

var p, c;
class d {
    constructor(g) {
    this.Eb = {
        lea: g.maxc || 25,
        WQa: g.c || .5,
        MC: g.w || 15E3,
        rj: g.b || 5E3
    };
    p.call(this, this.Eb.MC, this.Eb.rj);
    this.h9();
}
    shift() {
    var g;
    g = this.mr(0);
    p.prototype.shift.call(this);
    null !== g && (this.Rg.push(g, 1),
    this.PK = true);
    return g;
}
    flush() {
    var g;
    g = this.get();
    this.Rg.push(g, 1);
    this.PK = true;
    p.prototype.reset.call(this);
    return g;
}
    get() {
    return this.FDb();
}
    B0() {
    var g;
    g = this.FDb();
    return {
        min: g.min,
        p10: g.Q1a,
        p25: g.Xw,
        p50: g.ft,
        p75: g.Yw,
        p90: g.R1a,
        max: g.max,
        centroidSize: g.ygc,
        sampleSize: g.sampleSize,
        centroids: g.nn
    };
}
    FDb() {
    var g;
    if (0 === this.Rg.size())
        return null;
    g = this.Rg.kk([0, .1, .25, .5, .75, .9, 1]);
    if (g[2] === g[4])
        return null;
    if (this.PK || !this.je)
        (this.PK = false,
        this.je = {
            min: g[0],
            Q1a: g[1],
            Xw: g[2],
            ft: g[3],
            Yw: g[4],
            R1a: g[5],
            max: g[6],
            kk: this.Rg.kk.bind(this.Rg),
            ygc: this.Rg.size(),
            sampleSize: this.Rg.n,
            nn: this.Gvc(),
            B0: this.B0.bind(this)
        });
    return this.je;
}
    Gvc() {
    var g;
    if (0 === this.Rg.size())
        return null;
    if (!this.PK && this.je)
        return this.je.centroids;
    g = this.Rg.kk([.25, .75]);
    if (g[0] === g[1])
        return null;
    this.Rg.size() > this.Eb.lea && this.Rg.op();
    g = this.Rg.Ij(false).map(function(f) {
        return {
            mean: f.Gf,
            n: f.n
        };
    });
    return JSON.stringify(g);
}
    KWa() {
    return this.Rg.summary();
}
    size() {
    return this.Rg.size();
}
    toString() {
    return "btdtput(" + this.M$b + "," + this.C7b + "," + this.L$b + "): " + this.Rg.summary();
}
    h9() {
    this.Rg = new c(this.Eb.WQa,this.Eb.lea);
}
}
p = a(72697).j6;
c = a(15913).TDigest;
d.prototype = Object.create(p.prototype);
t.exports = {
    MZb: d
};

