import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  COMMUNICATOR,
  MessageEventStream,
  WORKER_ID,
} from '@ng-web-worker/worker/core';
import { nanoid } from 'nanoid';
import { MainThreadCommunicator } from './main-thread.communicator';
import { NG_IN_WORKER_REGISTRY_CONFIG } from './tokens';
import { NgInWorkerRegistryConfig } from './types';
import { WebWorkerRegistry } from './web-worker-registry';

@NgModule()
export class NgInWorkerModule {
  static forRoot(
    config: Omit<NgInWorkerRegistryConfig, 'instanceId'>
  ): ModuleWithProviders<NgInWorkerModule> {
    const instanceId = nanoid(5);

    return {
      ngModule: NgInWorkerModule,
      providers: [
        {
          provide: COMMUNICATOR,
          useClass: MainThreadCommunicator,
        },
        WebWorkerRegistry,
        MessageEventStream,
        {
          provide: NG_IN_WORKER_REGISTRY_CONFIG,
          useValue: { ...config, instanceId },
        },
        {
          provide: WORKER_ID,
          useValue: 'main',
        },
      ],
    };
  }
}
