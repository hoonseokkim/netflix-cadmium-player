/**
 * Netflix Cadmium Playercore - Module 50599
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: map, yCb, ZQb
 */

// Webpack module 50599
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const ZQb = b.yCb = b.map = undefined;
d = a(22970);  // import from Module_22970
a(1738);
export function map(p) {
    return function(c, g) {
        undefined === g && (g = false);
        return function(f, e, h) {
            var k, l, m, n;
            k = Reflect.OCb(p, f, e) || ({});
            m = "number" === typeof h;
            n = g;
            (l = m ? (k.Xa || ({}))[h] || ({}) : n ? k.return : k.X_a) || (l = {
                rules: []
            });
            l = d.__assign(d.__assign(d.__assign({}, l), c), {
                rules: d.__spreadArray(d.__spreadArray([], d.__read(l.rules || []), false), d.__read(c.rules || []), false)
            });
            m ? (k.Xa || (k.Xa = {}),
            k.Xa[h] = l) : n ? k.return = l : k.X_a = l;
            Reflect.kqa(p, k, f, e);
        }
        ;
    }
    ;
}
;
export function yCb(p) {
    return function(c, g) {
        var f, e, h, k;
        c = null !== (k = null !== (e = null === (f = c.__proxyCtor) || undefined === f ? undefined : f.prototype) && undefined !== e ? e : null === (h = null === c || undefined === c ? undefined : c.constructor) || undefined === h ? undefined : h.prototype) && undefined !== k ? k : c;
        for (var l; c && undefined === l; )
            (l = Reflect.OCb(p, c, g),
            c = c.__proto__);
        return l;
    }
    ;
}
;
export function ZQb() {
    return function() {
        return function(p) {
            return p;
        }
        ;
    }
    ;
}

// Detected exports: map, yCb, ZQb
