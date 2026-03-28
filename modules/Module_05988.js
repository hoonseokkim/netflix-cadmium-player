/**
 * Netflix Cadmium Playercore - Module 5988
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 14348, 23710, 42979, 48795, 49123, 61693
 * Purpose: MSL protocol, Encryption/Decryption, Timing/Scheduling, Error handling
 */

// import dep_14348 from './Module_14348.js';
// import dep_23710 from './Module_23710.js';
// import dep_42979 from './Module_42979.js';
// import dep_48795 from './Module_48795.js';
// import dep_49123 from './Module_49123.js';
// import dep_61693 from './Module_61693.js';

// Webpack module 5988
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h, k;
class d {
    constructor(l, m) {
    this.Cg = l;
    this.ls = m;
}
    OWc(l) {
    this.Cg.trace("Sent MSL header", this.Fu(this.ls, l), ("serviceTokens"in l) && l.lO.map(this.hIc).join("\n"));
}
    NSc(l) {
    var m, n;
    m = this.Fu(this.ls, l);
    n = l.errorCode;
    n ? this.Cg.warn("Received MSL error header", m, {
        errorCode: n,
        errorMessage: null === l || undefined === l ? undefined : l.errorMessage,
        internalCode: null === l || undefined === l ? undefined : l.$ca
    }) : this.Cg.trace("Received MSL header", m);
}
    Fu(l, m) {
    var n, q;
    n = null === m || undefined === m ? undefined : m.mc;
    q = null === m || undefined === m ? undefined : m.vg;
    m = null === m || undefined === m ? undefined : m.lO;
    return {
        NccpMethod: l.method,
        UserId: l.userId,
        UT: q && q.Vf,
        MT: n && n.Vf + ":" + n.pk,
        STCount: m && m.length
    };
}
    hIc(l) {
    return l.wi();
}
}
class p {
    constructor(l, m, n, q) {
    this.Cg = l;
    this.r9b = m;
    this.ls = n;
    this.AK = q;
}
    vWa() {
    return null;
}
    gua() {
    return false;
}
    gsa() {
    return {};
}
    hda() {
    return !!this.ls.encrypted;
}
    Su() {
    return !!this.ls.nonReplayable;
}
    uda() {
    return true;
}
    bB() {
    return this.ls.profileGuid || this.ls.userId || null;
}
    Vsa(l, m, n, q) {
    var r;
    r = this.ls;
    (0,
    h.default)(q, function() {
        return l || !r.shouldSendUserAuthData ? null : r.email ? new c.LEa(r.email,r.password) : r.useNetflixUserAuthData || n && r.sendUserAuthIfRequired ? new f.THa() : null;
    }, null);
}
    yS(l) {
    l.result(this.ls.allowTokenRefresh ? [this.AK] : []);
}
    m8a(l, m, n) {
    var q, r, u, v, w;
    q = this.Cg;
    r = (this.ls.serviceTokens || []).slice();
    u = this.r9b;
    m = u.Zm;
    v = l.lb.oE();
    w = m.yy(this.bB());
    (function y() {
        var A;
        A = r.shift();
        if (A)
            try {
                A instanceof k.zlb ? (l.Xqb(A),
                y()) : (0,
                k.Exa)(u, A, v, w, null, {
                    result: function(z) {
                        try {
                            l.Xqb(z);
                        } catch (B) {
                            q.warn("Exception adding service token", "" + B);
                        }
                        y();
                    },
                    error: function(z) {
                        q.warn("Error parsing service token", "" + z);
                        y();
                    }
                });
            } catch (z) {
                q.warn("Exception processing service token", "" + z);
                y();
            }
        else
            n.result(true);
    }
    )();
}
    write(l, m, n) {
    var q;
    q = new e.lma().Ed(this.ls.body);
    l.write(q, 0, q.length, m, {
        result: function(r) {
            r != q.length ? n.error(new g.default("Not all data was written to output.")) : l.flush(m, {
                result: function() {
                    n.result(true);
                },
                timeout: function() {
                    n.timeout();
                },
                error: function(u) {
                    n.error(u);
                }
            });
        },
        timeout: function() {
            n.timeout();
        },
        error: function(r) {
            n.error(r);
        }
    });
}
    jsa() {
    this.pob || (this.pob = new d(this.Cg,this.ls));
    return this.pob;
}
}
c = a(23710);
g = a(48795);
f = a(49123);
e = a(14348);
h = a(42979);
k = a(61693);
b["default"] = {
    D3b: p,
    Y9c: d
};

