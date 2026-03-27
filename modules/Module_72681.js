/**
 * Netflix Cadmium Playercore - Module 72681
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 72681
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
t = a(66164);
p = a(90745);
c = t.platform.Pm;
a = (function(g) {
    function f(e) {
        var h;
        h = g.call(this) || this;
        h.MN = e;
        h.Yma = e.groupId;
        h.ek = new p.sf();
        h.ek.on(h, c.Mm.O7, h.ZE);
        h.ek.on(h, c.Mm.oK, h.bfa);
        return h;
    }
    d.__extends(f, g);
    f.prototype.tNc = function(e, h, k) {
        c.prototype.open.call(this, e, h, k);
    }
    ;
    f.prototype.vXc = function(e) {
        this.Yma = e;
    }
    ;
    Object.defineProperties(f.prototype, {
        groupId: {
            get: function() {
                return this.Yma;
            },
            enumerable: false,
            configurable: true
        }
    });
    f.prototype.Ue = function() {
        this.ek && this.ek.clear();
        c.prototype.Ue.call(this);
    }
    ;
    f.prototype.ZE = function(e) {
        this.MN.nRc(e.probed, e.affected);
        this.Ue();
    }
    ;
    f.prototype.bfa = function(e) {
        this.MN.kRc(e.probed, e.affected);
        this.Ue();
    }
    ;
    return f;
}
)(c);
export const r$a = a;
