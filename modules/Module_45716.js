/**
 * Netflix Cadmium Playercore - Module 45716
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: zJa
 */

// Webpack module 45716
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d() {}
export const zJa = undefined;
t = a(22970);  // import from Module_22970
p = a(75864);  // import from Module_75864
c = a(22674);  // import from Module_22674
g = a(79048);  // import from Module_79048
d.prototype.dmc = function(f) {
    var k, l, m;
    for (var e = [], h = 0; h < arguments.length; ++h)
        e[h - 0] = arguments[h];
    k = this;
    if (0 === e.length)
        throw Error("Empty playgraph");
    l = new g.Cv().BF(this.xy(e[0]));
    e.reverse().forEach(function(n) {
        var q;
        q = k.xy(n);
        l.cf(q, Object.assign({
            J: n,
            Va: 0,
            eb: Infinity
        }, m ? {
            Oc: m
        } : {}));
        m = q;
    });
    return l.build();
}
;
d.prototype.xy = function(f, e) {
    e = undefined === e ? p.V7.ZGa : e;
    return f + ":" + e;
}
;
d.prototype.ccc = function(f, e) {
    var h, k, l, m;
    if (undefined === l)
        l = null !== (h = e.id) && undefined !== h ? h : this.xy(e.R);
    h = this.lCb(f);
    m = new g.Cv(f);
    m.cf(l, {
        J: e.R,
        Va: null !== (k = e.Nb) && undefined !== k ? k : 0,
        eb: Infinity
    });
    f = f.ba[h];
    e = {};
    m.cf(h, Object.assign({}, f, {
        Oc: l,
        next: Object.assign({}, f.next || ({}), (e[l] = {},
        e))
    }));
    return m.build();
}
;
d.prototype.lCb = function(f) {
    for (var e = f.Ef, h = e; h = f.ba[h].Oc; )
        e = h;
    return e;
}
;
a = d;
export const zJa = a;
b.zJa = a = t.__decorate([(0,
c.aa)()],

// Detected exports: zJa
