/**
 * @module PboServiceBinding
 * @description IoC container binding that registers the PBO (Playback Orchestration) service
 * in singleton scope using the dependency injection framework.
 *
 * @original Module_36149
 */

/**
 * Container module binding the PBO service implementation.
 */
export const PboServiceBinding = new ContainerModule((bind) => {
  bind(PboServiceToken).to(PboServiceImpl).inSingletonScope();
});
