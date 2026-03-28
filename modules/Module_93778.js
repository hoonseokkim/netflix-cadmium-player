/**
 * Netflix Cadmium Playercore - Module 93778
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 */

// Webpack module 93778
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    this.Sg = g.url;
    this.AQ = g.request;
    this.yQ = g.yd || 0;
    this.nQ = g.xE;
    this.ya = g.va;
    this.U8 = {};
}
p = a(62082);  // import from Module_62082
c = a(32699);  // import from Module_32699
d.prototype.Zoc = function(g, f, e, h) {
    this.U8[c.kVa(f, e)] = true;
    g && g.forEach(function(k) {
        k.pga = true;
    });
    this.AQ({
        url: this.Sg,
        offset: f,
        size: e
    }, this.E9b.bind(this, g, f, e, h));
}
;
d.prototype.E9b = function(g, f, e, h, k, l) {
    var m, n, q, r;
    m = this;
    n = c.kVa(f, e);
    setTimeout(function() {
        delete m.U8[n];
    }, 1E3);
    if (k)
        (h && h(k, 0),
        g && g.forEach(function(u) {
            delete u.pga;
        }));
    else {
        q = new p(l);
        r = 0;
        g && g.forEach(function(u) {
            delete u.pga;
            u.entries.forEach(function(v, w) {
                q.position = v.OS - f;
                v = {
                    data: q.Rn(v.MXa)
                };
                u.images[w] = v;
                c.W3c(u.images[w].data, m.nMa.bind(m));
                r += u.images[w].data.length;
            });
        });
        h && h(null, r);
    }
}
;
d.prototype.nMa = function(g) {
    this.nQ && c.assert(g, this.ya);
}
;
t.exports =

