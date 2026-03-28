/**
 * Netflix Cadmium Playercore - Module 15031
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: bKa
 */

// Webpack module 15031
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l) {
    this.ki = k;
    this.Rk = l;
}
export const bKa = undefined;
t = a(22970);  // import from Module_22970
c = a(22674);  // import from Module_22674
g = a(72574);  // import from Module_72574
f = a(5021);  // import from Module_05021
e = a(45118);  // import from Module_45118
a = a(31850);  // import from Module_31850
d.prototype.Zya = function(k) {
    var l;
    l = {
        ctx: k.context,
        data: k.data.map(function(m) {
            return {
                name: m.name,
                method: m.method,
                url: m.url,
                data: m.data.map(function(n) {
                    return p.V4c({
                        method: n.method,
                        d: n.Of.duration.na(f.Ba),
                        sc: n.status,
                        sz: n.Of.size.na(g.Rz),
                        via: n.d4c,
                        cip: n.rhc,
                        err: n.Waa,
                        server_recv_ts: n.SWc
                    }, n);
                })
            };
        })
    };
    k = this.Rk.tu(k.l_a, "info", l);
    this.ki.bd(k);
}
;
d.V4c = function(k, l) {
    p.gu(k, "dns", l.Of.Oxb);
    p.gu(k, "tcp", l.Of.e7a);
    p.gu(k, "tls", l.Of.x7a);
    p.gu(k, "ttfb", l.Of.q7a);
    p.Lac(k, l.PFc);
    p.gu(k, "client_send_ts", l.Of.qQb);
    p.gu(k, "client_recv_ts", l.Of.FQb);
    return k;
}
;
d.Lac = function(k, l) {
    l && (k.rtts = l);
}
;
d.gu = function(k, l, m) {
    m && (k[l] = m.na(f.Ba));
}
;
h = p = d;
export const bKa = h;
b.bKa = h = p = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(e.oq)), t.__param(1, (0,
c.v)(a.hG))],

// Detected exports: bKa
