/**
 * @file ScopeConfigBuilder - IoC container scope configuration builder
 * @module ioc/ScopeConfigBuilder
 * @description Provides a fluent builder for configuring dependency injection
 * scope bindings. Supports binding to instances, factories, async factories,
 * constants, decorators, and config-key-based providers within the Netflix
 * Cadmium player's IoC container.
 *
 * @original Module_49825
 *
 * @dependencies
 *   Module 25640 - Error message constants
 *   Module 5493  - EventTypeName enum (binding types)
 *   Module 61142 - ScopeBinding ($$a)
 *   Module 75714 - EagerScopeBinding (eP)
 */

// import { ErrorMessages } from '../core/ErrorMessages';
// import { EventTypeName } from '../ioc/EventTypeName';
// import { ScopeBinding } from '../ioc/ScopeBinding';
// import { EagerScopeBinding } from '../ioc/EagerScopeBinding';

/**
 * Fluent builder for configuring IoC scope bindings.
 *
 * @class ScopeConfigBuilder
 * @example
 *   builder.toInstance(MyService);
 *   builder.toFactory(createService);
 *   builder.toConstant(42);
 */
export class ScopeConfigBuilder {
    /**
     * @param {Object} scopeConfig - The mutable scope configuration object
     */
    constructor(scopeConfig) {
        /** @type {Object} The scope configuration being built */
        this.scopeConfig = scopeConfig;
    }

    /**
     * Binds the scope to an instance constructor/class.
     *
     * @param {Function} instanceClass - The class or constructor to instantiate
     * @returns {ScopeBinding} The created scope binding
     */
    toInstance(instanceClass) {
        this.scopeConfig.type = 'Instance'; // EventTypeName.Instance
        this.scopeConfig.$q = instanceClass;
        return new ScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope to a self-referencing instance (the type itself).
     * Throws if the configured type is not a function/constructor.
     */
    toSelf() {
        if (typeof this.scopeConfig.ti !== 'function') {
            throw new Error('Cannot bind toSelf: type is not a constructor');
        }
        this.toInstance(this.scopeConfig.ti);
    }

    /**
     * Binds the scope to an async factory function.
     *
     * @param {Function} factory - The async factory function
     */
    toAsyncFactory(factory) {
        this.scopeConfig.type = 'AsyncFactory'; // EventTypeName.abb
        this.scopeConfig.cache = factory;
        this.scopeConfig.w_ = null;
        this.scopeConfig.$q = null;
        new EagerScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope to a dynamic value provider.
     *
     * @param {Function} provider - The value provider function
     * @returns {ScopeBinding} The created scope binding
     */
    toDynamicValue(provider) {
        this.scopeConfig.type = 'DynamicValue'; // EventTypeName.internal_Ybb
        this.scopeConfig.cache = null;
        this.scopeConfig.w_ = provider;
        this.scopeConfig.$q = null;
        return new ScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope to a constant value.
     *
     * @param {*} value - The constant value
     */
    toConstantValue(value) {
        this.scopeConfig.type = 'ConstantValue'; // EventTypeName.bbb
        this.scopeConfig.$q = value;
        new EagerScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope to a service identified by media type ID.
     *
     * @param {*} mediaTypeId - The media type identifier
     */
    toService(mediaTypeId) {
        this.scopeConfig.type = 'Service'; // EventTypeName.eFa
        this.scopeConfig.audioMediaTypeId = mediaTypeId;
        new EagerScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope to a factory function.
     * Throws if the argument is not a function.
     *
     * @param {Function} factory - The factory function
     */
    toFactory(factory) {
        if (typeof factory !== 'function') {
            throw new Error('Factory must be a function');
        }
        this.toAsyncFactory(factory);
        this.scopeConfig.type = 'Function'; // EventTypeName.Function
    }

    /**
     * Binds the scope to a service resolved via config key.
     *
     * @param {string} configKey - The configuration key
     */
    toServiceByConfigKey(configKey) {
        this.scopeConfig.type = 'Service'; // EventTypeName.eFa
        this.scopeConfig.audioMediaTypeId = function (context) {
            return function () {
                return context.onConfigChanged.key(configKey);
            };
        };
        new EagerScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope as an auto-named binding.
     *
     * @param {*} name - The auto-binding name
     */
    toAutoNamed(name) {
        this.scopeConfig.type = 'AutoNamed'; // EventTypeName.pkb
        this.scopeConfig.IU = name;
        new EagerScopeBinding(this.scopeConfig);
    }

    /**
     * Binds the scope to a dynamic value resolved via config key.
     *
     * @param {string} configKey - The configuration key
     */
    toDynamicValueByConfigKey(configKey) {
        this.toDynamicValue(function (context) {
            return context.onConfigChanged.key(configKey);
        });
    }
}
