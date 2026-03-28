/**
 * Netflix Cadmium Playercore - Module 97757
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: o0, Y0b
 */

// Webpack module 97757
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l) {
    return k - l;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Y0b = undefined;
export function o0(k, l) {
    var m;
    if (!f)
        return k;
    m = new h(k.name,l);
    return (function(n) {
        function q() {
            for (var r = [], u = 0; u < arguments.length; u++)
                r[u] = arguments[u];
            r = n.apply(this, p.__spreadArray([], p.__read(r), false)) || this;
            r.dBb = m.rlc(r);
            return r;
        }
        p.__extends(q, n);
        return q;
    }
    )(k);
}
;
p = a(22970);  // import from Module_22970
c = a(66164);  // import from Module_66164
g = a(48170);  // import from Module_48170
f = "gctag" === ({
    NODE_ENV: "production",
    PLATFORM: "cadmium",
    ASEBUILD: "release",
    OBFUSCATE: "obfuscate",
    BUILD_VERSION: "6.0055.939.911"
}).U0b;
h = (function() {
    function k(l, m) {
        this.name = l;
        this.YQa = m;
        this.Ru = [];
        this.ZCc = 0;
    }
    Object.defineProperties(k, {
        console: {
            get: function() {
                e || (e = new c.platform.Console("GCTAGGER"));
                return e;
            },
            enumerable: false,
            configurable: true
        }
    });
    k.prototype.rlc = function(l) {
        var m, n;
        if (f) {
            m = this.YQa;
            m || (m = k.console);
            if (!l.dBb && "undefined" !== typeof nrdp) {
                l = {
                    type: this.name,
                    id: this.ZCc++
                };
                this.Ru.push(l.id);
                n = JSON.stringify(l);
                n = nrdp.dBb(n, (function(q, r, u, v) {
                    q.Ru.splice(q.Ru.indexOf(r), 1);
                    q.Ru = q.Ru.sort(d);
                    for (var w = [], x = 0; x < q.Ru.length && 5 > x; x++)
                        w.push(q.Ru[x]);
                    null === v || undefined === v ? undefined : v.error(("Removing instance for ").concat(u, "/").concat(r, ". ") + ("").concat(q.Ru.length, " remaining, earliest: ").concat(w, "}"));
                }
                ).bind(null, this, l.id, l.type, m));
                g.u && m && m.info("Creating tagged instance", l);
                return n;
            }
        }
    }
    ;
    return k;
}
)();
b.Y0b =

// Detected exports: o0, Y0b
