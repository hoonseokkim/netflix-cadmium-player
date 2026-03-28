/**
 * Netflix Cadmium Playercore - Module 77593
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Qeb
 * Dependencies: 1454, 22970, 69193, 72536, 98263
 * Purpose: MSL protocol, Timing/Scheduling, Parsing/Serialization, Error handling
 */

// import dep_1454 from './Module_1454.js';
// import dep_22970 from './Module_22970.js';
// import dep_69193 from './Module_69193.js';
// import dep_72536 from './Module_72536.js';
// import dep_98263 from './Module_98263.js';

// Webpack module 77593
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;

d = a(22970);
t = a(1454);
p = d.__importDefault(a(42979));
c = d.__importDefault(a(79804));
g = d.__importDefault(a(6838));
f = a(98263);
e = a(72536);
h = a(69193);
a = (function(k) {
    class l extends k {
    constructor(m, n) {
        var q;
        q = k.call(this) || this;
        q.Og = m;
        q.au = n;
        q.gob = h.TC.yG;
        q.L8 = "";
        q.Qe = new f.Nab();
        return q;
    }
    close(m, n) {
        var q;
        q = this;
        c.default(n, function() {
            var r;
            if (0 == q.Qe.Qe.pending.length)
                return true;
            r = h.eD.Ed(q.L8.substring(0, q.L8.length - q.Qe.Qe.pending.length), q.gob);
            q.au.reset();
            q.au.skip(r.length, m, {
                result: function(u) {
                    p.default(n, function() {
                        if (u != r.length)
                            throw new g.default("Only skipped " + u + " of " + r.length + " bytes. Source input stream may not be reusable for additional MSL messages.");
                        return true;
                    });
                },
                timeout: function(u) {
                    p.default(n, function() {
                        if (u != r.length)
                            throw new g.default("Only skipped " + u + " of " + r.length + " bytes. Source input stream may not be reusable for additional MSL messages.");
                        return true;
                    });
                },
                error: n.error
            });
        });
    }
    abort() {
        k.prototype.abort.call(this);
        this.au.abort();
    }
    QMb(m, n) {
        var q;
        q = this;
        c.default(n, function() {
            q.au.mark(65536);
            q.au.read(65536, m, {
                result: function(r) {
                    c.default(n, function() {
                        var u;
                        if (!r || !r.length)
                            return null;
                        q.L8 = h.eD.Be(r, q.gob);
                        u = q.Qe.Qe.pending.length + q.L8.length;
                        if (10485760 < u)
                            throw new g.default("JSON parsing stopped after reaching " + u + " unparsed characters.");
                        q.Qe.write(q.L8);
                        u = q.Qe.YKb();
                        if (undefined !== u)
                            return u;
                        setTimeout(function() {
                            q.QMb(m, n);
                        }, 0);
                    });
                },
                timeout: n.timeout,
                error: function(r) {
                    p.default(n, function() {
                        throw new g.default("Error reading from the source input stream.",r);
                    });
                }
            });
        });
    }
    next(m, n) {
        var r;
        function q(u) {
            c.default(n, function() {
                if ("object" !== typeof u)
                    throw new g.default("Malformed MSL message. Parsed " + typeof u + " instead of object.");
                return new e.DP(r.Og,u);
            });
        }
        r = this;
        c.default(n, function() {
            var u;
            u = r.Qe.YKb();
            undefined !== u ? q(u) : r.QMb(r.am, {
                result: function(v) {
                    c.default(n, function() {
                        if (r.Mg || !v)
                            return null;
                        q(v);
                    });
                },
                timeout: n.timeout,
                error: n.error
            });
        });
    }
}
d.return l;
}
)(t.nhb);
export const Qeb = a;

// Detected exports: Qeb
