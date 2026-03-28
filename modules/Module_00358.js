/**
 * Netflix Cadmium Playercore - Module 358
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Yab
 * Dependencies: 7675, 22970, 36948, 64396
 * Purpose: Manifest handling, Encryption/Decryption, Logging, Configuration
 */

// import dep_7675 from './Module_7675.js';
// import dep_22970 from './Module_22970.js';
// import dep_36948 from './Module_36948.js';
// import dep_64396 from './Module_64396.js';

// Webpack module 358
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h;
function d(k, l, m) {
    if ("function" === typeof k.set)
        0 === k.set(l) && m.trace("Invalid keys" + JSON.stringify(Object.keys(l)));
    else
        for (m in (m = undefined,
        l))
            k[m] = l[m];
}
function p(k, l) {
    var m, n, u;
    n = {};
    try {
        for (var q = c.__values(k), r = q.next(); !r.done; r = q.next()) {
            u = r.value;
            undefined !== l[u] && (n[u] = l[u]);
        }
    } catch (w) {
        var v;
        v = {
            error: w
        };
    } finally {
        try {
            r && !r.done && (m = q.return) && m.call(q);
        } finally {
            if (v)
                throw v.error;
        }
    }
    return n;
}

c = a(22970);
g = a(7675);
f = a(36948);
e = a(64396);
t = (function() {
    class k {
    constructor(l, m) {
        this.yPa = l;
        this.console = m;
        this.JBa = new WeakMap();
        this.pva = new WeakMap();
        this.console.trace("Created config manager with base config" + JSON.stringify(l));
    }
    Owc() {
        var l;
        l = (0,
        g.yLc)(this.yPa.tAc);
        if (undefined === l || 0 === Object.keys(l).length)
            return (this.console.warn("ConfigManager: No globalConfigMutationAllowList found in base config,                 no manifest config will override global config."),
            {});
        this.console.trace("ConfigManager global config override allowed properties: " + JSON.stringify(l));
        return l;
    }
    eYc(l, m) {
        this.JBa.has(l) && this.console.trace("Updating existing viewable config for " + l);
        this.JBa.set(l, m);
    }
    QDb(l) {
        if (this.JBa.has(l))
            return this.JBa.get(l);
        this.console.warn("ConfigManager: No viewable config found for " + l.R);
        return this.yPa;
    }
    GXc(l, m, n) {
        var q;
        q = this.QDb(l);
        n = this.u3c(q, n);
        m = this.v3c(q, n, m);
        this.pva.has(l) && this.console.trace("Updating existing manifest config for " + l);
        this.pva.set(l, m);
    }
    QVa(l) {
        if (this.pva.has(l))
            return this.pva.get(l);
        this.console.warn("ConfigManager: No manifest config found for " + l.R);
        return this.QDb(l);
    }
    u3c(l, m) {
        l = Object.create(l);
        l.set ? (l.set({
            tC: m.tC
        }),
        l.set({
            MJ: !!m.ou
        })) : (l.tC = m.tC,
        l.MJ = !!m.ou);
        return l;
    }
    v3c(l, m, n) {
        var q, r, u, v, w, x, y;
        q = this;
        n = n.steeringAdditionalInfo;
        if (!n)
            return m;
        r = n.streamingClientConfig;
        u = this.Owc();
        v = p(h, n);
        if (!r || (0,
        e.zYa)(r) && (0,
        e.zYa)(v))
            return m;
        w = Object.create(m);
        x = Object.keys(f.fRa).reduce(function(A, z) {
            var B;
            B = f.fRa[z][0];
            Array.isArray(B) ? B.forEach(function(C) {
                return A[C] = z;
            }) : (B = Array.isArray(B) ? B[0] : B,
            A[B] = z);
            return A;
        }, {});
        m = Object.keys(c.__assign(c.__assign({}, r), v)).filter(function(A) {
            return undefined !== x[A];
        });
        y = {};
        m.forEach(function(A) {
            var z, B, C;
            B = x[A];
            if (undefined !== w[B]) {
                C = null !== (z = r[A]) && undefined !== z ? z : v[A];
                z = undefined;
                "number" === typeof w[B] ? z = Number(C) : "boolean" === typeof w[B] ? z = "true" === C : "string" === typeof w[B] ? z = C : q.console.trace("Unsupported type for" + A);
                q.console.trace("ConfigManager Updating value for key " + A + " from " + w[B] + " to " + z);
                y[B] = z;
            } else
                q.console.trace("Invalid key" + A);
        });
        0 < Object.keys(y).length && (m = m.filter(function(A) {
            return undefined !== u[A] && undefined !== y[u[A]];
        }).reduce(function(A, z) {
            A[u[z]] = y[u[z]];
            return A;
        }, {}),
        d(w, y, this.console),
        d(l, m, this.console));
        return w;
    }
}
k.prototype.$5a = function(l) {
        var m;
        l = null === (m = l.steeringAdditionalInfo) || undefined === m ? undefined : m.H6a;
        return undefined !== l && 0 < Object.keys(l).length;
    }
    ;
    return k;
}
)();
export const Yab = t;
h = ["liveEdgeCushionWithSpreadMs"];

// Detected exports: Yab
