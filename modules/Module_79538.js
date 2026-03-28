/**
 * Netflix Cadmium Playercore - Module 79538
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: wla
 */

// Webpack module 79538
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e, h, k, l, m, n) {
    this.type = g;
    this.pn = f;
    this.ZOc = undefined === e ? false : e;
    this.pxb = h;
    this.notify = k;
    this.Ssc = l;
    this.k3 = m;
    this.yg = n;
    this.id = ++c;
    this.status = p.Yr.pn;
}
export const wla = undefined;
p = a(32573);  // import from Module_32573
c = 0;
d.prototype.Fu = function() {
    var g;
    g = {
        id: this.id,
        type: this.type,
        created: this.pn,
        status: this.status,
        movieId: this.R
    };
    this.startTime && (g.startTime = this.startTime);
    this.endTime && this.startTime && (g.duration = this.endTime - this.startTime,
    g.endTime = this.endTime);
    return g;
}
;
d.prototype.w2 = function(g) {
    this.notify && this.notify(g);
}
;
d.prototype.DVc = function() {
    return this.Ssc.fetch(this.k3, this.yg);
}
;
Ha.Object.defineProperties(d.prototype, {
    R: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.k3.R;
        }
    },
    priority: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.k3.priority;
        }
    }
});
b.wla =

// Detected exports: wla
