/**
 * Netflix Cadmium Playercore - Module 60204
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: DRM / content protection
 * Exports: OHa
 */

// Webpack module 60204
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l, m) {
    var n;
    n = this;
    this.lN = l;
    this.profile = m;
    this.O7a = "msl";
    this.log = k.zb("MslTransport");
    this.lN().then(function(q) {
        return n.cwa = q;
    });
}
export const OHa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(87386);  // import from Module_87386
g = a(97996);  // import from Module_97996
f = a(5021);  // import from Module_05021
a = a(71501);  // import from Module_71501
e = {
    license: true
};
d.prototype.send = function(k, l) {
    var m, n;
    m = this;
    n = {
        kN: Object.assign({
            Je: k.Je,
            log: k.log,
            profile: this.profile
        }, k.BPa),
        method: k.so,
        url: k.url.href,
        body: JSON.stringify(l),
        timeout: k.timeout.na(f.Ba),
        F8a: this.profile,
        fQb: !e[k.so],
        z0a: !!e[k.so],
        ry: true,
        bV: k.Sn,
        headers: k.headers
    };
    false;
    return this.lN().then(function(q) {
        return q.send(n).catch(function(r) {
            var u;
            if (!r.error)
                throw (r.subCode = r.Ya || r.subCode,
                r);
            u = r.error;
            u.headers = r.headers;
            m.log.error("Error sending MSL request", {
                mslCode: u.JI,
                subCode: u.subCode,
                data: u.data,
                message: u.message
            });
            throw u;
        });
    });
}
;
d.prototype.Gpa = function() {
    var k;
    return {
        userTokens: null === (k = this.cwa) || undefined === k ? undefined : k.KT.WWa()
    };
}
;
h = d;
export const OHa = h;
b.OHa = h = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(g.J7)), t.__param(2, (0,
p.v)(a.SP))],

// Detected exports: OHa
