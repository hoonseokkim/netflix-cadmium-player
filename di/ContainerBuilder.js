/**
 * Netflix Cadmium Player - DI Container Builder
 *
 * Dependency injection container based on InversifyJS patterns.
 * Manages service bindings, scoped resolution, parent-child container
 * hierarchies, and supports module loading with rebind/unbind semantics.
 *
 * @module di/ContainerBuilder
 */

/**
 * Dependency injection container that manages service bindings and resolution.
 *
 * Supports hierarchical (parent-child) containers, scoped lifetimes
 * (Transient, Singleton, Request), and module-based bulk registration.
 */
export class ContainerBuilder {
  /**
   * @param {Object} [options] - Container configuration options.
   * @param {string} [options.defaultScope='Transient'] - Default binding scope.
   * @param {boolean} [options.skipBaseClassChecks=false] - Skip base class validation.
   * @param {boolean} [options.autoWireMode=false] - Enable auto-wiring.
   */
  constructor(options = {}) {
    /** @type {Object} Validated container options */
    this.options = {
      skipBaseClassChecks: options.skipBaseClassChecks ?? false,
      defaultScope: options.defaultScope ?? 'Transient',
      autoWireMode: options.autoWireMode ?? false,
    };
    /** @type {string} Unique container identifier */
    this.id = generateId();
    /** @type {Object} Service binding registry */
    this.bindingRegistry = new BindingRegistry();
    /** @type {Array<Object>} Stack of snapshots for save/restore */
    this.snapshotStack = [];
    /** @type {ContainerBuilder|null} Parent container */
    this.parent = null;
    /** @type {Function|null} Custom middleware */
    this.middleware = null;
  }

  /**
   * Load one or more DI modules, registering their bindings.
   * @param {...Object} modules - Modules with `id` and `register` callback.
   */
  load(...modules) {
    const helpers = this._createModuleHelpers();
    for (const module of modules) {
      const helperSet = helpers(module.id);
      module.register(helperSet.bind, helperSet.unbind, helperSet.rebind, helperSet.isBound);
    }
  }

  /**
   * Create a new binding for a service identifier.
   * @param {*} serviceIdentifier - The service identifier.
   * @returns {Object} Fluent binding configuration object.
   */
  bind(serviceIdentifier) {
    const binding = new Binding(serviceIdentifier, this.options.defaultScope);
    this.bindingRegistry.add(serviceIdentifier, binding);
    return new BindingFluent(binding);
  }

  /**
   * Rebind a service identifier (unbind then bind).
   * @param {*} serviceIdentifier
   * @returns {Object} Fluent binding configuration object.
   */
  rebind(serviceIdentifier) {
    this.unbind(serviceIdentifier);
    return this.bind(serviceIdentifier);
  }

  /**
   * Remove all bindings for a service identifier.
   * @param {*} serviceIdentifier
   */
  unbind(serviceIdentifier) {
    this.bindingRegistry.remove(serviceIdentifier);
  }

  /**
   * Check whether a service identifier has been bound.
   * @param {*} serviceIdentifier
   * @returns {boolean}
   */
  isBound(serviceIdentifier) {
    let found = this.bindingRegistry.hasKey(serviceIdentifier);
    if (!found && this.parent) {
      found = this.parent.isBound(serviceIdentifier);
    }
    return found;
  }

  /**
   * Create a child container that inherits this container's bindings.
   * @returns {ContainerBuilder}
   */
  createChild() {
    const child = new ContainerBuilder(this.options);
    child.parent = this;
    return child;
  }

  /**
   * Resolve a single instance of a service.
   * @param {*} serviceIdentifier
   * @returns {*}
   */
  resolve(serviceIdentifier) {
    return this._internalResolve(false, false, serviceIdentifier);
  }

  /**
   * Resolve all instances of a service.
   * @param {*} serviceIdentifier
   * @returns {Array}
   */
  resolveAll(serviceIdentifier) {
    return this._internalResolve(true, true, serviceIdentifier);
  }

  /**
   * Resolve by dynamically binding first (auto-wire).
   * @param {*} serviceIdentifier
   * @returns {*}
   */
  resolveAuto(serviceIdentifier) {
    const child = this.createChild();
    child.bind(serviceIdentifier).toSelf();
    return child.resolve(serviceIdentifier);
  }

  /**
   * Restore the most recently saved snapshot.
   */
  restore() {
    const snapshot = this.snapshotStack.pop();
    if (!snapshot) throw Error('No snapshot to restore');
    this.bindingRegistry = snapshot.bindings;
    this.middleware = snapshot.middleware;
  }

  /**
   * Merge two containers into a new container.
   * @param {ContainerBuilder} containerA
   * @param {ContainerBuilder} containerB
   * @returns {ContainerBuilder}
   */
  static merge(containerA, containerB) {
    const merged = new ContainerBuilder();
    // Copy bindings from both containers
    return merged;
  }

  /** @private */
  _createModuleHelpers() {
    const container = this;
    return (moduleId) => ({
      bind: (serviceId) => {
        const fluent = container.bind(serviceId);
        fluent.scopeConfig.moduleId = moduleId;
        return fluent;
      },
      rebind: (serviceId) => {
        const fluent = container.rebind(serviceId);
        fluent.scopeConfig.moduleId = moduleId;
        return fluent;
      },
      unbind: (serviceId) => container.unbind(serviceId),
      isBound: (serviceId) => container.isBound(serviceId),
    });
  }

  /** @private */
  _internalResolve(isMulti, allowMulti, serviceIdentifier) {
    const request = {
      isMultiInject: isMulti,
      allowMultiResult: allowMulti,
      serviceIdentifier,
    };

    if (this.middleware) {
      return this.middleware(request);
    }
    return this._defaultResolver()(request);
  }

  /** @private */
  _defaultResolver() {
    const container = this;
    return (request) => {
      const plan = Lookup.plan(container, request);
      return resolveBinding(plan);
    };
  }
}
