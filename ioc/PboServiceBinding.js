/**
 * @module PboServiceBinding
 * @description IoC container binding that registers the PBO (Playback Orchestration) service
 * in singleton scope using the dependency injection framework.
 *
 * @original Module_36149
 */

// import { ContainerModule } from 'inversify'; // Module 22674
// import { PboServiceToken } from '...';       // Module 58872
// import { PboServiceImpl } from '...';        // Module 52357

/**
 * Container module binding the PBO service implementation.
 */
export const PboServiceBinding = new ContainerModule((bind) => {
  bind(PboServiceToken).to(PboServiceImpl).inSingletonScope();
});
