/**
 * Netflix Cadmium Playercore - Module 54331
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: wKb
 */

// Webpack module 54331
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function wKb(c) {
    var g, f;
    g = this;
    f = {
        start: undefined,
        end: undefined
    };
    return [function() {
        for (var e = [], h = 0; h < arguments.length; h++)
            e[h] = arguments[h];
        return d.__awaiter(g, undefined, undefined, function() {
            return d.__generator(this, function() {
                f.start = p.platform.time.fa();
                return [2, c.apply(undefined, d.__spreadArray([], d.__read(e), false)).then(function(k) {
                    f.end = p.platform.time.fa();
                    return k;
                }).catch(function(k) {
                    f.end = p.platform.time.fa();
                    throw k;
                })];
            });
        });
    }
    , f];
}
;
d = a(22970);  // import from Module_22970
p = a(6616

// Detected exports: wKb
