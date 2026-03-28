/**
 * Netflix Cadmium Playercore - Module 42304
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: DGa
 */

// Webpack module 42304
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.CN = f;
}
export const DGa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(36129);  // import from Module_36129
a = a(48159);  // import from Module_48159
d.prototype.load = function(f) {
    var e;
    e = this;
    return new Promise(function(h, k) {
        var l, m;
        try {
            l = e.CN.getItem(f);
            if (l) {
                m = l;
                if ("{" === l[0])
                    try {
                        m = JSON.parse(l) || l;
                    } catch (n) {}
                h({
                    key: f,
                    value: m
                });
            } else
                k({
                    Ya: c.Y.tG
                });
        } catch (n) {
            k({
                Ya: c.Y.flb,
                Jc: n
            });
        }
    }
    );
}
;
d.prototype.save = function(f, e, h) {
    var k;
    k = this;
    return new Promise(function(l, m) {
        if (h && k.CN.getItem(f))
            l(false);
        else
            try {
                "string" === typeof e ? k.CN.setItem(f, e) : k.CN.setItem(f, JSON.stringify(e));
                l(true);
            } catch (n) {
                m({
                    Ya: c.Y.glb,
                    Jc: n
                });
            }
    }
    );
}
;
d.prototype.remove = function(f) {
    var e;
    e = this;
    return new Promise(function(h, k) {
        try {
            e.CN.removeItem(f);
            h();
        } catch (l) {
            k({
                Ya: c.Y.rKa,
                Jc: l
            });
        }
    }
    );
}
;
d.prototype.loadAll = function() {
    return Promise.reject("Not supported");
}
;
d.prototype.removeAll = function() {
    return Promise.reject("Not supported");
}
;
g = d;
export const DGa = g;
b.DGa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.C3b))],

// Detected exports: DGa
