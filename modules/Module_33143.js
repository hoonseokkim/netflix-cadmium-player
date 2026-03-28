/**
 * Netflix Cadmium Playercore - Module 33143
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Manifest parsing / streaming protocol
 * Exports: Kkb
 */

// Webpack module 33143
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Kkb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(91176);  // import from Module_91176
t = (function() {
    function g(f, e, h) {
        this.He = e;
        this.F8b = h;
        this.sga = [];
        this.sga.push(f);
    }
    g.prototype.kta = function(f) {
        return this.F8b({
            J: f,
            Bm: undefined
        }, this.He);
    }
    ;
    g.prototype.Yp = function(f, e) {
        return c.$F.vM({
            J: f,
            Bm: e
        }, this.sga);
    }
    ;
    g.prototype.UU = function(f) {
        return d.__awaiter(this, undefined, undefined, function() {
            var e, h, k, l, m, n, q, r;
            return d.__generator(this, function(u) {
                switch (u.label) {
                case 0:
                    (e = f.Pj,
                    h = f.hb,
                    k = f.J,
                    l = this.Yp(f.J),
                    u.label = 1);
                case 1:
                    return (u.ac.push([1, , 4, 5]),
                    [4, l.mq]);
                case 2:
                    return (m = u.T(),
                    n = m.S.Kb,
                    (0,
                    p.assert)(n, "Manifest must have aux manifest token to request ad break hydration"),
                    q = {
                        Pj: e,
                        hb: h,
                        Mf: {
                            Kb: n,
                            jd: k
                        }
                    },
                    [4, this.He.UU(e || "", q)]);
                case 3:
                    return (r = u.T(),
                    [2, {
                        B9: r,
                        jn: m
                    }]);
                case 4:
                    return (l.Qk.release(),
                    [7]);
                case 5:
                    return [2];
                }
            });
        });
    }
    ;
    g.prototype.VU = function(f, e) {
        return d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function() {
                return [2, this.He.VU(f, e)];
            });
        });
    }
    ;
    g.prototype.ZTc = function(f) {
        var e;
        e = this.sga.pop();
        this.sga.push(f);
        return e;
    }
    ;
    g.prototype.Qna = function(f) {
        this.sga.unshift(f);
    }
    ;
    return g;
}
)();
b.Kkb =

// Detected exports: Kkb
