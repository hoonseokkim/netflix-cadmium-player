/**
 * TsLib Helpers - Microsoft TypeScript Runtime Helpers
 *
 * Deobfuscated from Module 22970.
 * These are the standard tslib helper functions used by TypeScript-compiled code.
 */

/* -------------------------------------------------------------------------- */
/*  Internal utilities (not exported directly)                                */
/* -------------------------------------------------------------------------- */

/**
 * __setPrototypeOf polyfill - sets the prototype of an object.
 */
function __setPrototypeOf(target, proto) {
    __setPrototypeOf = Object.setPrototypeOf || (
        ({ __proto__: [] }) instanceof Array && function (t, p) {
            t.__proto__ = p;
        }
    ) || function (t, p) {
        for (var key in p)
            Object.prototype.hasOwnProperty.call(p, key) && (t[key] = p[key]);
    };
    return __setPrototypeOf(target, proto);
}

/**
 * __getOwnPropertyNames polyfill.
 */
function __getOwnPropertyNames(obj) {
    __getOwnPropertyNames = Object.getOwnPropertyNames || function (o) {
        var result = [];
        for (var key in o)
            Object.prototype.hasOwnProperty.call(o, key) && (result[result.length] = key);
        return result;
    };
    return __getOwnPropertyNames(obj);
}

/* -------------------------------------------------------------------------- */
/*  __createBinding                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Creates a re-export binding from one module to another.
 */
var __createBinding = Object.create ? function (target, source, key, alias) {
    var desc;
    if (alias === undefined) alias = key;
    desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc || (("get" in desc) ? !source.__esModule : desc.writable || desc.configurable))
        desc = {
            enumerable: true,
            get: function () {
                return source[key];
            }
        };
    Object.defineProperty(target, alias, desc);
} : function (target, source, key, alias) {
    if (alias === undefined) alias = key;
    target[alias] = source[key];
};

/**
 * Sets the "default" export on a module object.
 */
var __setDefaultExport = Object.create ? function (target, value) {
    Object.defineProperty(target, "default", {
        enumerable: true,
        value: value
    });
} : function (target, value) {
    target["default"] = value;
};

/**
 * SuppressedError polyfill for disposal support.
 */
var SuppressedErrorPolyfill = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var err = Error(message);
    err.name = "SuppressedError";
    err.error = error;
    err.suppressed = suppressed;
    return err;
};

/* -------------------------------------------------------------------------- */
/*  Exported helpers                                                          */
/* -------------------------------------------------------------------------- */

/**
 * __extends - Sets up prototype chain inheritance between two classes.
 */
export function __extends(derived, base) {
    function __() {
        this.constructor = derived;
    }
    if (typeof base !== "function" && base !== null)
        throw new TypeError("Class extends value " + String(base) + " is not a constructor or null");
    __setPrototypeOf(derived, base);
    derived.prototype = base === null
        ? Object.create(base)
        : (__.prototype = base.prototype, new __());
}

/**
 * __assign - Object.assign polyfill.
 */
export function __assign(target) {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var key in s)
                Object.prototype.hasOwnProperty.call(s, key) && (t[key] = s[key]);
        }
        return t;
    };
    return __assign.apply(this, arguments);
}

/**
 * __rest - Returns an object with specified keys removed (destructuring rest).
 */
export function __rest(source, excluded) {
    var target = {};
    for (var key in source)
        Object.prototype.hasOwnProperty.call(source, key) && excluded.indexOf(key) < 0 && (target[key] = source[key]);
    if (source != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var i = 0, symbols = Object.getOwnPropertySymbols(source); i < symbols.length; i++)
            excluded.indexOf(symbols[i]) < 0 && Object.prototype.propertyIsEnumerable.call(source, symbols[i]) && (target[symbols[i]] = source[symbols[i]]);
    }
    return target;
}

/**
 * __decorate - Applies decorators to a class member.
 */
export function __decorate(decorators, target, key, desc) {
    var argCount = arguments.length;
    var result = argCount < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        result = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--) {
            var decorator = decorators[i];
            if (decorator)
                result = (argCount < 3 ? decorator(result) : argCount > 3 ? decorator(target, key, result) : decorator(target, key)) || result;
        }
    return (argCount > 3 && result && Object.defineProperty(target, key, result), result);
}

/**
 * __param - Helper for applying parameter decorators.
 */
export function __param(paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
}

/**
 * __esDecorate - ES decorator support (Stage 3 decorators).
 */
