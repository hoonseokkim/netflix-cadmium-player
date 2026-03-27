/**
 * Netflix Cadmium Playercore - Module 74015
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 74015
// Parameters: t (module), b (exports), a (require)


var g, f, e;
function d(h) {
    return h == g.default.kf ? 1 : h + 1;
}
function p(h) {
    if (0 === Object.keys(h.Yx).length)
        return 0;
    for (var k = d(h.qA); !h.Yx[k]; )
        k = d(k);
    return k;
}
function c(h) {
    if (0 === Object.keys(h.vD).length)
        return 0;
    for (var k = d(h.Pv); !h.vD[k]; )
        k = d(k);
    return k;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.ZJa = void 0;
t = a(22970);
g = t.__importDefault(a(51411));
f = t.__importDefault(a(79804));
e = t.__importDefault(a(10690));
a = (function() {
    function h() {
        this.tY = {};
        this.Yx = {};
        this.AY = null;
        this.vD = {};
        this.hna = this.Pv = this.qA = 0;
    }
    h.prototype.cancel = function(k) {
        var l;
        if (this.Yx[k]) {
            l = this.Yx[k];
            delete this.Yx[k];
            k == this.qA && (this.qA = p(this));
            l.call(this, !0);
        }
        this.vD[k] && (l = this.vD[k],
        delete this.vD[k],
        k == this.Pv && (this.Pv = c(this)),
        l.call(this, !0));
    }
    ;
    h.prototype.gpa = function() {
        for (; 0 !== this.Pv; )
            this.cancel(this.Pv);
        for (; 0 !== this.qA; )
            this.cancel(this.qA);
    }
    ;
    h.prototype.ySc = function(k, l) {
        var m, n;
        m = this;
        n = d(this.hna);
        this.hna = n;
        f.default(l, function() {
            var q;
            if (!m.AY && 0 === Object.keys(m.vD).length)
                return (m.tY[n] = !0,
                n);
            -1 != k && (q = setTimeout(function() {
                delete m.Yx[n];
                n == m.qA && (m.qA = p(m));
                l.timeout();
            }, k));
            m.Yx[n] = function(r) {
                clearTimeout(q);
                r ? setTimeout(function() {
                    l.result(void 0);
                }, 0) : (m.tY[n] = !0,
                setTimeout(function() {
                    l.result(n);
                }, 0));
            }
            ;
            m.qA || (m.qA = n);
        });
        return n;
    }
    ;
    h.prototype.lYb = function(k, l) {
        var m, n;
        m = this;
        n = d(this.hna);
        this.hna = n;
        f.default(l, function() {
            var q;
            if (0 === Object.keys(m.tY).length && 0 === Object.keys(m.Yx).length && !m.AY)
                return m.AY = n;
            -1 != k && (q = setTimeout(function() {
                delete m.vD[n];
                n == m.Pv && (m.Pv = c(m));
                l.timeout();
            }, k));
            m.vD[n] = function(r) {
                clearTimeout(q);
                r ? setTimeout(function() {
                    l.result(void 0);
                }, 0) : (m.AY = n,
                setTimeout(function() {
                    l.result(n);
                }, 0));
            }
            ;
            m.Pv || (m.Pv = n);
        });
    }
    ;
    h.prototype.unlock = function(k) {
        var l;
        if (k == this.AY)
            this.AY = null;
        else {
            if (!this.tY[k])
                throw new e.default("There is no reader or writer with ticket number " + k + ".");
            delete this.tY[k];
        }
        if (this.Pv)
            0 < Object.keys(this.tY).length || (k = this.vD[this.Pv],
            delete this.vD[this.Pv],
            this.Pv = c(this),
            k.call(this, !1));
        else {
            for (k = this.qA; 0 < Object.keys(this.Yx).length; k = d(k))
                if (this.Yx[k]) {
                    l = this.Yx[k];
                    delete this.Yx[k];
                    l.call(this, !1);
                }
            this.qA = 0;
        }
    }
    ;
    return h;
}
)();
b.ZJa = a;


// Detected exports: ZJa