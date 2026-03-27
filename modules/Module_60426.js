/**
 * Netflix Cadmium Playercore - Module 60426
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 60426
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e, h;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.RXa = b.XZ = b.yKa = void 0;
t = a(22970);
d = t.__importDefault(a(42979));
p = t.__importDefault(a(42458));
c = t.__importDefault(a(36114));
g = a(50441);
f = a(11475);
e = a(44127);
h = (function() {
    function k(l, m, n) {
        var r;
        function q(u) {
            d.default(m, function() {
                var v;
                v = u ? e.Ji(u) : void 0;
                r.algorithm = l.algorithm;
                r.gx = l;
                r.oZa = u;
                r.Ehd = v;
                return r;
            });
        }
        r = this;
        d.default(m, function() {
            if ("object" !== typeof l)
                throw new p.default(c.default.PFa);
            !n && l.extractable ? g.hh.exportKey(f.kl.SJa, l).then(function(u) {
                q(new Uint8Array(u));
            }, function(u) {
                m.error(new p.default(c.default.iGa,f.kl.SJa,u));
            }) : q(n);
        });
    }
    k.prototype.size = function() {
        return this.oZa.length;
    }
    ;
    k.prototype.T4 = function() {
        return this.oZa;
    }
    ;
    k.prototype.mE = function() {
        return this.oZa;
    }
    ;
    return k;
}
)();
b.yKa = h;
b.XZ = function(k, l) {
    new h(k,l);
}
;
b.RXa = function(k, l, m, n) {
    d.default(n, function() {
        try {
            k = "string" === typeof k ? e.Fk(k) : k;
        } catch (q) {
            throw new p.default(c.default.PFa,"keydata " + k,q);
        }
        g.hh.importKey(f.kl.SJa, k, l, !0, m).then(function(q) {
            new h(q,n,k);
        }, function(q) {
            n.error(new p.default(c.default.PFa,null,q));
        });
    });
}
;


// Detected exports: RXa, XZ, yKa