export function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
        if (f !== undefined && typeof f !== "function")
            throw new TypeError("Function expected");
        return f;
    }

    var kind = contextIn.kind;
    var key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});

    var _, done = false;

    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var prop in contextIn)
            context[prop] = prop === "access" ? {} : contextIn[prop];
        for (prop in contextIn.access)
            context.access[prop] = contextIn.access[prop];

        context.addInitializer = function (f) {
            if (done)
                throw new TypeError("Cannot add initializers after decoration has completed");
            extraInitializers.push(accept(f || null));
        };

        var result = (0, decorators[i])(kind === "accessor" ? {
            get: descriptor.get,
            set: descriptor.set
        } : descriptor[key], context);

        if (kind === "accessor") {
            if (result !== undefined) {
                if (result === null || typeof result !== "object")
                    throw new TypeError("Object expected");
                if (_ = accept(result.get))
                    descriptor.get = _;
                if (_ = accept(result.set))
                    descriptor.set = _;
                if ((_ = accept(result.init)) )
                    initializers.unshift(_);
            }
        } else if (_ = accept(result))
            kind === "field" ? initializers.unshift(_) : descriptor[key] = _;
    }

    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}

/**
 * __runInitializers - Runs collected initializers from ES decorators.
 */
export function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++)
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    return useValue ? value : void 0;
}

/**
 * __propKey - Converts a property key to a string (or keeps it as a symbol).
 */
export function __propKey(key) {
    return typeof key === "symbol" ? key : "".concat(key);
}

/**
 * __setFunctionName - Sets the name property on a function (for decorators).
 */
export function __setFunctionName(func, name, prefix) {
    if (typeof name === "symbol")
        name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(func, "name", {
        configurable: true,
        value: prefix ? "".concat(prefix, " ", name) : name
    });
}

/**
 * __metadata - Reflect.metadata decorator helper.
 */
export function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(metadataKey, metadataValue);
}

/**
 * __awaiter - Wraps an async function body into a Promise.
 */
