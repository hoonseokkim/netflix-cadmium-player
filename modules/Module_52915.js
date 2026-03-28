/**
 * Netflix Cadmium Playercore - Module 52915
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 52915
// Parameters: t (module), b (exports), a (require)

function d(c) {
    this.data = c;
    this.right = this.left = null;
}
function p(c) {
    this.Qg = null;
    this.hA = c;
    this.size = 0;
}
b = a(61161);  // import from Module_61161
d.prototype.xj = function(c) {
    return c ? this.right : this.left;
}
;
d.prototype.px = function(c, g) {
    c ? this.right = g : this.left = g;
}
;
p.prototype = new b();
p.prototype.Qu = function(c) {
    if (null === this.Qg)
        (this.Qg = new d(c),
        this.size++);
    else
        for (var g = 0, f = null, e = this.Qg; ; ) {
            if (null === e) {
                e = new d(c);
                f.px(g, e);
                ret = true;
                this.size++;
                break;
            }
            if (0 === this.hA(e.data, c))
                break;
            g = 0 > this.hA(e.data, c);
            f = e;
            e = e.xj(g);
        }
}
;
p.prototype.remove = function(c) {
    var g, f, l;
    if (null === this.Qg)
        return false;
    g = new d(undefined);
    f = g;
    f.right = this.Qg;
    for (var e = null, h = null, k = 1; null !== f.xj(k); ) {
        e = f;
        f = f.xj(k);
        l = this.hA(c, f.data);
        k = 0 < l;
        0 === l && (h = f);
    }
    return null !== h ? (h.data = f.data,
    e.px(e.right === f, f.xj(null === f.left)),
    this.Qg = g.right,
    this.size--,
    true) : false;
}
;
t.exports =

