/**
 * Netflix Cadmium Playercore - Module 23927
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 */

// Webpack module 23927
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
d = a(37425);  // import from Module_37425
p = a(72632);  // import from Module_72632
c = a(67258);  // import from Module_67258
g = a(11625);  // import from Module_11625
t = (function() {
    function f(e, h, k, l) {
        this.id = p.id();
        this.type = e;
        this.ti = k;
        this.name = new g.A5b(h || "");
        this.xa = [];
        e = null;
        "string" === typeof l ? e = new c.Metadata(d.hK,l) : l instanceof c.Metadata && (e = l);
        null !== e && this.xa.push(e);
    }
    f.prototype.wEb = function(e) {
        for (var h = 0, k = this.xa; h < k.length; h++)
            if (k[h].key === e)
                return true;
        return false;
    }
    ;
    f.prototype.isArray = function() {
        return this.wEb(d.JP);
    }
    ;
    f.prototype.rIc = function(e) {
        return this.E_a(d.JP)(e);
    }
    ;
    f.prototype.LYa = function() {
        return this.wEb(d.hK);
    }
    ;
    f.prototype.cZa = function() {
        return this.xa.some(function(e) {
            return e.key !== d.j7 && e.key !== d.JP && e.key !== d.Zka && e.key !== d.r8 && e.key !== d.hK;
        });
    }
    ;
    f.prototype.oGb = function() {
        return this.E_a(d.Vhb)(true);
    }
    ;
    f.prototype.Pxc = function() {
        return this.LYa() ? this.xa.filter(function(e) {
            return e.key === d.hK;
        })[0] : null;
    }
    ;
    f.prototype.Zvc = function() {
        return this.cZa() ? this.xa.filter(function(e) {
            return e.key !== d.j7 && e.key !== d.JP && e.key !== d.Zka && e.key !== d.r8 && e.key !== d.hK;
        }) : null;
    }
    ;
    f.prototype.E_a = function(e) {
        var h;
        h = this;
        return function(k) {
            var n;
            for (var l = 0, m = h.xa; l < m.length; l++) {
                n = m[l];
                if (n.key === e && n.value === k)
                    return true;
            }
            return false;
        }
        ;
    }
    ;
    return f;
}
)();
b.kma =