export function __awaiter(thisArg, _arguments, PromiseCtor, generator) {
    function adopt(value) {
        return value instanceof PromiseCtor ? value : new PromiseCtor(function (resolve) {
            resolve(value);
        });
    }
    return new (PromiseCtor || (PromiseCtor = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * __generator - State machine implementation for generator functions.
 */
export function __generator(thisArg, body) {
    var f, y, t, g;
    var step = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);

    function verb(n) {
        return function (v) {
            return dispatch([n, v]);
        };
    }

    function dispatch(op) {
        if (y)
            throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (f = 0)), f)
            try {
                if (y = 1,
                    t && (g = op[0] & 2 ? t["return"] : op[0] ? t["throw"] || ((g = t["return"]) && g.call(t), 0) : t.next) && !(g = g.call(t, op[1])).done)
                    return g;
                if (t = 0, g)
                    op = [op[0] & 2, g.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        g = op;
                        break;
                    case 4:
                        f.label++;
                        return { value: op[1], done: false };
                    case 5:
                        f.label++;
                        t = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = f.ops.pop();
                        f.trys.pop();
                        continue;
                    default:
                        if (!(g = f.trys, g = g.length > 0 && g[g.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            f = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!g || (op[1] > g[0] && op[1] < g[3])))
                            f.label = op[1];
                        else if (op[0] === 6 && f.label < g[1])
                            f.label = g[1], g = op;
                        else if (g && f.label < g[2])
                            f.label = g[2], f.ops.push(op);
                        else {
                            g[2] && f.ops.pop();
                            f.trys.pop();
                            continue;
                        }
                }
                op = body.call(thisArg, f);
            } catch (e) {
                op = [6, e];
                t = 0;
            } finally {
                y = g = 0;
            }
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }

    f = {
        label: 0,
        sent: function () {
            if (g[0] & 1) throw g[1];
            return g[1];
        },
        trys: [],
        ops: []
    };

    step.next = verb(0);
    step["throw"] = verb(1);
    step["return"] = verb(2);
    if (typeof Symbol === "function")
        step[Symbol.iterator] = function () { return this; };

    return step;
}

/**
 * __exportStar - Re-exports all named exports from a source module.
 */
export function __exportStar(source, target) {
    for (var key in source)
        key === "default" || Object.prototype.hasOwnProperty.call(target, key) || __createBinding(target, source, key);
}

/**
 * __values - Returns an iterator for an iterable or array-like object.
 */
export function __values(obj) {
    var symbolIterator = typeof Symbol === "function" && Symbol.iterator;
    var iter = symbolIterator && obj[symbolIterator];
    var i = 0;
    if (iter)
        return iter.call(obj);
    if (obj && typeof obj.length === "number")
        return {
            next: function () {
                if (obj && i >= obj.length) obj = void 0;
                return { value: obj && obj[i++], done: !obj };
            }
        };
    throw new TypeError(symbolIterator ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

/**
 * __read - Reads a fixed number of values from an iterator.
 */
export function __read(obj, n) {
    var m = typeof Symbol === "function" && obj[Symbol.iterator];
    if (!m) return obj;
    var iter = m.call(obj);
    var result = [];
    var e;
    try {
        while ((n === undefined || n-- > 0) && !(m = iter.next()).done)
            result.push(m.value);
    } catch (err) {
        e = { error: err };
    } finally {
        try {
            if (m && !m.done && (m = iter["return"])) m.call(iter);
        } finally {
            if (e) throw e.error;
        }
    }
    return result;
}

/**
 * __spread - Spreads iterables into an array (deprecated, use __spreadArray).
 */
export function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * __spreadArrays - Concatenates multiple arrays (deprecated, use __spreadArray).
 */
export function __spreadArrays() {
    for (var totalLen = 0, i = 0, il = arguments.length; i < il; i++)
        totalLen += arguments[i].length;
    var result = Array(totalLen);
    var k = 0;
    for (i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            result[k] = a[j];
    return result;
}

/**
 * __spreadArray - Spreads the second array into the first (current approach).
 */
export function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++)
            if (!ar && (i in from) || (ar || (ar = Array.prototype.slice.call(from, 0, i)), ar[i] = from[i]));
    return to.concat(ar || Array.prototype.slice.call(from));
}

/**
 * __await - Wraps a value for use in async generators.
 */
export function __await(value) {
    return this instanceof __await ? (this.v = value, this) : new __await(value);
}

/**
 * __asyncGenerator - Creates an async generator from a generator function.
 */
export function __asyncGenerator(thisArg, _arguments, generator) {
    var g, q, pendingOps;

    function wrap(method, callback) {
        if (g[method]) {
            q[method] = function (value) {
                return new Promise(function (resolve, reject) {
                    pendingOps.push([method, value, resolve, reject]) > 1 || resume(method, value);
                });
            };
            if (callback) q[method] = callback(q[method]);
        }
    }

    function resume(method, value) {
        try {
            var result = g[method](value);
            result.value instanceof __await
                ? Promise.resolve(result.value.v).then(onFulfilled, onRejected)
                : settle(pendingOps[0][2], result);
        } catch (e) {
            settle(pendingOps[0][3], e);
        }
    }

    function onFulfilled(value) {
        resume("next", value);
    }

    function onRejected(value) {
        resume("throw", value);
    }

    function settle(fn, value) {
        fn(value);
        pendingOps.shift();
        if (pendingOps.length) resume(pendingOps[0][0], pendingOps[0][1]);
    }

    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");

    g = generator.apply(thisArg, _arguments || []);
    pendingOps = [];
    q = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype);
    wrap("next");
    wrap("throw");
    wrap("return", function (originalReturn) {
        return function (value) {
            return Promise.resolve(value).then(originalReturn, onRejected);
        };
    });
    q[Symbol.asyncIterator] = function () { return this; };
    return q;
}

/**
 * __asyncDelegator - Delegates to an inner async iterator from __asyncGenerator.
 */
export function __asyncDelegator(obj) {
    var iter, waiting;

    function pump(method, callback) {
        iter[method] = obj[method] ? function (value) {
            return (waiting = !waiting) ? {
                value: __await(obj[method](value)),
                done: false
            } : callback ? callback(value) : value;
        } : callback;
    }

    iter = {};
    pump("next");
    pump("throw", function (value) { throw value; });
    pump("return");
    iter[Symbol.iterator] = function () { return this; };
    return iter;
}

/**
 * __asyncValues - Adapts a sync or async iterable for use with for-await-of.
 */
export function __asyncValues(obj) {
    var asyncIter, syncIter;

    function pump(method) {
        syncIter[method] = obj[method] && function (value) {
            return new Promise(function (resolve, reject) {
                value = obj[method](value);
                settle(resolve, reject, value.done, value.value);
            });
        };
    }

    function settle(resolve, reject, done, value) {
        Promise.resolve(value).then(function (v) {
            resolve({ value: v, done: done });
        }, reject);
    }

    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");

    asyncIter = obj[Symbol.asyncIterator];
    if (asyncIter) return asyncIter.call(obj);

    obj = typeof __values === "function" ? __values(obj) : obj[Symbol.iterator]();
    syncIter = {};
    pump("next");
    pump("throw");
    pump("return");
    syncIter[Symbol.asyncIterator] = function () { return this; };
    return syncIter;
}

/**
 * __makeTemplateObject - Creates a template literal tag object.
 */
export function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", { value: raw });
    } else {
        cooked.raw = raw;
    }
    return cooked;
}

