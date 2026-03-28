/**
 * Netflix Cadmium Playercore - Module 55024
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: fkb
 */

// Webpack module 55024
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const fkb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(65161);  // import from Module_65161
g = a(6832);  // import from Module_06832
f = a(36640);  // import from Module_36640
t = (function() {
    function e(h, k, l, m, n, q, r, u) {
        this.mediaType = h;
        this.console = k;
        this.Mb = l;
        this.loa = m;
        this.yp = n;
        this.ax = q;
        this.tc = r;
        this.OK = [];
        this.mediaType === c.l.U && this.OK.push(new f.vlb(h,k,l,m,n,q,r,u,2));
        this.OK.push(new g.hma(h,k,l,m,n,q,r,1,null === u || undefined === u ? undefined : u.UXa()));
    }
    e.prototype.zA = function(h, k, l) {
        this.Mb = h;
        this.tc = k;
        this.loa = l;
        this.IF.forEach(function(m) {
            return m.zA(h, k, l);
        });
    }
    ;
    e.prototype.bbc = function(h) {
        this.OK.push(h);
    }
    ;
    e.prototype.d0 = function(h) {
        return (0,
        p.kc)(this.OK, function(k) {
            return k instanceof h;
        });
    }
    ;
    e.prototype.reset = function() {
        this.OK.forEach(function(h) {
            return h.reset();
        });
    }
    ;
    e.prototype.close = function() {
        this.OK.forEach(function(h) {
            return h.close();
        });
    }
    ;
    e.prototype.vl = function(h) {
        return d.__read(this.OK, 1)[0].vl(h);
    }
    ;
    Object.defineProperties(e.prototype, {
        IF: {
            get: function() {
                return this.OK;
            },
            enumerable: false,
            configurable: true
        }
    });
    e.prototype.x1a = function() {
        this.IF.forEach(function(h) {
            return h.x1a();
        });
    }
    ;
    e.prototype.K7a = function(h) {
        this.IF.forEach(function(k, l) {
            var m;
            l = null === h || undefined === h ? undefined : h.IF[l];
            null === (m = k.K7a) || undefined === m ? undefined : m.call(k, l);
        });
    }
    ;
    return e;
}
)();
b.fkb =

// Detected exports: fkb
