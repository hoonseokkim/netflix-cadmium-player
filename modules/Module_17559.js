/**
 * Netflix Cadmium Playercore - Module 17559
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: JFa
 */

// Webpack module 17559
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f, e) {
    this.Je = e;
    this.va = f.zb("HttpDispatcherImpl");
}
export const JFa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(87386);  // import from Module_87386
a = a(32934);  // import from Module_32934
d.prototype.download = function(f, e) {
    var h;
    h = this;
    e = undefined === e ? {
        T1: 0
    } : e;
    return new Promise(function(k, l) {
        var n;
        function m(q) {
            if (q.success)
                return k(q.content);
            if (n === e.T1)
                return l({
                    Ya: q.Ya,
                    Mk: q.Rq
                });
            n++;
            false;
            h.Je.download(f, m);
        }
        n = 0;
        h.Je.download(f, m);
    }
    );
}
;
g = d;
export const JFa = g;
b.JFa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(a.Sz))],

// Detected exports: JFa
