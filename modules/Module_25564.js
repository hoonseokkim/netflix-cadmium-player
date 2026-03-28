/**
 * Netflix Cadmium Playercore - Module 25564
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: T5
 * Dependencies: 22970, 32296, 72905
 * Purpose: Configuration, Parsing/Serialization, Error handling, UI components
 */

// import dep_22970 from './Module_22970.js';
// import dep_32296 from './Module_32296.js';
// import dep_72905 from './Module_72905.js';

// Webpack module 25564
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
p = a(72905);
c = a(32296);
t = (function(g) {
    class f extends g {
    constructor(e, h, k, l, m) {
        k = g.call(this, k, l, m) || this;
        k.pec = e;
        k.u4 = h;
        k.Se = {};
        return k;
    }
    parse(e) {
        var h, k, l, m, n, q;
        this.offset = 0;
        h = [];
        e = e || ({});
        for (e.ce = e.ce || ({}); this.offset < this.view.byteLength && !(8 > this.view.byteLength - this.offset); ) {
            k = this.offset;
            l = this.dc();
            if (0 === l)
                return {
                    done: false,
                    offset: this.offset,
                    error: "Invalid zero-length box"
                };
            m = (0,
            c.wK)(this.dc());
            if (null === m)
                return {
                    done: false,
                    offset: this.offset,
                    error: "Invalid box type"
                };
            if ("uuid" === m) {
                if (16 > this.view.byteLength - this.offset)
                    break;
                m = this.Mya();
            }
            if (0 === h.length && this.u4.QAb(m, k, l)) {
                this.offset = k;
                break;
            }
            if (k + l > this.view.byteLength) {
                this.offset = k;
                break;
            }
            n = this.pec[m];
            q = undefined;
            if (n) {
                if ((q = new n(this,m,k,l,h[0]),
                (h[0] || this).F9(q),
                q.parse(e)))
                    this.config.Fxa && n.Fd ? h.unshift(q) : this.offset = k + l;
                else
                    return {
                        done: false,
                        offset: this.offset,
                        error: "parse error in " + m + " box"
                    };
            } else
                this.offset = k + l;
            for (; h.length && this.offset > h[0].byteOffset + h[0].bU - 8; ) {
                q = h.shift();
                if (!q.OH(e))
                    return {
                        done: false,
                        offset: this.offset,
                        error: "finalize error in " + q.type + " box"
                    };
                this.offset = q.byteOffset + q.bU;
            }
            if (0 === h.length && this.u4.Txb(m, k, l, q))
                break;
        }
        return !this.u4.done && (e = this.u4.endOffset ? this.u4.endOffset - this.view.byteLength : 4096,
        0 < e) ? {
            done: false,
            offset: this.offset,
            JKb: e
        } : {
            done: true,
            offset: Math.min(this.u4.endOffset || Infinity, this.offset)
        };
    }
    F9(e) {
        p.Kf.F9(this, e);
    }
}
d.return f;
}
)(a(56445).znb);
export const T5 = t;

// Detected exports: T5
