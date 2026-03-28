/**
 * Netflix Cadmium Playercore - Module 6675
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Encryption / cryptography
 * Exports: uGa
 */

// Webpack module 6675
// Parameters: t, b

function a(d, p) {
    this.bH = d;
    this.hg = p;
}
export const uGa = undefined;
a.prototype.load = function(d, p) {
    var c;
    c = this;
    this.bH.load(d).then(function(g) {
        p && p(a.xUb(g));
    }).catch(function(g) {
        p && p(c.KH(d, g));
    });
}
;
a.prototype.save = function(d, p, c, g) {
    var f;
    f = this;
    this.bH.save(d, p, c).then(function() {
        g && g(a.xUb({
            key: d,
            value: p
        }));
    }).catch(function(e) {
        g && g(f.KH(d, e));
    });
}
;
a.prototype.remove = function(d, p) {
    var c;
    c = this;
    this.bH.remove(d).then(function() {
        p && p({
            success: true,
            BAa: d
        });
    }).catch(function(g) {
        p && p(c.KH(d, g));
    });
}
;
a.xUb = function(d) {
    return {
        success: true,
        data: d.value,
        BAa: d.key
    };
}
;
a.prototype.KH = function(d, p) {
    return {
        success: false,
        BAa: d,
        Ya: p.Ya,
        Cf: p.Jc ? this.hg.Yj(p.Jc) : undefined
    };
}
;
export const uGa = a;

// Detected exports: uGa
