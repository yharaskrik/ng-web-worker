import {
  APP_INITIALIZER,
  ApplicationInitStatus,
  ApplicationRef,
  COMPILER_OPTIONS,
  CompilerFactory,
  createPlatformFactory,
  ErrorHandler,
  Optional,
  platformCore,
  Type,
} from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import {
  WebHandlerErrorHandler,
  WebWorkerApplicationRef,
} from './platform-providers';
import { WebWorkerCompilerOptions } from './compiler-options';
import { NG_WEB_WORKER_CONFIG, NG_WORKER_ID } from './tokens';

import { NgInWorkerConfig } from '@ng-web-worker/worker';
import { MessageChannelCommunicator } from './communication/message-channel-communicator';
import { BroadcastChannelCommunicator } from './communication/broadcast-channel-communicator';
import { COMMUNICATOR, MessageEventStream } from '@ng-web-worker/worker/core';

const workerId = (Math.random() + 1).toString(36).substring(7);

/**
 * Platform definition for WebWorker, it opts to leave out anything that is not needed for running without
 * the DOM
 */
export const platformWebWorkerFactory = (config: NgInWorkerConfig) => {
  const messageEventStream = new MessageEventStream();
  /*
   * The Communicator needs to be instantiated as soon as possible because it
   *
   * In the case of MessageChannelCommunicator:
   * Adds an event listener that will accept the MessagePort for use with communicating back and forth.
   *
   * In the case of BroadcastChannel:
   * It does not matter too much as there is no initial transfer of ports.
   */
  const communicator = config.broadcast
    ? new BroadcastChannelCommunicator(workerId, messageEventStream)
    : new MessageChannelCommunicator(workerId, messageEventStream);

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
      provide: COMMUNICATOR,
      useValue: communicator,
    },
    {
      provide: NG_WORKER_ID,
      useValue: workerId,
    },
    {
      provide: MessageEventStream,
      useValue: messageEventStream,
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
  config: NgInWorkerConfig,
  compilerOptions?: WebWorkerCompilerOptions
) {
  const platformWebWorker = platformWebWorkerFactory(config);

  return platformWebWorker().bootstrapModule(moduleType, {
    ...(compilerOptions ?? {}),
    ngZone: 'noop',
  });
}
