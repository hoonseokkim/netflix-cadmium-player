/**
 * Netflix Cadmium Playercore - Module 14600
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: LGa
 * Dependencies: 2248, 22674, 22970, 74870
 * Purpose: Parsing/Serialization, Error handling, UI components, Dependency injection
 */

// import dep_2248 from './Module_2248.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_74870 from './Module_74870.js';

// Webpack module 14600
// Parameters: t (module), b (exports), a (require)

var m, n, q;
class d {
    constructor(r, u) {
    this.Pd = r;
    this.hg = u;
    this.Uc = [];
}
    Zac(r) {
    this.Uc.push(new k(r));
}
    Wqb(r) {
    this.Uc.push(new h(this.hg,r));
}
    yac(r) {
    this.Uc.push(new e(r));
}
    Aac(r) {
    this.Uc.push(new f(this.hg,r));
}
    cbc(r) {
    this.Uc.push(new g(this.Pd,r));
}
    Hac(r) {
    this.Uc.push(new c(r));
}
    ebc(r) {
    this.Uc.push(new p(r));
}
    build() {
    return this.Uc;
}
}
class p extends l {
    constructor(r) {
    return l.call(this, r, function(u) {
        return {
            Details: u
        };
    }) || this;
}
    TV() {
    return ", " + (this.fC.toString ? "" + this.fC.toString() : "");
}
}
class c extends l {
    constructor(r) {
    return l.call(this, r, function(u) {
        return JSON.parse(u.toJSON());
    }) || this;
}
    TV() {
    return this.fC ? this.fC.toJSON() : "";
}
}
class g extends l {
    constructor(r, u) {
    u = l.call(this, u, function(v) {
        return {
            Base64: r.encode(v)
        };
    }) || this;
    u.Pd = r;
    return u;
}
    TV() {
    return this.fC ? "\r\n" + this.Pd.encode(this.fC) : "";
}
}
class f extends l {
    constructor(r, u) {
    u = l.call(this, u, function(v) {
        return v();
    }) || this;
    u.hg = r;
    return u;
}
    TV() {
    var r;
    r = "";
    this.hg.$R(this.value, function(u, v) {
        r += ", " + u + ": " + v;
    });
    return r.replace(/[\r\n]+ */g, " ");
}
}
class e extends l {
    constructor(r) {
    return l.call(this, r, function(u) {
        return {
            Exception: u.message || "" + u,
            StackTrace: u.stack || "nostack"
        };
    }) || this;
}
    TV(r) {
    var u;
    u = "\r\n" + this.fC.message;
    r || (u += "\r\n" + this.fC.stack);
    return u;
}
}
class h extends l {
    constructor(r, u, v) {
    u = l.call(this, u, v) || this;
    u.hg = r;
    return u;
}
    TV() {
    var r;
    r = "";
    this.hg.$R(this.value, function(u, v) {
        try {
            r += ", " + u + ": " + v;
        } catch (w) {
            try {
                r += ", " + u + ": " + JSON.stringify(v);
            } catch (x) {
                r += ", error stringifying " + u;
            }
        }
    });
    return r.replace(/[\r\n]+ */g, " ");
}
}
class k extends l {
    constructor(r) {
    return l.call(this, r, function(u) {
        return {
            Details: u
        };
    }) || this;
}
    TV() {
    return "\r\n" + this.fC;
}
}
class l {
    constructor(r, u) {
    this.fC = r;
    this.value = u ? u(r) : r;
}
    Uaa(r) {
    return this.fC === r;
}
}
t = a(22970);
m = a(22674);
n = a(74870);
a = a(2248);
q = d;
export const LGa = q;
export const LGa = q = t.__decorate([(0,
m.aa)(), t.__param(0, (0,
m.v)(a.Km)), t.__param(1, (0,
m.v)(n.Um))], q);

// Detected exports: LGa
