/**
 * Netflix Cadmium Playercore - Module 1639
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: mma
 */

// Webpack module 1639
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e, h) {
    this.$a = e;
    this.entries = new Set();
    this.va = h.zb("TimingApi");
}
export const mma = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(81918);  // import from Module_81918
g = a(5021);  // import from Module_05021
a = a(87386);  // import from Module_87386
d.prototype.mark = function(e, h, k) {
    e = {
        name: e,
        $n: this.$a.Fc()
    };
    h && (e.Ia = h);
    k && (e.correlationId = k);
    this.entries.add(e);
    return e;
}
;
d.prototype.dJb = function(e, h, k) {
    e = {
        name: e,
        $n: this.$a.Fc(),
        PQa: h
    };
    k && (e.correlationId = k);
    this.entries.add(e);
}
;
d.prototype.$ba = function() {
    var e;
    e = [];
    this.entries.forEach(function(h) {
        return e.push(h);
    });
    return e;
}
;
d.prototype.Dxc = function(e) {
    return this.$ba().filter(function(h) {
        return h.Ia === e;
    });
}
;
d.prototype.Cxc = function(e) {
    return this.$ba().filter(function(h) {
        return h.PQa === e;
    });
}
;
d.prototype.Bxc = function() {
    var e;
    e = {};
    try {
        e = this.$ba().filter(function(h) {
            return !h.Ia;
        }).reduce(function(h, k) {
            h[k.name] = k.$n.na(g.Ba);
            return h;
        }, {});
    } catch (h) {
        this.va.error(" getMapOfCommonMarks exception", h);
    }
    return e;
}
;
d.prototype.PTc = function(e) {
    var h;
    h = this;
    this.$ba().forEach(function(k) {
        k.Ia === e && h.entries.delete(k);
    });
}
;
d.prototype.OTc = function(e) {
    var h;
    h = this;
    this.$ba().forEach(function(k) {
        k.PQa === e && h.entries.delete(k);
    });
}
;
f = d;
export const mma = f;
b.mma = f = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.re)), t.__param(1, (0,
p.v)(a.Bb))], f

// Detected exports: mma
