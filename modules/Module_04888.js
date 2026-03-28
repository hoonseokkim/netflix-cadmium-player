/**
 * Netflix Cadmium Playercore - Module 4888
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: J4c
 */

// Webpack module 4888
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export function J4c(e, h) {
    function k(l) {
        var m, n, q, r;
        m = e.url;
        n = e.trace;
        q = e.Of;
        r = {
            "x-netflix.request.client.context": JSON.stringify({
                appState: e.visible.sW ? "foreground" : "background"
            }),
            "x-netflix.socketrouter.schema.version": "" + d.ema.bWc,
            "x-netflix.socketrouter.group.name": "" + h.groupName
        };
        return g.OLa.open({
            url: m,
            trace: n,
            Of: q,
            Xa: r,
            timing: l
        });
    }
    return function(l) {
        return p.V9a.open({
            timing: l,
            trace: e.trace,
            timeout: e.timeout,
            RY: c.W9a.Utc({
                trace: e.trace,
                Ni: e.Ni.RY
            }),
            Au: k,
            tE: new f.Nlb(e.Rk)
        });
    }
    ;
}
;
d = a(41066);  // import from Module_41066
p = a(42050);  // import from Module_42050
c = a(61222);  // import from Module_61222
g = a(42933);  // import from Module_42933
f = a(1409

// Detected exports: J4c
