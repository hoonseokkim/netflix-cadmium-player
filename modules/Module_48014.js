/**
 * Netflix Cadmium Playercore - Module 48014
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Sdb, Xja
 */

// Webpack module 48014
// Parameters: t (module), b (exports), a (require)

var p;
function d(c, g) {
    c = g.indexOf(c);
    -1 !== c && g.splice(c, 1);
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Sdb = b.Xja = undefined;
p = a(75589);  // import from Module_75589
t = (function() {
    function c(g) {
        this.endOffset = g;
        this.done = false;
    }
    c.prototype.QAb = function() {
        return this.done;
    }
    ;
    c.prototype.Txb = function(g, f, e) {
        return this.done = f + e >= this.endOffset;
    }
    ;
    return c;
}
)();
export const Xja = t;
t = (function() {
    function c(g, f, e, h) {
        undefined === f && (f = []);
        undefined === e && (e = []);
        undefined === h && (h = false);
        this.lC = g;
        this.uqa = f;
        this.MUb = e;
        this.b2a = h;
        this.done = false;
        this.Tp = {};
    }
    c.prototype.QAb = function(g, f, e) {
        -1 !== c.xBc.indexOf(g) && (this.Tp[g] = {
            offset: f,
            size: e
        });
        if (-1 !== this.MUb.indexOf(g)) {
            if ((this.Tp[g] = {
                offset: f,
                size: e
            },
            this.b2a))
                this.endOffset = f + e;
            else
                return (this.endOffset = f,
                this.done = true);
        } else
            this.lC && -1 !== this.lC.indexOf(g) ? (g = 1 < this.lC.length ? 4096 : 0,
            this.endOffset = Math.max(f + e + g, this.endOffset || 0)) : -1 !== this.uqa.indexOf(g) && (g = this.lC ? 4096 : 0,
            this.endOffset = Math.max(f + e + g, this.endOffset || 0));
        return this.done;
    }
    ;
    c.prototype.Txb = function(g, f, e, h) {
        var k;
        k = this;
        if (-1 !== this.MUb.indexOf(g))
            return this.done = true;
        g === p.RHa && this.zSb(h.Tp);
        g === p.SHa && this.zSb(h.Tp);
        this.lC && d(g, this.lC);
        d(g, this.uqa);
        return this.lC && 0 === this.lC.length && !this.uqa.some(function(l) {
            return k.Tp[l];
        }) ? this.done = true : this.done;
    }
    ;
    c.prototype.zSb = function(g) {
        var f;
        f = this;
        this.Tp = g;
        this.endOffset = (this.lC || []).concat(this.uqa).reduce(function(e, h) {
            return f.Tp[h] ? (h = f.Tp[h],
            Math.max(h.offset + (h.size || 4096), e)) : e;
        }, this.endOffset || 0);
    }
    ;
    c.xBc = ["moov", "sidx"]  /* config: moov = "sidx" */;
    return c;
}
)();
b.Sdb =

// Detected exports: Sdb, Xja
