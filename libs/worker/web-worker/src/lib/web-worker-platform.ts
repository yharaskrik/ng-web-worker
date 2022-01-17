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
  COMMUNICATOR,
  MessageEventStream,
  NgInWorkerConfig,
  NG_WEB_WORKER_CONFIG,
  WORKER_ID,
} from '@ng-web-worker/worker/core';
import { BroadcastChannelCommunicator } from './communication/broadcast-channel-communicator';
import { WebWorkerCompilerOptions } from './compiler-options';
import {
  WebHandlerErrorHandler,
  WebWorkerApplicationRef,
} from './platform-providers';

let ngInWorkerConfig: NgInWorkerConfig;

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
export const platformWebWorkerFactory = (config: NgInWorkerConfig) => {
  return createPlatformFactory(platformCore, 'webWorker', [
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
    {
      provide: NG_WEB_WORKER_CONFIG,
      useValue: config,
    },
    {
      provide: WORKER_ID,
      useValue: config.workerId,
    },
    {
      provide: MessageEventStream,
      useValue: new MessageEventStream(),
    },
    {
      provide: COMMUNICATOR,
      useFactory: (
        ngInWorkerConfig: NgInWorkerConfig,
        messageEventStream: MessageEventStream
      ) =>
        new BroadcastChannelCommunicator(ngInWorkerConfig, messageEventStream),
      deps: [NG_WEB_WORKER_CONFIG, MessageEventStream],
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
