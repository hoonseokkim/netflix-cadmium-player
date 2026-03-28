/**
 * Netflix Cadmium Playercore - Module 94500
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: J5b, Ut
 * Dependencies: 22970, 48571, 85068
 * Purpose: Configuration, Class definition, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_48571 from './Module_48571.js';
// import dep_85068 from './Module_85068.js';

// Webpack module 94500
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(22970);
p = a(48571);
c = a(85068);
t = (function() {
    class g {
    constructor(f, e) {
        this.mb = f;
        this.eI = e ? [e] : [];
    }
    addListener(f) {
        -1 === this.eI.indexOf(f) && (this.eI = this.eI.slice(),
        this.eI.push(f));
    }
    removeListener(f) {
        f = this.eI.indexOf(f);
        -1 !== f && (this.eI = this.eI.slice(),
        this.eI.splice(f, 1));
    }
}
Object.defineProperties(g.prototype, {
        value: {
            get: function() {
                return this.mb;
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const J5b = t;
t = (function(g) {
    class f extends g {
    constructor(e, h) {
        return g.call(this, e, h) || this;
    }
    set(e) {
        var h;
        h = this.mb;
        h !== e && (this.mb = e,
        this.eI.forEach(function(k) {
            return k({
                oldValue: h,
                newValue: e
            });
        }));
    }
}
d.f.TXb = function(e, h, k) {
        return new p.gIa(e,h,k,false);
    }
    ;
    f.H4c = function(e, h, k) {
        return d.__awaiter(this, undefined, undefined, function() {
            var l, m, n;
            n = this;
            return d.__generator(this, function(q) {
                switch (q.label) {
                case 0:
                    (l = undefined,
                    m = new Promise(function(r) {
                        l = n.TXb(e, h, r);
                    }
                    ),
                    q.label = 1);
                case 1:
                    return (q.ac.push([1, , 6, 7]),
                    k ? [4, (0,
                    c.dPb)(k, m)] : [3, 3]);
                case 2:
                    return [2, q.T()];
                case 3:
                    return [4, m];
                case 4:
                    return [2, q.T()];
                case 5:
                    return [3, 7];
                case 6:
                    return (l.clear(),
                    [7]);
                case 7:
                    return [2];
                }
            });
        });
    }
    ;
    Object.defineProperties(f.prototype, {
        value: {
            get: function() {
                return this.mb;
            },
            set: function(e) {
                this.set(e);
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)(t);
export const Ut = t;

// Detected exports: J5b, Ut
