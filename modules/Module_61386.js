/**
 * Netflix Cadmium Playercore - Module 61386
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 61386
// Parameters: t (module), b (exports), a (require)

var f, e, h, k;
function d(l) {
    var m, n, q;
    if ("Object" !== h(this))
        throw new TypeError("receiver is not an Object");
    m = e(this, k);
    n = l;
    q = l;
    f(l) && (n = c(m, l),
    q = p(m, l));
    return this.then(n, q);
}
function p(l, m) {
    return function(n) {
        var q;
        q = m();
        return g(l, q).then(function() {
            throw n;
        });
    }
    ;
}
function c(l, m) {
    return function(n) {
        var q;
        q = m();
        return g(l, q).then(function() {
            return n;
        });
    }
    ;
}
function g(l, m) {
    return new l(function(n) {
        n(m);
    }
    );
}
a(57897)();
f = a(83317);  // import from Module_83317
e = a(88251);  // import from Module_88251
h = a(18132);  // import from Module_18132
k = Promise;
Object.getOwnPropertyDescriptor && (b = Object.getOwnPropertyDescriptor(d, "name")) && b.configurable && Object.defineProperty(d, "name", {
    configurable: true,
    value: "finally"
});
t.exports =

