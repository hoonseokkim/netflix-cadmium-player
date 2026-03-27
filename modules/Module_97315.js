/**
 * Netflix Cadmium Playercore - Module 97315
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 97315
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e, h, k, l, m, n, q, r, u, v, w;
function d(x, y) {
    switch (x.type) {
    case "slidingwindow":
        return new u.QP(y,new h.Kbb(x.mw));
    case "discontiguous-ewma":
        return new u.QP(y,new e.pEa(x.mw));
    case "initial-discontiguous-ewma":
        return new q.Ejb(new e.pEa(x.mw),x.playerStates);
    case "wssl":
        return new h.Qnb(x.mw,x.max_n);
    case "iqr":
        return new l.LZb(x.mx,x.mn,x.bw,x.iv);
    case "tdigest":
        return new m.MZb(x);
    case "ci":
        return new u.QP(y,new r.hja(x,new v.Wab(x)));
    case "discrete-ewma":
        return new e.Lbb(x.hl);
    case "tdigest-history":
        return new c.rmb(x);
    case "iqr-history":
        return new g.default();
    case "avtp":
        return new w.cP();
    case "entropy":
        return new n.Dhb(x);
    case "deliverytime":
        return new u.QP(y,new r.hja(x,new k.Cbb(x)));
    case "deliverytime-ci":
        return new u.QP(y,new r.hja(x,new k.Dbb(x)));
    }
}
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.hFa = void 0;
p = a(22970);
c = a(88318);
g = p.__importDefault(a(21506));
f = a(54520);
e = a(28855);
h = a(34391);
k = a(8239);
l = a(20596);
m = a(78416);
n = a(72869);
q = a(82583);
r = a(47317);
u = a(66917);
v = a(71409);
w = a(43276);
t = (function() {
    function x(y) {
        this.config = y;
        this.a8b = y.rob;
    }
    x.prototype.create = function(y, A) {
        A = A[y];
        A = p.__assign(p.__assign({}, this.a8b[y]), A);
        y = A.type;
        if (!y)
            return {
                type: "none"
            };
        A = d(A, this.config);
        return (0,
        f.NI)(A, {
            type: y
        });
    }
    ;
    return x;
}
)();
b.hFa = t;


// Detected exports: hFa