/**
 * __importStar - Imports all exports from a module (CommonJS interop).
 */
export function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
        for (var keys = __getOwnPropertyNames(mod), i = 0; i < keys.length; i++)
            if (keys[i] !== "default") __createBinding(result, mod, keys[i]);
    __setDefaultExport(result, mod);
    return result;
}

/**
 * __importDefault - Wraps a CommonJS module with a default export.
 */
export function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
}

/**
 * __classPrivateFieldGet - Reads a private field value.
 */
export function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

/**
 * __classPrivateFieldSet - Writes a private field value.
 */
export function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m")
        throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value);
}

/**
 * __classPrivateFieldIn - Checks if an object has a private field.
 */
export function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
        throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

/**
 * __addDisposableResource - Adds a disposable resource to a disposal stack.
 */
export function __addDisposableResource(env, value, async) {
    var dispose, syncDispose;
    if (value !== null && value !== undefined) {
        if (typeof value !== "object" && typeof value !== "function")
            throw new TypeError("Object expected.");
        if (async) {
            if (!Symbol.asyncDispose)
                throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === undefined) {
            if (!Symbol.dispose)
                throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) syncDispose = dispose;
        }
        if (typeof dispose !== "function")
            throw new TypeError("Object not disposable.");
        if (syncDispose) {
            dispose = function () {
                try {
                    syncDispose.call(this);
                } catch (e) {
                    return Promise.reject(e);
                }
            };
        }
        env.stack.push({ value: value, dispose: dispose, async: async });
    } else if (async) {
        env.stack.push({ async: true });
    }
    return value;
}

/**
 * __disposeResources - Disposes all resources on a disposal stack.
 */
export function __disposeResources(env) {
    var rec, flags;

    function fail(e) {
        env.error = env.hasError ? new SuppressedErrorPolyfill(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }

    function next() {
        while (rec = env.stack.pop()) {
            try {
                if (!rec.async && flags === 1) {
                    flags = 0;
                    env.stack.push(rec);
                    return Promise.resolve().then(next);
                }
                if (rec.dispose) {
                    var result = rec.dispose.call(rec.value);
                    if (rec.async) {
                        flags |= 2;
                        return Promise.resolve(result).then(next, function (e) {
                            fail(e);
                            return next();
                        });
                    }
                } else {
                    flags |= 1;
                }
            } catch (e) {
                fail(e);
            }
        }
        if (flags === 1)
            return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError)
            throw env.error;
    }

    flags = 0;
    return next();
}

/**
 * __rewriteRelativeImportExtension - Rewrites TypeScript import extensions to JavaScript.
 */
export function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (match, tsx, dts, ext, prefix) {
            return tsx ? (preserveJsx ? ".jsx" : ".js") : (!dts || (ext && prefix)) ? dts + ext + "." + prefix.toLowerCase() + "js" : match;
        });
    }
    return path;
}

/* -------------------------------------------------------------------------- */
/*  Default export - all helpers as a single object                           */
/* -------------------------------------------------------------------------- */

export default {
    __extends,
    __assign,
    __rest,
    __decorate,
    __param,
    __esDecorate,
    __runInitializers,
    __propKey,
    __setFunctionName,
    __metadata,
    __awaiter,
    __generator,
    __createBinding,
    __exportStar,
    __values,
    __read,
    __spread,
    __spreadArrays,
    __spreadArray,
    __await,
    __asyncGenerator,
    __asyncDelegator,
    __asyncValues,
    __makeTemplateObject,
    __importStar,
    __importDefault,
    __classPrivateFieldGet,
    __classPrivateFieldSet,
    __classPrivateFieldIn,
    __addDisposableResource,
    __disposeResources,
    __rewriteRelativeImportExtension
};
