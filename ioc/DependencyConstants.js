/**
 * @module DependencyConstants
 * @description Constants used by the IoC (Inversion of Control) dependency injection container.
 * Defines enumerations for binding scope, binding type, and injection target type.
 *
 * @original Module_5493
 */

/**
 * Lifecycle scope for a dependency binding.
 * @enum {string}
 */
export const BindingScope = Object.freeze({
  Request: 'Request',
  Singleton: 'Singleton',
  Transient: 'Transient',
});

/**
 * Type of value a binding provides.
 * @enum {string}
 */
export const BindingType = Object.freeze({
  ConstantValue: 'ConstantValue',
  Constructor: 'Constructor',
  DynamicValue: 'DynamicValue',
  Factory: 'Factory',
  Function: 'Function',
  Instance: 'Instance',
  Invalid: 'Invalid',
  Provider: 'Provider',
});

/**
 * Type of injection target.
 * @enum {string}
 */
export const TargetType = Object.freeze({
  ClassProperty: 'ClassProperty',
  ConstructorArgument: 'ConstructorArgument',
  Variable: 'Variable',
});
