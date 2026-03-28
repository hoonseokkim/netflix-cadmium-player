/**
 * Netflix Cadmium Playercore - Module 48864
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: PJa
 */

// Webpack module 48864
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e) {
    this.location = e;
    (0,
    c.Rw)(this, "location");
}
export const PJa = undefined;
t = a(22970);  // import from Module_22970
c = a(66523);  // import from Module_66523
g = a(63368);  // import from Module_63368
a = a(22674);  // import from Module_22674
d.Cxa = function(e) {
    var h, l, m;
    h = {};
    if (0 < e.length) {
        e = e.split("&");
        for (var k = 0; k < e.length; k++) {
            l = e[k].trim();
            m = l.indexOf("=");
            0 <= m ? h[decodeURIComponent(l.substr(0, m).replace(p.vib, "%20"))] = decodeURIComponent(l.substr(m + 1).replace(p.vib, "%20")) : h[l.toLowerCase()] = "";
        }
    }
    return h;
}
;
Ha.Object.defineProperties(d.prototype, {
    kSc: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data ? this.data : this.data = p.Cxa(this.XOb);
        }
    },
    XOb: {
        configurable: true,
        enumerable: true,
        get: function() {
            var e;
            if (undefined !== this.Sfa)
                return this.Sfa;
            this.Sfa = this.location.search.substr(1);
            e = this.Sfa.indexOf("#");
            0 <= e && (this.Sfa = this.XOb.substr(0, e));
            return this.Sfa;
        }
    }
});
f = p = d;
export const PJa = f;
f.vib = /[+]/g;
b.PJa = f = p = t.__decorate([(0,
a.aa)(), t.__param(0, (0,
a.v)(g.Ufb))],

// Detected exports: PJa
