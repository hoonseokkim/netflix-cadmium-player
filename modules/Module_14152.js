/**
 * Netflix Cadmium Playercore - Module 14152
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: a8
 * Dependencies: 22970, 62411, 70402
 * Purpose: Event handling, Timing/Scheduling, Error handling, Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_62411 from './Module_62411.js';
// import dep_70402 from './Module_70402.js';

// Webpack module 14152
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
t = a(70402);
p = a(62411);
a = (function(c) {
    class g extends c {
    constructor(f) {
        var e;
        e = c.call(this) || this;
        e.map = {};
        e.options = d.__assign({}, f);
        return e;
    }
    cVc(f) {
        var e;
        e = this;
        return function(h) {
            var k;
            k = e.options.Rk.rpa(h).id;
            if (k === f.id)
                try {
                    return e.options.Rk.validate(h);
                } catch (l) {
                    throw (0,
                    p.Pla)(f.type, k, "error-response", l);
                }
        }
        ;
    }
    send(f) {
        return d.__awaiter(this, undefined, undefined, function() {
            var e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C;
            return d.__generator(this, function(D) {
                switch (D.label) {
                case 0:
                    (e = f.type,
                    h = f.options,
                    k = this.options.Rk.request(f, 1),
                    l = this.options.Rk.rpa(k).id,
                    m = this.options.trace.extend(e, l),
                    m("Preparing"),
                    n = d.__assign(d.__assign({}, f), {
                        id: l,
                        attempt: 1
                    }),
                    D.label = 1);
                case 1:
                    D.ac.push([1, 6, , 7]);
                    if (q = null === h || undefined === h ? undefined : h.maxInQueue)
                        if ((r = this.uvb(e),
                        r >= q))
                            throw (0,
                            p.Pla)(e, l, "queue-full", (0,
                            p.Ija)(("Queue has ").concat(r)));
                    u = JSON.stringify(k);
                    if (v = null === h || undefined === h ? undefined : h.maxLengthBytes)
                        if ((w = u.length,
                        w > v))
                            throw (0,
                            p.Pla)(e, l, "too-large", (0,
                            p.Ija)(("Body is ").concat(u.length, " bytes")));
                    this.map[l] = n;
                    D.label = 2;
                case 2:
                    return (D.ac.push([2, , 4, 5]),
                    m("Sending..."),
                    this.emit("sending", {
                        request: n,
                        size: u.length
                    }),
                    x = this.options,
                    y = x.client,
                    A = x.timeout,
                    [4, y.request({
                        body: u,
                        timeout: A,
                        filter: this.cVc(n)
                    })]);
                case 3:
                    return (z = D.T(),
                    m("Succeeded"),
                    this.emit("succeeded", {
                        request: n
                    }),
                    [2, z]);
                case 4:
                    return (delete this.map[l],
                    [7]);
                case 5:
                    return [3, 7];
                case 6:
                    throw (B = D.T(),
                    C = (0,
                    p.PDc)(B, "request-failed") || (0,
                    p.Pla)(n.type, l, "cause", B),
                    m("Failed with", C),
                    this.emit("failed", {
                        request: n,
                        error: C
                    }),
                    C);
                case 7:
                    return [2];
                }
            });
        });
    }
    uvb(f) {
        var e, h;
        e = 0;
        for (h in this.map)
            this.map[h].type === f && e++;
        return e;
    }
}
d.return g;
}
)(t.EventEmitter);
export const a8 = a;

// Detected exports: a8
