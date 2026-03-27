/**
 * Netflix Cadmium Player — Component Definition Factory
 *
 * Creates component definitions used by the player's plugin/component
 * registration system.  Wraps a data query with a component type marker
 * and a factory function for instantiation.
 *
 * @module ComponentDefinitionFactory
 */

// Dependencies
// import { context } from './modules/Module_39090';                   // global context
// import { dataQuery as createDataQuery } from './modules/Module_27851';  // data query builder
// import { instantiateComponent as instantiateComponent } from './modules/Module_3359';  // component instantiator

/**
 * Creates a component definition descriptor.
 *
 * The returned object extends the base data query with a `type` of
 * "COMPONENT" and a factory (`gwb`) for instantiating the component
 * at runtime.
 *
 * @param {object} params - Component definition parameters.
 * @param {string} params.zta   - Component type/category.
 * @param {string} params.name  - Component name.
 * @param {*} params.yF         - Component feature flag/identifier.
 * @param {*} params.tR         - Component target reference.
 * @param {object} params.config - Component configuration.
 * @param {*} params.when       - Conditional activation predicate.
 * @returns {object} A component definition with type, data query, and factory.
 */
export function createComponentDefinition({ zta, name, yF, tR, config, when }) {
  const query = createDataQuery({
    yF,
    tR,
    name,
    zta,
    config,
    data: {},
    when,
  });

  return {
    ...query,
    type: "COMPONENT",
    wE: false,

    /**
     * Factory function that instantiates the component.
     * @param {object} params - Instantiation parameters.
     * @returns {object} The instantiated component.
     */
    gwb(params) {
      return instantiateComponent(
        { context, ...params },
        query,
        params.i3,
      );
    },
  };
}
