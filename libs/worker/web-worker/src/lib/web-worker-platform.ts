import {
  ApplicationInitStatus,
  ApplicationRef,
  APP_INITIALIZER,
  CompilerFactory,
  COMPILER_OPTIONS,
  createPlatformFactory,
  ErrorHandler,
  Optional,
  platformCore,
  Type,
} from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import {
  BROADCAST_CHANNEL,
  COMMUNICATOR,
  Logger,
  MessageEventStream,
  NG_IN_WORKER_CONFIG,
  WorkerConfig,
  WORKER_ID,
} from '@ng-web-worker/worker/core';
import { createBroadcastChannel } from '../../../core/src/lib/broadcast-channel';
import { BroadcastChannelCommunicator } from './communication/broadcast-channel-communicator';
import { WebWorkerCompilerOptions } from './compiler-options';
import {
  WebHandlerErrorHandler,
  WebWorkerApplicationRef,
} from './platform-providers';

let ngInWorkerConfig: WorkerConfig;

try {
  if (!self.name) {
    throw new Error();
  }

  ngInWorkerConfig = JSON.parse(self.name);

  if (ngInWorkerConfig == null) {
    throw new Error();
  }
} catch (e) {
  throw new Error(
    `No configuration or no valid configuration passed into WebWorker.`
  );
}

/**
 * Platform definition for WebWorker, it opts to leave out anything that is not needed for running without
 * the DOM
 */
export const platformWebWorkerFactory = (config: WorkerConfig) => {
  return createPlatformFactory(platformCore, 'webWorker', [
    {
      provide: NG_IN_WORKER_CONFIG,
      useValue: config,
    },
    {
      provide: WORKER_ID,
      useValue: config.workerId,
    },
    {
      provide: MessageEventStream,
      useClass: MessageEventStream,
    },
    {
      provide: BROADCAST_CHANNEL,
      useValue: createBroadcastChannel(config.instanceId, config.share),
    },
    {
      provide: COMMUNICATOR,
      useFactory: (
        ngInWorkerConfig: WorkerConfig,
        messageEventStream: MessageEventStream,
        broadcastChannel: BroadcastChannel
      ) =>
        new BroadcastChannelCommunicator(
          ngInWorkerConfig,
          messageEventStream,
          broadcastChannel
        ),
      deps: [NG_IN_WORKER_CONFIG, MessageEventStream, BROADCAST_CHANNEL],
    },
    {
      provide: Logger,
      useClass: Logger,
    },
    /**
     * Required providers to be able to bootstrap an Angular application
     */
    {
      provide: ErrorHandler,
      useClass: WebHandlerErrorHandler,
    },
    {
      provide: ApplicationInitStatus,
      useClass: ApplicationInitStatus,
      deps: [[new Optional(), APP_INITIALIZER]],
    },
    {
      provide: ApplicationRef,
      useClass: WebWorkerApplicationRef,
    },
    /**
     * Compiler options will not be used when built using AOT as the JitCompiler is not included in the bundle.
     *
     * This is why we cannot include this library in the web worker normally and instead have to compile it first
     * using full AOT Ivy instructions.
     */
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
  ]);
};

/**
 * This function is used in the library that will setup the custom Angular code to start up in the WebWorker.
 *
 * This function is used in place of where you would normally `platformBrowser().bootstrapModule(AppModule)` in the
 * main.ts file.
 *
 * `ngZone` is obviously unneeded as there is no monkey patching required when there is no DOM.
 * @param moduleType
 * @param config
 * @param compilerOptions
 */
export function bootstrapNgWebWorker<M>(
  moduleType: Type<M>,
  compilerOptions?: WebWorkerCompilerOptions
) {
  const platformWebWorker = platformWebWorkerFactory(ngInWorkerConfig);

  return platformWebWorker().bootstrapModule(moduleType, {
    ...(compilerOptions ?? {}),
    ngZone: 'noop',
  });
}
