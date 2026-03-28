/**
 * Netflix Cadmium Playercore - Module 98263
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Nab
 * Dependencies: 22970
 * Purpose: Encryption/Decryption, Parsing/Serialization, Error handling, Playback control
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 98263
// Parameters: t (module), b (exports), a (require)

var d, p;

t = a(22970);
d = t.__importDefault(a(51411));
p = t.__importDefault(a(12457));
a = (function() {
    class c {
    constructor() {
        var g, f, e;
        g = p.default.We();
        g.iZ = d.default.kf;
        f = {
            values: [],
            stack: [],
            qn: undefined,
            rp: undefined,
            xR: undefined
        };
        e = false;
        g.onerror = function() {
            e || (e = true,
            g.end());
        }
        ;
        g.onopenobject = function(h) {
            var k;
            if (f.qn)
                (f.qn[f.xR] = {},
                f.stack.push(f.qn),
                f.qn = f.qn[f.xR]);
            else if (f.rp) {
                k = {};
                f.stack.push(f.rp);
                f.rp.push(k);
                f.qn = k;
                f.rp = undefined;
            } else
                f.qn = {};
            f.xR = h;
        }
        ;
        g.oncloseobject = function() {
            var h;
            h = f.stack.pop();
            h ? "object" === typeof h ? f.qn = h : (f.qn = undefined,
            f.rp = h) : (f.values.push(f.qn),
            f.qn = undefined,
            g.pause());
        }
        ;
        g.onopenarray = function() {
            var h;
            if (f.qn)
                (f.qn[f.xR] = [],
                f.stack.push(f.qn),
                f.rp = f.qn[f.xR],
                f.qn = undefined);
            else if (f.rp) {
                h = [];
                f.stack.push(f.rp);
                f.rp.push(h);
                f.rp = h;
            } else
                f.rp = [];
        }
        ;
        g.onclosearray = function() {
            var h;
            h = f.stack.pop();
            h ? "object" === typeof h ? (f.qn = h,
            f.rp = undefined) : f.rp = h : (f.values.push(f.rp),
            f.rp = undefined,
            g.pause());
        }
        ;
        g.onkey = function(h) {
            f.xR = h;
        }
        ;
        g.onvalue = function(h) {
            f.qn ? f.qn[f.xR] = h : f.rp ? f.rp.push(h) : (f.values.push(h),
            g.pause());
        }
        ;
        this.Qe = g;
        this.gb = f;
    }
    write(g) {
        this.Qe.resume();
        this.Qe.write(g);
    }
    YKb() {
        var g;
        g = this.gb;
        0 == g.values.length && 0 < this.Qe.pending.length && (this.Qe.resume(),
        this.Qe.parse());
        if (0 < g.values.length)
            return g.values.shift();
    }
}
return c;
}
)();
export const Nab = a;

// Detected exports: Nab
