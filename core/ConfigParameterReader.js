/**
 * ConfigParameterReader - Type-safe configuration parameter parser
 *
 * Injectable service that reads and validates configuration parameters
 * from query strings or JSON data, supporting types: int, uint, bool,
 * float, string, object, and arrays of those types.
 *
 * Uses dependency injection (inversify) for the validator and data source.
 *
 * @module core/ConfigParameterReader
 * @original Module_58421
 */

// import { __decorate, __param } from 'tslib';
// import { buildTransportPacket } from '../utils/transportPacket';
// import { injectable, inject } from 'inversify';
// import { InvalidConfigValue } from '../types/InvalidConfigValue';

/**
 * Reads and validates typed configuration parameters.
 *
 * @injectable
 */
export class ConfigParameterReader {
    /**
     * @param {Object} validator - Validation service for config values
     * @param {Object} dataSource - Data source for object deserialization
     */
    constructor(validator, dataSource) {
        this.validator = validator;
        this.dataSource = dataSource;
        // buildTransportPacket(this, "json");
    }

    /**
     * Reads an integer parameter.
     *
     * @param {string} value - Raw string value
     * @returns {number|InvalidConfigValue} Parsed integer or invalid marker
     */
    readInt(value) {
        return ConfigParameterReader.read(
            value,
            (v) => parseInt(v),
            (v) => this.validator.VOa(v)
        );
    }

    /**
     * Reads a boolean parameter.
     *
     * @param {string} value - Raw string value ("true" or "false")
     * @returns {boolean|InvalidConfigValue} Parsed boolean or invalid marker
     */
    readBool(value) {
        return ConfigParameterReader.read(
            value,
            (v) => (v == "true" ? true : v == "false" ? false : undefined),
            (v) => this.validator.internal_Fna(v)
        );
    }

    /**
     * Reads an unsigned integer parameter.
     *
     * @param {string} value - Raw string value
     * @returns {number|InvalidConfigValue} Parsed unsigned int or invalid marker
     */
    readUint(value) {
        return ConfigParameterReader.read(
            value,
            (v) => parseInt(v),
            (v) => this.validator.O9(v)
        );
    }

    /**
     * Reads a float parameter.
     *
     * @param {string} value - Raw string value
     * @returns {number|InvalidConfigValue} Parsed float or invalid marker
     */
    readFloat(value) {
        return ConfigParameterReader.read(
            value,
            (v) => parseFloat(v),
            (v) => this.validator.mapTransform(v)
        );
    }

    /**
     * Reads an enum parameter by reverse-mapping a string to its numeric key.
     *
     * @param {string} value - Raw string value
     * @param {Object} enumObj - Enum-like object mapping numbers to strings
     * @returns {number|InvalidConfigValue} Enum numeric value or invalid marker
     */
    readEnum(value, enumObj) {
        return ConfigParameterReader.read(
            value,
            (v) => ConfigParameterReader.reverseEnumLookup(v, enumObj),
            (v) => v !== undefined
        );
    }

    /**
     * Reads a string parameter with optional regex validation.
     *
     * @param {string} value - Raw string value
     * @param {RegExp} [pattern] - Optional validation regex
     * @returns {string|InvalidConfigValue} Validated string or invalid marker
     */
    readString(value, pattern) {
        return ConfigParameterReader.read(
            value,
            (v) => v,
            (v) => (pattern ? pattern.test(v) : true)
        );
    }

    /**
     * Reads a JSON object parameter.
     *
     * @param {string} value - URI-encoded JSON string
     * @returns {Object|InvalidConfigValue} Parsed object or invalid marker
     */
    readObject(value) {
        try {
            return ConfigParameterReader.read(
                value,
                (v) => this.dataSource.videoSampleEntry(decodeURIComponent(v)),
                (v) => this.validator.N9(v)
            );
        } catch (e) {
            return new InvalidConfigValue();
        }
    }

