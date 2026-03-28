/**
 * Netflix Cadmium Playercore - Module 41192
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Kdb, o9a, p9a, q9a, r9a, s9a, sbb, ydb
 * Dependencies: 22970
 * Purpose: Parsing/Serialization, Class definition
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 41192
// Parameters: t (module), b (exports), a (require)

var d;
export const o9a = b.sbb = b.ydb = b.Kdb = b.s9a = b.r9a =
d = a(22970);
t = (function(p) {
    class c extends p {
    constructor() {
        return null !== p && p.apply(this, arguments) || this;
    }
    parse(g) {
        p.prototype.parse.call(this, g);
        this.Uc = this.qF([{
            offset: 16,
            type: "offset"
        }, {
            offset: 16,
            type: "offset"
        }, {
            offset: 96,
            type: "offset"
        }, {
            width: "int16"
        }, {
            height: "int16"
        }, {
            Fgd: "int32"
        }, {
            nnd: "int32"
        }, {
            offset: 32,
            type: "offset"
        }, {
            sfd: "int16"
        }, {
            ldd: {
                type: "int8",
                scc: 32
            }
        }, {
            depth: "int16"
        }, {
            offset: 16,
            type: "offset"
        }]);
        if (null === g || undefined === g ? 0 : g.ce)
            (g.ce.width = this.Uc.width,
            g.ce.height = this.Uc.height);
        return true;
    }
}
d.c.Fd = true;
    return c;
}
)(a(71724).default);
b["default"] = t;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "avc1";
    return c;
}
)(t);
export const p9a = a;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "avc2";
    return c;
}
)(t);
export const q9a = a;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "avc3";
    return c;
}
)(t);
export const r9a = a;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "avc4";
    return c;
}
)(t);
export const s9a = a;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "hvc1";
    return c;
}
)(t);
export const Kdb = a;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "hev1";
    return c;
}
)(t);
export const ydb = a;
a = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "dvhe";
    return c;
}
)(t);
export const sbb = a;
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.Ae = "av01";
    return c;
}
)(t);
export const o9a = t;

// Detected exports: Kdb, o9a, p9a, q9a, r9a, s9a, sbb, ydb
