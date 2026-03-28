/**
 * Netflix Cadmium Playercore - Module 43051
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: msb, q2c, r2c, yXb
 * Purpose: ABR/Quality selection
 */

// Webpack module 43051
// Parameters: t (module), b (exports), a (require)

export function r2c(d) {
    return {
        Gb: d[0],
        Na: d[1],
        Ha: d[2],
        duration: d[3],
        profile: d[4],
        bitrate: d[5],
        width: d[6],
        height: d[7],
        V1a: d[8],
        W1a: d[9]
    };
}
;
export function q2c(d) {
    return {
        Gb: d[0],
        Na: d[1],
        Ha: d[2],
        duration: d[3],
        profile: d[4],
        bitrate: d[5],
        channels: d[6]
    };
}
;
export const yXb = {
    padding: {
        "16:9": {
            h264: {
                23976: function() {
                    return a(6350);
                },
                24: function() {
                    return a(937);
                },
                25: function() {
                    return a(6153);
                },
                2997: function() {
                    return a(32477);
                },
                30: function() {
                    return a(19034);
                }
            },
            h264hpl: {
                23976: function() {
                    return a(98989);
                },
                24: function() {
                    return a(5339);
                },
                25: function() {
                    return a(95350);
                },
                2997: function() {
                    return a(4029);
                },
                30: function() {
                    return a(75034);
                }
            },
            "hevc-main10": {
                23976: function() {
                    return a(56803);
                },
                24: function() {
                    return a(51914);
                },
                25: function() {
                    return a(44661);
                },
                2997: function() {
                    return a(5066);
                },
                30: function() {
                    return a(10124);
                },
                50: function() {
                    return a(23259);
                },
                5994: function() {
                    return a(33781);
                },
                60: function() {
                    return a(98640);
                }
            },
            av1: {
                23976: function() {
                    return a(83295);
                },
                24: function() {
                    return a(77013);
                },
                25: function() {
                    return a(64826);
                },
                2997: function() {
                    return a(60939);
                },
                30: function() {
                    return a(58097);
                },
                50: function() {
                    return a(50640);
                },
                5994: function() {
                    return a(56130);
                },
                60: function() {
                    return a(17826);
                }
            }
        },
        "4:3": {
            h264: {
                23976: function() {
                    return a(46977);
                },
                24: function() {
                    return a(47976);
                },
                25: function() {
                    return a(45185);
                },
                2997: function() {
                    return a(5801);
                },
                30: function() {
                    return a(26931);
                }
            },
            h264hpl: {
                23976: function() {
                    return a(26776);
                },
                24: function() {
                    return a(25378);
                },
                25: function() {
                    return a(41470);
                },
                2997: function() {
                    return a(6320);
                },
                30: function() {
                    return a(59375);
                }
            },
            "hevc-main10": {
                23976: function() {
                    return a(56E3);
                },
                24: function() {
                    return a(21610);
                },
                25: function() {
                    return a(96660);
                },
                2997: function() {
                    return a(35455);
                },
                30: function() {
                    return a(88354);
                },
                50: function() {
                    return a(90090);
                },
                5994: function() {
                    return a(35619);
                },
                60: function() {
                    return a(13947);
                }
            },
            av1: {
                23976: function() {
                    return a(61547);
                },
                24: function() {
                    return a(81396);
                },
                25: function() {
                    return a(64332);
                },
                2997: function() {
                    return a(81647);
                },
                30: function() {
                    return a(15871);
                },
                50: function() {
                    return a(79196);
                },
                5994: function() {
                    return a(3338);
                },
                60: function() {
                    return a(7937);
                }
            }
        }
    }
};
export const msb = {
    silence: {
        heaac: {
            64: function() {
                return a(54468);
            },
            96: function() {
                return a(39532);
            },
            128: function() {
                return a(46871);
            }
        },
        ddp: {
            192: function() {
                return a(80463);
            },
            256: function() {
                return a(73502);
            },
            384: function() {
                return a(86252);
            },
            448: function() {
                return a(27443);
            },
            640: function() {
                return a(75452);
            }
        },
        xheaac: {
            32: function() {
                return a(70349);
            },
            64: function() {
                return a(72041);
            },
            96: function() {
                return a(47718);
            },
            192: function() {
                return a(95426);
            }
        }
    }
};

// Detected exports: msb, q2c, r2c, yXb
