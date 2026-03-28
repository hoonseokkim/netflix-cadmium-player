/**
 * Netflix Cadmium Playercore - Module 92435
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 */

// Webpack module 92435
// Parameters: t (module), b (exports), a (require)

var c, g;
function d(f, e, h, k, l, m, n, q) {
    this.displayTime = f;
    this.duration = e;
    this.wNc = h;
    this.xNc = k;
    this.eZc = l;
    this.fZc = m;
    this.OS = n;
    this.MXa = q;
}
function p(f, e, h, k, l, m, n) {
    var q;
    f = new c(f);
    q = 0;
    f.position = e;
    this.ya = k;
    this.identifier = f.F3a(4);
    g.assert("sidx" === this.identifier, k);
    this.fYa = f.Rn(36);
    g.qic(this.fYa, h, k);
    this.duration = f.hx(4);
    this.ZR = f.Fj();
    this.oF = l;
    this.fx = m;
    this.index = n || 0;
    this.entries = [];
    this.images = [];
    for (this.FNa = 0; q < this.ZR; )
        (e = new d(f.hx(4),f.hx(4),f.Fj(),f.Fj(),f.Fj(),f.Fj(),f.u3(),f.hx(4)),
        q++,
        this.entries.push(e));
    this.entries.length && (this.startTime = this.entries[0].displayTime,
    this.endTime = this.entries[this.entries.length - 1].displayTime + this.entries[this.entries.length - 1].duration);
}
c = a(62082);  // import from Module_62082
g = a(32699);  // import from Module_32699
p.prototype.xCc = function() {
    this.FNa++;
}
;
p.prototype.vnc = function() {
    var f;
    f = 0;
    this.FNa--;
    1 > this.FNa ? this.images && 0 < this.images.length && (f += g.DWa([this]),
    this.images = []) : this.ya.debug("Not cleaning up shared sidx with range", this.oF, "-", this.fx);
    return f;
}
;
t.exports =

