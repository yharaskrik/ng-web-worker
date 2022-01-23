import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  BROADCAST_CHANNEL,
  COMMUNICATOR,
  createBroadcastChannel,
  Logger,
  MessageEventStream,
  NG_IN_WORKER_CONFIG,
  WorkerConfig,
  WORKER_ID,
} from '@ng-web-worker/worker/core';
import { nanoid } from 'nanoid';
import { MainThreadCommunicator } from './main-thread.communicator';
import { INITIALIZE_WORKERS, WORKERS } from './tokens';
import { defaultNgInWorkerConfig, NgInWorkerConfig } from './types';
import { WebWorkerRegistry } from './web-worker-registry';

@NgModule()
export class NgInWorkerModule {
  static forRoot(
    rootConfig: Omit<NgInWorkerConfig, 'instanceId'>
  ): ModuleWithProviders<NgInWorkerModule> {
    const instanceId = nanoid(5);

    const config = { ...defaultNgInWorkerConfig, ...rootConfig, instanceId };

    const workerConfig: WorkerConfig = {
      share: config.share,
      instanceId,
      workerId: 'main',
      debug: !!config.debug,
    };

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
          provide: NG_IN_WORKER_CONFIG,
          useValue: workerConfig,
        },
        {
          provide: WORKERS,
          useValue: config.workers ?? [],
        },
        {
          provide: WORKER_ID,
          useValue: 'main',
        },
        {
          provide: INITIALIZE_WORKERS,
          useValue: !!config.initializeWorkers,
        },
        {
          provide: BROADCAST_CHANNEL,
          useValue: createBroadcastChannel(config.instanceId, config.share),
        },
        Logger,
      ],
    };
  }
}
