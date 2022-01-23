import {
  Inject,
  Injector,
  ModuleWithProviders,
  NgModule,
  Type,
} from '@angular/core';
import {
  FEATURE_WORKER_SERVICES,
  ROOT_WORKER_SERVICES,
  _FEATURE_WORKER_SERVICES,
  _ROOT_WORKER_SERVICES,
} from './worker-service.tokens';

/**
 * Use the Angular Injector to instantiate the services, since there is no View layer inside the WebWorker
 * we do not have any Components to inject these services into so to avoid having to inject each one into the constructor
 * of some module and then never use them there the services can be instantiated through the WorkerServiceModule
 * so they just "work". This helps when these services have an observable that needs to emit and then send a message
 * to the other workers using the `postEvent` operator.
 *
 * Thanks to the NgRx team for this idea, inspiration pulled from our @ngrx/effects instantiates the Effects classes
 * @param injector
 * @param services
 */
export function createWorkerServices(
  injector: Injector,
  services: Type<any>[][]
): any[] {
  return services.flat().map((service) => injector.get(service));
}

@NgModule()
export class WorkerServicesRootModule {
  constructor(@Inject(ROOT_WORKER_SERVICES) rootServices: any[]) {}
}

@NgModule()
export class WorkerServicesFeatureModule {
  constructor(@Inject(FEATURE_WORKER_SERVICES) rootServices: any[]) {}
}

@NgModule()
export class WorkerServicesModule {
  static forRoot(
    services: Type<any>[]
  ): ModuleWithProviders<WorkerServicesModule> {
    return {
      ngModule: WorkerServicesRootModule,
      providers: [
        services,
        {
          provide: _ROOT_WORKER_SERVICES,
          useValue: [services],
        },
        {
          provide: ROOT_WORKER_SERVICES,
          useFactory: createWorkerServices,
          deps: [Injector, _ROOT_WORKER_SERVICES],
        },
      ],
    };
  }

  static forFeature(
    services: Type<any>[]
  ): ModuleWithProviders<WorkerServicesFeatureModule> {
    return {
      ngModule: WorkerServicesFeatureModule,
      providers: [
        services,
        {
          provide: _FEATURE_WORKER_SERVICES,
          useValue: services,
          multi: true,
        },
        {
          provide: FEATURE_WORKER_SERVICES,
          useFactory: createWorkerServices,
          deps: [Injector, _FEATURE_WORKER_SERVICES],
        },
      ],
    };
  }
}
