/**
 * Disposable List IoC Binding
 *
 * A simple IoC (Inversion of Control) container binding module that
 * registers the disposable-list component key (`vk`) to its
 * implementation (`SCa`) in singleton scope.
 *
 * @module DisposableListBinding
 * @source Module_87284
 */

import { readFloat32 as ContainerModule } from '../ioc/ComponentDependencyResolver';
import { SCa as DisposableListImpl } from '../core/CompoundComponent';
import { vk as DisposableListKey } from '../symbols/LogBatcherSymbols';

export const disposableListBinding = new ContainerModule(function (bind) {
    bind(DisposableListKey).to(DisposableListImpl).sa();
});

export { disposableListBinding as ksb };
