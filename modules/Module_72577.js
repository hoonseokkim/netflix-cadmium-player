/**
 * Netflix Cadmium Playercore - Module 72577
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 */

// Webpack module 72577
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f) {
    this.duration = g;
    this.size = f;
    this.YYc = undefined;
}
p = a(62082);  // import from Module_62082
c = a(32699);  // import from Module_32699
t.exports = function(g) {
    var k;
    g = new p(g);
    this.identifier = g.F3a(4);
    c.assert("midx" === this.identifier);
    this.version = g.hx(4);
    c.assert(0 === this.version);
    this.fYa = g.Rn(36);
    this.creationTime = g.u3();
    this.jt = g.u3();
    this.R = g.u3();
    this.uVc = g.Fj();
    this.vVc = g.Fj();
    this.language = g.Rn(16);
    g.Rn(16);
    this.startOffset = g.u3();
    this.ZR = g.Fj();
    for (var f = [], e = 0, h = 0; h < this.ZR; h++) {
        k = new d(g.hx(4),g.Fj());
        f.push(k);
        e += k.duration;
    }
    this.entries = f;
    this.endTime = e;
}

