/**
 * Netflix Cadmium Playercore - Module 31509
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Jjb, eK
 * Dependencies: 22970, 52571
 * Purpose: Logging, Configuration, UI components, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_52571 from './Module_52571.js';

// Webpack module 31509
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
p = a(52571);
(function(g) {
    g[g.OC = 0] = "CREATED";
    g[g.RX = 1] = "STARTED";
    g[g.TP = 2] = "REQUEST_ISSUED";
    g[g.cG = 3] = "EVALUATED";
    g[g.TDa = 4] = "DESTRUCTED";
}
)(c || (export const eK = c = {}));
t = (function() {
    class g {
    constructor(f, e, h) {
        this.cO = f;
        this.console = e;
        this.name = h;
        this.gb = c.OC;
        this.rJ = {};
        this.wha = {};
    }
    start() {
        var f;
        f = this;
        this.gb !== c.TDa && this.gb !== c.RX && (this.yea(c.RX),
        [c.cG, c.TP].forEach(function(e) {
            var h;
            h = new Promise(function(k) {
                (0,
                p.assert)(f.wha && f.rJ, "state promises should be defined");
                f.wha[e] = k;
                f.rJ[e] = h;
            }
            );
        }),
        this.cO(),
        this.yea(c.cG));
    }
    yea(f) {
        this.gb = f;
        this.wha && (f = this.wha[f],
        null === f || undefined === f ? undefined : f());
    }
    La() {
        return d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function(f) {
                switch (f.label) {
                case 0:
                    if (this.gb !== c.RX)
                        return [3, 2];
                    (0,
                    p.assert)(this.rJ, "state resolves should be defined");
                    return [4, this.rJ[c.cG]];
                case 1:
                    (f.T(),
                    f.label = 2);
                case 2:
                    return (this.wha = this.rJ = undefined,
                    this.gb = c.TDa,
                    [2]);
                }
            });
        });
    }
    Uia(f, e) {
        d.__awaiter(this, undefined, undefined, function() {
            var h;
            return d.__generator(this, function(k) {
                switch (k.label) {
                case 0:
                    if (this.gb === c.TDa)
                        return [2];
                    if (this.gb === c.cG)
                        return [3, 6];
                    if (!this.rJ)
                        return [2];
                    (0,
                    p.assert)(this.rJ, "state promises should be defined");
                    h = f;
                    switch (h) {
                    case c.cG:
                        return [3, 1];
                    case c.TP:
                        return [3, 3];
                    }
                    return [3, 5];
                case 1:
                    return [4, this.rJ[c.cG]];
                case 2:
                    return (k.T(),
                    [3, 6]);
                case 3:
                    return [4, this.rJ[c.TP]];
                case 4:
                    return (k.T(),
                    [3, 6]);
                case 5:
                    return [3, 6];
                case 6:
                    return (null === e || undefined === e ? undefined : e(),
                    [2]);
                }
            });
        });
    }
}
Object.defineProperties(g.prototype, {
        state: {
            get: function() {
                return this.gb;
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const Jjb = t;

// Detected exports: Jjb, eK
