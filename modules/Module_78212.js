/**
 * Netflix Cadmium Playercore - Module 78212
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 78212
// Parameters: t (module), b (exports), N/A (require)


Object.defineProperty(b, "__esModule", {
    value: !0
});
b.Z9a = b.ija = b.$9a = b.U9a = void 0;
(function(a) {
    a.AES_GCM = "AES-GCM";
    a.AES_CBC = "AES-CBC";
    a.HMAC_SHA256 = "HMAC-SHA256";
    a.RSA_OAEP = "RSA-OAEP";
    a.DIFFIE_HELLMAN = "DIFFIE-HELLMAN";
    a.DERIVE = "DERIVE";
}
)(b.U9a || (b.U9a = {}));
(function(a) {
    a[a.SECRET = 0] = "SECRET";
    a[a.PRIVATE = 1] = "PRIVATE";
    a[a.PUBLIC = 2] = "PUBLIC";
}
)(b.$9a || (b.$9a = {}));
b.ija = (function() {
    function a(d, p, c) {
        this.algorithm = d;
        this.WB = p;
        this.type = c;
    }
    a.XZ = function(d, p) {
        if ("RSA-OAEP" === d || "DIFFIE-HELLMAN" === d)
            throw Error("incompatible algorithm for secret key");
        return new a(d,p,0);
    }
    ;
    a.UZ = function(d, p) {
        if ("RSA-OAEP" !== d && "DIFFIE-HELLMAN" !== d)
            throw Error("incompatible algorithm for private key");
        return new a(d,p,1);
    }
    ;
    a.VZ = function(d, p) {
        if ("RSA-OAEP" !== d && "DIFFIE-HELLMAN" !== d)
            throw Error("incompatible algorithm for public key");
        return new a(d,p,2);
    }
    ;
    return a;
}
)();
b.Z9a = (function() {
    return function(a, d) {
        if (1 !== a.type)
            throw Error("wrong key type for private key");
        if (2 !== d.type)
            throw Error("wrong key type for public key");
        if (a.algorithm !== d.algorithm)
            throw Error("algorithm mismatch between public and private key");
        this.algorithm = a.algorithm;
        this.privateKey = a;
        this.publicKey = d;
    }
    ;
}
)();


// Detected exports: Z9a, ija, U9a