/**
 * Netflix Cadmium Playercore - Module 42050
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: V9a
 */

// Webpack module 42050
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const V9a = undefined;
d = a(22970);  // import from Module_22970
p = a(91072);  // import from Module_91072
c = a(28951);  // import from Module_28951
g = a(62411);  // import from Module_62411
b.V9a = (function() {
    function f() {}
    f.open = function(e) {
        return d.__awaiter(this, undefined, undefined, function() {
            var h, k, l, m, n, q, r, u, v, w, x, y, A;
            return d.__generator(this, function(z) {
                switch (z.label) {
                case 0:
                    return (h = e.timing || new p.hLa(),
                    [4, e.Au(h)]);
                case 1:
                    (k = z.T(),
                    l = e.trace.extend("ale-auth"),
                    m = e.tE,
                    z.label = 2);
                case 2:
                    return (z.ac.push([2, 7, , 8]),
                    n = new c.BHa(k),
                    l("Waiting for nonce and ALE session"),
                    q = null !== (A = e.timeout) && undefined !== A ? A : this.timeout,
                    [4, Promise.all([h.noa(["network", "nonce"]  /* config: network = "nonce" */, function() {
                        return n.T8a(q, m.nonce.bind(m));
                    }), h.noa(["session", "ale"]  /* config: session = "ale" */, function() {
                        return e.RY.Irc();
                    })])]);
                case 3:
                    return (r = z.T()[0],
                    l("Got ALE session, nonce is", r),
                    [4, h.noa(["encrypt", "ale"]  /* config: encrypt = "ale" */, function() {
                        return e.RY.encrypt(r);
                    })]);
                case 4:
                    u = z.T();
                    v = u.token;
                    w = u.rH;
                    k.send(m.response(v, w));
                    if (!m.validate)
                        return [3, 6];
                    x = m.validate.bind(m);
                    return [4, h.noa(["network", "response"]  /* config: network = "response" */, function() {
                        return n.T8a(q, x);
                    })];
                case 5:
                    (z.T(),
                    z.label = 6);
                case 6:
                    return [2, k];
                case 7:
                    throw (y = z.T(),
                    l("ALE authentication failed with", y),
                    k.close(),
                    (0,
                    g.dZb)("ale-encrypted-nonce", y));
                case 8:
                    return [2];
                }
            });
        });
    }
    ;
    f.timeout = 8E3;
    return f;
}
)

// Detected exports: V9a
