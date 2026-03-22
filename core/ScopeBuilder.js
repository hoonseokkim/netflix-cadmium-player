/**
 * @file ScopeBuilder.js
 * @description Builder for dependency injection scope configuration. Creates scopes
 *   with different binding types: instance, factory, async factory, lazy, and aliases.
 * @module core/ScopeBuilder
 * @original Module_49825 (zZb)
 */

import { ScopeErrors } from '../core/ScopeErrors.js';     // Module 25640
import { BindingType } from '../core/BindingType.js';       // Module 5493 (eventTypeName)
import { ScopeBinding } from '../core/ScopeBinding.js';     // Module 61142 ($$a)
import { AsyncScopeBinding } from '../core/AsyncScopeBinding.js'; // Module 75714 (eP)

/**
 * Fluent builder for configuring dependency injection scope bindings.
 * Supports multiple binding strategies for resolving dependencies.
 */
export class ScopeBuilder {
    /**
     * @param {Object} scopeConfig - Mutable scope configuration object that gets
     *   populated by the builder methods
     */
    constructor(scopeConfig) {
        /** @type {Object} The scope configuration being built */
        this.scopeConfig = scopeConfig;
    }

    /**
     * Binds to a concrete instance (singleton within the scope).
     *
     * @param {*} instance - The instance to bind
     * @returns {ScopeBinding} The created scope binding
     */
    to(instance) {
        this.scopeConfig.type = BindingType.Instance;
        this.scopeConfig.$q = instance;
        return new ScopeBinding(this.scopeConfig);
    }

    /**
     * Binds using the scope's default factory (ti property on config).
     * Throws if the factory is not a function.
     */
    bindToDefaultFactory() {
        if (typeof this.scopeConfig.ti !== 'function') {
            throw Error('' + ScopeErrors.T1b);
        }
        this.to(this.scopeConfig.ti);
    }

    /**
     * Binds to an async factory that resolves the dependency asynchronously.
     *
     * @param {Function} factory - Async factory function
     */
    initializeAsync(factory) {
        this.scopeConfig.type = BindingType.abb;
        this.scopeConfig.cache = factory;
        this.scopeConfig.w_ = null;
        this.scopeConfig.$q = null;
        new AsyncScopeBinding(this.scopeConfig);
    }

    /**
     * Binds to a deferred factory that is resolved on first access.
     *
     * @param {Function} deferredFactory - Factory function invoked lazily
     * @returns {ScopeBinding} The created scope binding
     */
    DO(deferredFactory) {
        this.scopeConfig.type = BindingType.internal_Ybb;
        this.scopeConfig.cache = null;
        this.scopeConfig.w_ = deferredFactory;
        this.scopeConfig.$q = null;
        return new ScopeBinding(this.scopeConfig);
    }

    /**
     * Binds to a provider function (resolved on each access).
     *
     * @param {Function} provider - Provider function
     */
    bindToProvider(provider) {
        this.scopeConfig.type = BindingType.bbb;
        this.scopeConfig.$q = provider;
        new AsyncScopeBinding(this.scopeConfig);
    }

    /**
     * Binds to an alias that delegates to another scope entry.
     *
     * @param {*} aliasTarget - The target binding to alias
     */
    gg(aliasTarget) {
        this.scopeConfig.type = BindingType.eFa;
        this.scopeConfig.audioMediaTypeId = aliasTarget;
        new AsyncScopeBinding(this.scopeConfig);
    }

    /**
     * Binds to an async factory with validation (must be a function).
     *
     * @param {Function} factory - Async factory function
     * @throws {Error} If factory is not a function
     */
    bindToValidatedAsyncFactory(factory) {
        if (typeof factory !== 'function') {
            throw Error(ScopeErrors.R1b);
        }
        this.initializeAsync(factory);
        this.scopeConfig.type = BindingType.Function;
    }

    /**
     * Binds to a config-changed event listener that resolves from config.
     *
     * @param {string} configKey - Configuration key to observe
     */
    bindToConfig(configKey) {
        this.scopeConfig.type = BindingType.eFa;
        this.scopeConfig.audioMediaTypeId = function (scope) {
            return function () {
                return scope.onConfigChanged.key(configKey);
            };
        };
        new AsyncScopeBinding(this.scopeConfig);
    }

    /**
     * Binds to a multi-provider (array of values).
     *
     * @param {*} multiValue - Array or collection to bind
     */
    bindToMulti(multiValue) {
        this.scopeConfig.type = BindingType.pkb;
        this.scopeConfig.IU = multiValue;
        new AsyncScopeBinding(this.scopeConfig);
    }

    /**
     * Binds to a deferred config-changed listener.
     *
     * @param {string} configKey - Configuration key to observe
     */
    bindToDeferredConfig(configKey) {
        this.DO(function (scope) {
            return scope.onConfigChanged.key(configKey);
        });
    }
}

export default ScopeBuilder;
