/**
 * Property Alias Mapper
 *
 * Injectable service that recursively traverses manifest/response objects
 * and creates property aliases so that both camelCase and snake_case names
 * resolve to the same value. Uses Object.defineProperty with get/set
 * accessors to avoid data duplication.
 *
 * Supports nested traversal with array and wildcard ("*") path matching.
 *
 * @module PropertyAliasMapper
 * @source Module_2010
 */
export default function PropertyAliasMapper(module, exports, require) {
    var tslib, inversify, AliasConfigModule;

    function PropertyAliasMapperClass() {}

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TEa = void 0;

    tslib = require(22970);
    inversify = require(22674);
    AliasConfigModule = require(90030);

    /**
     * Recursively applies property aliases to an object based on
     * a mapping configuration.
     *
     * @param {Object} target - The object to add aliases to
     * @param {Object} aliasMap - Mapping of {aliasName: canonicalName} or
     *   {aliasName: [canonicalName, nestedAliasMap]} for recursive traversal
     */
    PropertyAliasMapperClass.prototype.Q_ = function applyAliases(target, aliasMap) {
        var self = this;

        if (!target) return;

        Object.entries(aliasMap).forEach(function (entry) {
            var aliasName, mappingValue, iter, canonicalName, nestedMap, targetValue;

            iter = Fa(entry);
            aliasName = iter.next().value;
            mappingValue = iter.next().value;

            if (self.isNestedMapping(mappingValue)) {
                // Nested mapping: [canonicalName, nestedAliasMap]
                var innerIter = Fa(mappingValue);
                canonicalName = innerIter.next().value;
                nestedMap = innerIter.next().value;

                targetValue = target[canonicalName];

                if (Array.isArray(targetValue)) {
                    // Array: alias the property, then recurse into each element
                    self.defineAlias(target, aliasName, canonicalName);
                    targetValue.forEach(function (item) {
                        self.Q_(item, nestedMap);
                    });
                } else if (canonicalName === AliasConfigModule.anyPlaceholder) {
                    // Wildcard "*": recurse into all values of the object
                    Object.values(target).forEach(function (item) {
                        self.Q_(item, nestedMap);
                    });
                } else {
                    // Object: alias the property, then recurse if it's an object
                    self.defineAlias(target, aliasName, canonicalName);
                    if ("object" === typeof targetValue) {
                        self.Q_(targetValue, nestedMap);
                    }
                }
            } else {
                // Simple mapping: aliasName -> canonicalName
                self.defineAlias(target, aliasName, mappingValue);
            }
        });
    };

    /**
     * Checks whether a mapping value is a nested mapping (array format).
     * @private
     */
    PropertyAliasMapperClass.prototype.isNestedMapping = function (value) {
        return Array.isArray(value);
    };

    /**
     * Defines a property alias on an object using get/set accessors.
     * Only creates the alias if the alias name differs from the canonical
     * name and the alias doesn't already exist on the object.
     *
     * @param {Object} obj - Target object
     * @param {string} aliasName - The alias property name
     * @param {string} canonicalName - The canonical property name to proxy to
     */
    PropertyAliasMapperClass.prototype.defineAlias = function (obj, aliasName, canonicalName) {
        if (!obj.hasOwnProperty(aliasName) && aliasName !== canonicalName) {
            Object.defineProperty(obj, aliasName, {
                get: function () {
                    return obj[canonicalName];
                },
                set: function (value) {
                    return obj[canonicalName] = value;
                },
                enumerable: true
            });
        }
    };

    var ExportedClass = PropertyAliasMapperClass;
    exports.TEa = ExportedClass;
    exports.TEa = ExportedClass = tslib.__decorate([
        (0, inversify.injectable)()
    ], ExportedClass);
}
