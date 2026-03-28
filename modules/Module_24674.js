/**
 * Netflix Cadmium Playercore - Module 24674
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ldd, Mdd, Ndd, Odd, Pdd
 * Dependencies: 31276, 32687, 33096, 62604, 70834, 84281
 * Purpose: DRM/License handling, Audio handling, Video handling, Encryption/Decryption
 */

// import dep_31276 from './Module_31276.js';
// import dep_32687 from './Module_32687.js';
// import dep_33096 from './Module_33096.js';
// import dep_62604 from './Module_62604.js';
// import dep_70834 from './Module_70834.js';
// import dep_84281 from './Module_84281.js';

// Webpack module 24674
// Parameters: t (module), b (exports), a (require)

var f, e, h, k, l, m;
function d(n) {
    var q;
    n = new h.Tja(n);
    if (1481462272 != n.ix())
        throw Error("Invalid header");
    q = {
        XMR: {
            Version: n.ix(),
            RightsID: n.pF(16)
        }
    };
    p(n, q.XMR, n.usa());
    return q;
}
function p(n, q, r) {
    var u, v, w, x, y;
    for (; n.position < r; ) {
        u = n.Fj();
        v = n.ix();
        v -= 8;
        switch (u) {
        case 1:
            w = "OuterContainer";
            break;
        case 2:
            w = "GlobalPolicy";
            break;
        case 3:
            w = "MinimumEnvironment";
            break;
        case 4:
            w = "PlaybackPolicy";
            break;
        case 5:
            w = "OutputProtection";
            break;
        case 6:
            w = "UplinkKID";
            break;
        case 7:
            w = "ExplicitAnalogVideoOutputProtectionContainer";
            break;
        case 8:
            w = "AnalogVideoOutputConfiguration";
            break;
        case 9:
            w = "KeyMaterial";
            break;
        case 10:
            w = "ContentKey";
            break;
        case 11:
            w = "Signature";
            break;
        case 12:
            w = "DeviceIdentification";
            break;
        case 13:
            w = "Settings";
            break;
        case 18:
            w = "ExpirationRestriction";
            break;
        case 42:
            w = "ECCKey";
            break;
        case 48:
            w = "ExpirationAfterFirstPlayRestriction";
            break;
        case 50:
            w = "PlayReadyRevocationInformationVersion";
            break;
        case 51:
            w = "EmbeddedLicenseSettings";
            break;
        case 52:
            w = "SecurityLevel";
            break;
        case 54:
            w = "PlayEnabler";
            break;
        case 57:
            w = "PlayEnablerType";
            break;
        case 85:
            w = "RealTimeExpirationRestriction";
            break;
        default:
            w = "Other";
        }
        x = {
            Type: c(u)
        };
        y = q[w];
        y ? (0,
        m.isArray)(y) ? y.push(x) : (q[w] = [],
        q[w].push(y),
        q[w].push(x)) : q[w] = x;
        switch (u) {
        case 1:
        case 2:
        case 4:
        case 7:
        case 9:
        case 54:
            p(n, x, n.position + v);
            break;
        case 5:
            x.Reserved1 = n.Fj();
            x.MinimumUncompressedDigitalVideoOutputProtectionLevel = n.Fj();
            x.MinimumAnalogVideoOutputProtectionLevel = n.Fj();
            x.Reserved2 = n.Fj();
            x.MinimumUncompressedDigitalAudioOutputProtectionLevel = n.Fj();
            break;
        case 10:
            x.Reserved = n.pF(16);
            x.SymmetricCipherType = n.Fj();
            x.AsymmetricCipherType = n.Fj();
            v = n.Fj();
            x.EncryptedKeyLength = v;
            u = n.pF(v);
            x.EncryptedKeyData = 10 >= v ? u : u.substring(0, 4) + "..." + u.substring(u.length - 4, u.length);
            break;
        case 11:
            x.SignatureType = n.pF(2);
            v = n.Fj();
            u = n.pF(v);
            x.SignatureData = 10 >= v ? u : u.substring(0, 4) + "..." + u.substring(u.length - 4, u.length);
            break;
        case 13:
            x.Reserved = n.Fj();
            break;
        case 18:
            x.BeginDate = n.ix();
            x.EndDate = n.ix();
            break;
        case 42:
            x.CurveType = n.pF(2);
            v = n.Fj();
            u = n.pF(v);
            x.Key = 10 >= v ? u : u.substring(0, 4) + "..." + u.substring(u.length - 4, u.length);
            break;
        case 48:
            x.ExpireAfterFirstPlay = n.ix();
            break;
        case 50:
            x.Sequence = n.ix();
            break;
        case 51:
            x.LicenseProcessingIndicator = n.Fj();
            break;
        case 52:
            x.MinimumSecurityLevel = n.Fj();
            break;
        case 57:
            x.PlayEnablerType = g(n.pF(16));
            break;
        case 85:
            break;
        default:
            x.OtherData = n.pF(v);
        }
    }
}
function c(n) {
    return "0x" + n.toString(16);
}
function g(n) {
    return n.substring(6, 8) + n.substring(4, 6) + n.substring(2, 4) + n.substring(0, 2) + "-" + n.substring(10, 12) + n.substring(8, 10) + "-" + n.substring(14, 16) + n.substring(12, 14) + "-" + n.substring(16, 20) + "-" + n.substring(20, 32);
}
export function Ldd(n, q, r) {
    switch (q) {
    case f.bka:
        n && (n = (0,
        e.Msb)(n),
        (0,
        l.g5c)(n, function(u) {
            u.success && (u = u.object) && (u = (0,
            k.dwc)(u, "Body", "AcquireLicenseResponse", "AcquireLicenseResult", "Response", "LicenseResponse", "Licenses", "License")) && (u = (0,
            k.JOc)(u)) && (u = (0,
            e.eH)(u)) && (u = d(u)) && r(u);
        }));
    }
}
;
export const Mdd = d;
export const Ndd = p;
export const Pdd = c;
export const Odd = g;
f = a(33096);
e = a(31276);
h = a(70834);
k = a(62604);
l = a(84281);
m = a(32687);

// Detected exports: Ldd, Mdd, Ndd, Odd, Pdd
