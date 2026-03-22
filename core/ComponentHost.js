/**
 * Netflix Cadmium Player — Component Host
 *
 * Hosts a single isolated component within the Cadmium component system.
 * Extends the base component adapter ($Ca) to provide lifecycle management,
 * component creation, and cleanup for components that can exist outside
 * of a compound component hierarchy.
 *
 * Supports:
 * - Lazy component instantiation via `createComponent`
 * - Clean teardown with listener removal and event cleanup
 * - Manifest session data access via `getComponent`
 *
 * @module core/ComponentHost
 * @original Module_2710
 */

import { dataQuery } from '../modules/Module_27851.js'; // component data accessor
import { $Ca as BaseComponentAdapter } from '../modules/Module_56656.js'; // base class

/**
 * Hosts and manages a single component instance.
 *
 * @extends BaseComponentAdapter
 */
export class ComponentHost extends BaseComponentAdapter {
  /**
   * @param {object} manifestSessionData - Session data providing component
   *        definitions, playback params, and data context.
   */
  constructor(manifestSessionData) {
    super();
    /** @private */
    this.manifestSessionData = manifestSessionData;
    /**
     * The hosted component instance (created lazily).
     * @private
     * @type {object|undefined}
     */
    this.hostedComponent = undefined;
  }

  /**
   * Resolve a component by identifier from the manifest session data.
   *
   * @param {string} componentId - Component identifier.
   * @returns {*} Resolved component reference.
   */
  getComponent(componentId) {
    return this.manifestSessionData.fVa(componentId);
  }

  /**
   * Tear down the hosted component and release all resources.
   *
   * Removes all event listeners, invokes an optional pre-cleanup callback,
   * clears internal event bindings, and destroys the component instance.
   *
   * @param {Function} [preCleanupCallback] - Optional callback invoked
   *        after base cleanup but before event listener removal.
   */
  clearListeners(preCleanupCallback) {
    super.clearListeners();

    if (this.hostedComponent) {
      const componentData = dataQuery(this.hostedComponent);

      if (typeof preCleanupCallback === 'function') {
        preCleanupCallback();
      }

      componentData.internal_Jea = {};
      this.hostedComponent.events.removeAllListeners();
      this.hostedComponent = undefined;
    }
  }

  /**
   * Create and initialize the hosted component from a component definition.
   *
   * The component is created lazily — if already instantiated, the existing
   * instance is returned. Components with a `when` clause cannot be created
   * in isolation and will throw.
   *
   * @param {object} componentDef - Component definition.
   * @param {string} componentDef.name - Component name for logging/identification.
   * @param {Function} componentDef.zta - Component constructor.
   * @param {object} [componentDef.when] - Conditional instantiation clause (must be undefined).
   * @param {Array} [componentDef.tR] - Component dependencies.
   * @param {object} context - Execution context providing scoping and resolution.
   * @returns {object} The created (or cached) component instance.
   * @throws {Error} If componentDef is undefined (e.g., circular init dependency).
   * @throws {Error} If componentDef has a `when` clause (not supported in isolation).
   */
  createComponent(componentDef, context) {
    if (componentDef === undefined) {
      throw new Error(
        'An undefined component definition was provided. Did you attempt to create ' +
        'a nested component during `init()`? Consider deferring component creation ' +
        "to a later time in your component's lifecycle.",
      );
    }

    if (this.hostedComponent) {
      return this.hostedComponent;
    }

    if (componentDef.when) {
      throw new Error(
        `Component "${componentDef.name}" cannot both conditionally instantiate ` +
        'via a `when` clause and be created in isolation (outside of a compound component).',
      );
    }

    const component = new componentDef.zta({
      Ni: context.v0(componentDef.name),
      context,
      hE: () => context.tS(componentDef.name),
      pp: this.manifestSessionData.pp,
      data: this.manifestSessionData.data,
      name: componentDef.name,
      N$: '',
      ase_Apa: '',
      bufferTimeValue: this.manifestSessionData.bufferTimeValue,
      tR: componentDef.tR || [],
      random: this.manifestSessionData.random,
    });

    this.hostedComponent = component;

    const componentAccessor = dataQuery(component);
    if (typeof componentAccessor.data === 'function') {
      componentAccessor.data();
    }

    return component;
  }
}

export { ComponentHost as internal_Leb };
