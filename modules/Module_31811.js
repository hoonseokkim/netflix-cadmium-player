/**
 * Netflix Cadmium Playercore - Module 31811
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: jl
 */

// Webpack module 31811
// Parameters: t (module), b (exports), a (require)

var p, c;
function d() {
    this.zw = {};
    this.id = "$es$" + p.counter++;
}
export const jl = undefined;
t = a(22970);  // import from Module_22970
a = a(22674);  // import from Module_22674
d.prototype.addListener = function(g, f, e) {
    var h, k;
    h = "$netflix$player$order" + this.id + "$" + g;
    if (this.zw) {
        k = this.zw[g] ? this.zw[g].slice() : [];
        e && (f[h] = e);
        0 > k.indexOf(f) && (k.push(f),
        k.sort(function(l, m) {
            return (l[h] || 0) - (m[h] || 0);
        }));
        this.zw[g] = k;
    }
}
;
d.prototype.removeListener = function(g, f) {
    if (this.zw && this.zw[g]) {
        for (var e = this.zw[g].slice(), h; 0 <= (h = e.indexOf(f)); )
            e.splice(h, 1);
        this.zw[g] = e;
    }
}
;
d.prototype.qd = function(g, f, e) {
    var h;
    if (this.zw) {
        h = this.rVa(g);
        for (g = {
            uW: 0
        }; g.uW < h.length; (g = {
            uW: g.uW
        },
        g.uW++))
            e ? (function(k) {
                return function() {
                    var l;
                    l = h[k.uW];
                    setTimeout(function() {
                        l(f);
                    }, 0);
                }
                ;
            }
            )(g)() : h[g.uW].call(this, f);
    }
}
;
d.prototype.rh = function() {
    this.zw = undefined;
}
;
d.prototype.on = function(g, f, e) {
    this.addListener(g, f, e);
}
;
d.prototype.rVa = function(g) {
    var f;
    return null !== (f = this.zw && (this.zw[g] || (this.zw[g] = []))) && undefined !== f ? f : [];
}
;
c = p = d;
export const jl = c;
c.counter = 0;
b.jl = c = p = t.__decorate([(0,
a.aa)()],

// Detected exports: jl
