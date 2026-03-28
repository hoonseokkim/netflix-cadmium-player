/**
 * Netflix Cadmium Playercore - Module 3359
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Evb
 */

// Webpack module 3359
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Evb(n, q, r) {
    var u, v, w, x, y, A, z, B, C, D, E;
    u = n.context;
    v = n.console;
    w = n.data;
    x = n.id;
    n = n.pp;
    undefined === r && (r = c.RDa);
    y = u !== g.W7;
    A = y ? u.Uw : v;
    z = y ? u.parent : undefined;
    v = y && u.id || "";
    B = (0,
    f.tRa)(q.name);
    x = x || (0,
    k.MUa)(B);
    r = y ? u.i3 : r;
    C = n || new p.ODa((0,
    h.Mub)([q]),r);
    C.aga(x, undefined, y ? u.id : undefined, [q.name]);
    D = new m.Leb({
        fVa: function(G) {
            return y ? u.Bn(G) : undefined;
        },
        gOc: z,
        Uw: A,
        data: w,
        pp: C,
        random: B
    });
    w = new l.lEa({
        Vg: [q],
        Bn: D.Bn.bind(D),
        FBb: function(G) {
            return y ? u.uS(G) : undefined;
        }
    });
    r = {
        ky: function(G) {
            return C.ky(G, x);
        },
        JA: function(G, F) {
            return C.JA(G, F, x);
        },
        v0: w.v0.bind(w),
        Bn: D.Bn.bind(D),
        tS: function(G) {
            return C.tS(G, x);
        },
        u0: function(G) {
            return C.u0(x, G);
        },
        uS: w.uS.bind(w),
        id: x,
        Uw: A,
        parent: z,
        i3: r,
        NU: D.NU.bind(D),
        c5: D.c5.bind(D)
    };
    w = D.Qta(q, r);
    n = (0,
    e.Dq)(w);
    E = "function" === typeof n.Hh ? n.Hh.bind(w) : undefined;
    q = (0,
    d.NI)(w, {
        id: x,
        fU: v,
        name: q.name,
        JA: r.JA,
        ky: r.ky,
        Hh: function() {
            y && u.c5(x);
            D.Hh(E);
            C.iWb(x);
        }
    });
    return (0,
    e.Dq)(q);
}
;
d = a(91176);  // import from Module_91176
p = a(71897);  // import from Module_71897
c = a(61234);  // import from Module_61234
g = a(39090);  // import from Module_39090
f = a(71773);  // import from Module_71773
e = a(27851);  // import from Module_27851
h = a(26653);  // import from Module_26653
k = a(32559);  // import from Module_32559
l = a(48406);  // import from Module_48406
m = a(2710

// Detected exports: Evb
