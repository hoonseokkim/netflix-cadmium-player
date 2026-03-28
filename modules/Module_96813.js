/**
 * Netflix Cadmium Playercore - Module 96813
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: fRc
 */

// Webpack module 96813
// Parameters: t (module), b (exports), a (require)

var d, p, c;
export function fRc(g) {
    return new Promise(function(f, e) {
        var h;
        h = c.K3b(g);
        h && e(h);
        (h = c.J3b(g)) && e(h);
        f(g.sort(function(k, l) {
            return p.indexOf(k.errorCode) - p.indexOf(l.errorCode);
        }));
    }
    );
}
;
d = a(36129);  // import from Module_36129
p = [d.ea.G1b, d.ea.oeb, d.ea.peb, d.ea.teb, d.ea.keb, d.ea.ieb, d.ea.OFa, d.ea.K1b, d.ea.leb, d.ea.jeb, d.ea.cK, d.ea.feb, d.ea.heb, d.ea.qeb, d.ea.reb, d.ea.seb, d.ea.meb, d.ea.geb, d.ea.neb];
(function(g) {
    g.J3b = function(f) {
        var k;
        for (var e = {}, h = 0; h < f.length; h++) {
            k = f[h];
            if (e[k.errorCode])
                return {
                    errorCode: k.errorCode,
                    Ya: d.Y.HYb
                };
            e[k.errorCode] = 1;
        }
    }
    ;
    g.K3b = function(f) {
        var h;
        for (var e = 0; e < f.length; e++) {
            h = f[e];
            if (-1 === p.indexOf(h.errorCode))
                return {
                    errorCode: h.errorCode,
                    Ya: d.Y.IYb
                };
        }
    }
    ;
}
)(c || (c = {}

// Detected exports: fRc
