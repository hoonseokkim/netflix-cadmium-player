/**
 * Netflix Cadmium Playercore - Module 31085
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 */

// Webpack module 31085
// Parameters: t, b

function a(d) {
    this.j = d;
}
b.W$a = undefined;
a.prototype.LWb = function() {
    var d;
    d = this.j.fb;
    if (null !== d && undefined !== d && d.yK) {
        d = d.$c.get();
        if (null === d || undefined === d ? 0 : d.Wh)
            this.j.Wh = d.Wh.Fa;
        if (null === d || undefined === d ? 0 : d.sb)
            this.j.sb = d.sb.Fa;
    }
}
;
a.prototype.Bl = function() {
    -1 === this.j.sb && this.LWb();
    return this.j.sb;
}
;
a.prototype.rfc = function(d) {
    -1 !== this.j.Wh && -1 !== this.j.sb || this.LWb();
    return -1 === this.j.Wh || -1 === this.j.sb ? Number.MAX_VALUE : this.j.Wh + 8 * d / this.j.sb;
}
;
b.W$a = a;

