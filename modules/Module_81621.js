/**
 * Netflix Cadmium Playercore - Module 81621
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: Ozb
 */

// Webpack module 81621
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ozb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
export function Ozb(c, g) {
    return function(f, e) {
        return d.__awaiter(undefined, undefined, undefined, function() {
            var h, k, l, m, n;
            return d.__generator(this, function(q) {
                switch (q.label) {
                case 0:
                    if (0 >= g)
                        return [2, c(f, e)];
                    k = (h = f instanceof Request) ? f.signal : null === e || undefined === e ? undefined : e.signal;
                    l = new p.yma();
                    k && l.P6a(k);
                    m = setTimeout(function() {
                        l.abort();
                    }, g);
                    q.label = 1;
                case 1:
                    return (q.ac.push([1, , 6, 7]),
                    n = undefined,
                    h ? [4, Promise.race([(0,
                    p.ooa)(l.signal, true).then(function() {
                        return Response.error();
                    }), c(f, e)])] : [3, 3]);
                case 2:
                    return (n = q.T(),
                    [3, 5]);
                case 3:
                    return [4, c(f, d.__assign(d.__assign({}, e), {
                        signal: l.signal
                    }))];
                case 4:
                    (n = q.T(),
                    q.label = 5);
                case 5:
                    return [2, n];
                case 6:
                    return (clearTimeout(m),
                    [7]);
                case 7:
                    return [2];
                }
            });
        });
    }
    ;
}

// Detected exports: Ozb
