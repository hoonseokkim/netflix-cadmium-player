/**
 * Netflix Cadmium Playercore - Module 60028
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 60028
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(90745);
c = a(91967);
(function(f) {
    f[f.gbb = 1] = "Creation";
    f[f.gma = 2] = "StartPlayback";
}
)(g || (g = {}));
t = (function() {
    function f(e, h, k) {
        this.tc = e;
        this.console = h;
        this.events = k;
        this.uF = {};
        this.ek = new p.sf();
    }
    f.prototype.Xc = function(e) {
        var h;
        h = {
            TU: e,
            XPa: undefined
        };
        this.uF[e.FB] = h;
        e.F$ === g.gbb && this.T4a(h);
        this.ek.on(e.events, "collectionRequested", this.hMc.bind(this, h));
        this.events.on("asereportconfigoverrides", this.B2c.bind(this));
    }
    ;
    f.prototype.La = function() {
        this.ek.clear();
    }
    ;
    f.prototype.dGc = function(e) {
        var h, k;
        h = this;
        k = {
            Ui: e
        };
        Object.keys(this.uF).forEach(function(l) {
            l = h.uF[l];
            h.T7a(l.TU, k);
            e === c.Sc.Gm && l.TU.F$ === g.gma && h.T4a(l);
        });
    }
    ;
    f.prototype.hMc = function(e) {
        var h;
        this.T7a(e.TU, {
            kic: true
        });
        null === (h = e.XPa) || undefined === h ? undefined : h.kd();
    }
    ;
    f.prototype.T4a = function(e) {
        var h, k, l, m;
        h = this;
        l = e.TU;
        m = this.tc.Opa(function() {
            h.T7a(l, {
                UFb: true
            });
        }, l.GD, l.FB);
        null === (k = e.XPa) || undefined === k ? undefined : k.La();
        e.XPa = m;
    }
    ;
    f.prototype.T7a = function(e, h) {
        var k;
        try {
            k = e.ef(h);
            k.qO && (e.yw && this.events.emit(e.yw, k.event),
            this.events.emit("logblob", d.__assign({
                FB: e.FB
            }, k.event)));
        } catch (l) {
            this.console.error(("Error generating event for ").concat(e.FB), l);
        }
    }
    ;
    f.prototype.B2c = function(e) {
        var h, k, l;
        h = this.uF.aseReport;
        if (undefined !== h) {
            k = h.TU;
            l = k.GD.G;
            k.QSb(e);
            l !== k.GD.G && this.T4a(h);
        }
    }
    ;
    return f;
}
)();
export const $fb = t;

// Detected exports: Z7