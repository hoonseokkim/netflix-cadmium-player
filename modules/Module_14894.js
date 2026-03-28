/**
 * Netflix Cadmium Playercore - Module 14894
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Wdb
 * Dependencies: 22970, 65630, 69193, 99881
 * Purpose: Timing/Scheduling, Error handling, UI components
 */

// import dep_22970 from './Module_22970.js';
// import dep_65630 from './Module_65630.js';
// import dep_69193 from './Module_69193.js';
// import dep_99881 from './Module_99881.js';

// Webpack module 14894
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;

t = a(22970);
d = t.__importDefault(a(51411));
p = t.__importDefault(a(79804));
c = a(69193);
g = a(99881);
f = a(65630);
e = t.__importDefault(a(48795));
a = (function() {
    class h {
    constructor(k) {
        this.kNa = k;
        this.Tb = undefined;
        this.Rv = -1;
        this.jY = undefined;
        this.Mg = this.ws = false;
        this.R8b = undefined;
        this.Mob = [];
    }
    abort() {
        this.kNa.abort();
    }
    close(k, l) {
        var m;
        m = this;
        p.default(l, function() {
            if (m.Tb)
                m.Tb.close(k, l);
            else
                return true;
        });
    }
    mark(k) {
        this.Tb ? this.Tb.mark(k) : this.Rv = k;
    }
    reset() {
        this.Tb && this.Tb.reset();
    }
    Vba() {
        return this.Mob;
    }
    read(k, l, m) {
        var q;
        function n(r) {
            p.default(m, function() {
                if (!r)
                    return new Uint8Array(0);
                q.kNa.nca({
                    result: function(u) {
                        p.default(m, function() {
                            var v;
                            if (u.nua)
                                (q.ws = true,
                                m.timeout());
                            else {
                                if (u.yE)
                                    throw (q.jY = u.error || new e.default("Unknown HTTP exception."),
                                    q.jY);
                                if (!u.response)
                                    throw (q.jY = new e.default("Missing HTTP response."),
                                    q.jY);
                                q.Mob = u.response.headers;
                                if (undefined !== u.response.json) {
                                    q.R8b = u.response.json;
                                    v = new Uint8Array([f.YC.JSON.identifier]);
                                } else if (u.response.content instanceof Uint8Array)
                                    v = u.response.content;
                                else if ("string" === typeof u.response.body)
                                    v = c.eD.Ed(u.response.body, d.default.z_b);
                                else
                                    throw new e.default("Missing HTTP response content.");
                                q.Tb = new g.qab(v);
                                -1 != q.Rv && q.Tb.mark(q.Rv);
                                q.Tb.read(k, l, m);
                            }
                        });
                    },
                    error: m.error
                });
            });
        }
        q = this;
        p.default(m, function() {
            if (q.jY)
                throw q.jY;
            if (q.ws)
                m.timeout();
            else {
                if (q.Mg)
                    return new Uint8Array(0);
                q.Tb ? q.Tb.read(k, l, m) : q.kNa.close(l, {
                    result: function(r) {
                        n(r);
                    },
                    timeout: m.timeout,
                    error: m.error
                });
            }
        });
    }
    skip() {
        throw Error("wat?");
    }
}
return h;
}
)();
export const Wdb = a;

// Detected exports: Wdb