    /**
     * Reads an array parameter (values enclosed in brackets, comma-separated).
     *
     * @param {string} value - Raw string like "[1,2,3]"
     * @param {string|Function} typeOrParser - Type name ("int","float",etc) or parser function
     * @param {number} [depth=1] - Nesting depth for multi-dimensional arrays
     * @returns {Array|InvalidConfigValue} Parsed array or invalid marker
     */
    readArray(value, typeOrParser, depth = 1) {
        value = value.trim();
        const parser = typeOrParser instanceof Function
            ? typeOrParser
            : this.createArrayItemParser(typeOrParser, depth);

        const openBracket = value.indexOf("[");
        const closeBracket = value.lastIndexOf("]");

        if (openBracket !== 0 || closeBracket !== value.length - 1) {
            return new InvalidConfigValue();
        }

        const inner = value.substring(openBracket + 1, closeBracket);

        try {
            return ConfigParameterReader.splitArrayString(inner).map((item) => {
                const result = parser(this, ConfigParameterReader.unquote(item));
                if (result instanceof InvalidConfigValue) throw result;
                return result;
            });
        } catch (e) {
            return e instanceof InvalidConfigValue ? e : new InvalidConfigValue();
        }
    }

    /**
     * Creates a parser function for array items of a given type.
     * @private
     */
    createArrayItemParser(typeName, depth = 1) {
        return (reader, value) => {
            const parser = ConfigParameterReader.getTypeParser(typeName);
            return depth > 1 ? reader.readArray(value, typeName, depth - 1) : parser(reader, value);
        };
    }

    // ─── Static Helpers ──────────────────────────────────────────────

    /**
     * Reverse lookup: finds the numeric key for a string value in an enum.
     * @static
     */
    static reverseEnumLookup(value, enumObj) {
        for (const key in enumObj) {
            const numKey = parseInt(key);
            if (enumObj[numKey] === value) return numKey;
        }
    }

    /**
     * Reads a value: parses it, then validates it.
     * @static
     * @param {string} raw - Raw string
     * @param {Function} parser - Parsing function
     * @param {Function} validator - Validation function
     * @returns {*|InvalidConfigValue}
     */
    static read(raw, parser, validator) {
        const parsed = parser(raw);
        return parsed !== undefined && validator(parsed) ? parsed : new InvalidConfigValue();
    }

    /**
     * Returns the appropriate parser function for a type name.
     * @static
     * @param {string} typeName - "int", "bool", "uint", "float", "string", or "object"
     * @returns {Function}
     */
    static getTypeParser(typeName) {
        switch (typeName) {
            case "int":    return (r, v) => r.readInt(v);
            case "bool":   return (r, v) => r.readBool(v);
            case "uint":   return (r, v) => r.readUint(v);
            case "float":  return (r, v) => r.readFloat(v);
            case "string": return (r, v) => r.readString(v);
            case "object": return (r, v) => r.readObject(v);
        }
    }

    /**
     * Splits a comma-separated array string, respecting nested brackets.
     * @static
     * @param {string} str - Inner string (without outer brackets)
     * @returns {string[]}
     */
    static splitArrayString(str) {
        const bracketPairs = [["[", "]"]];
        const items = [];
        let start = 0;
        let depth = 0;
        const stack = [];

        for (let i = 0; i < str.length; i++) {
            const ch = str.charAt(i);
            if (ch === "," && depth === 0) {
                items.push(str.substr(start, i - start));
                start = i + 1;
            } else {
                const opening = bracketPairs.find((pair) => pair[0] === ch);
                if (opening) {
                    depth++;
                    stack.push(opening);
                } else if (stack.length > 0 && stack[stack.length - 1][1] === ch) {
                    depth--;
                    stack.pop();
                }
            }
        }

        if (start !== i) {
            items.push(str.substr(start, i - start));
        } else if (start === i && start > 0) {
            throw new InvalidConfigValue();
        }

        return items;
    }

    /**
     * Removes surrounding quotes from a string value.
     * @static
     * @param {string} value
     * @returns {string}
     */
    static unquote(value) {
        const first = value.charAt(0);
        if (first === '"' || first === "'") {
            if (value.charAt(value.length - 1) !== first) {
                throw new InvalidConfigValue();
            }
            return value.substring(1, value.length - 1);
        }
        return value;
    }
}
