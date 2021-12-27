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
import { PortService } from './port.service';

/**
 * PortService needs to be instantiated as soon as possible because it adds an event listener
 * that will accept the MessagePort for use with communicating back and forth.
 */
const portService = new PortService();

/**
 * Platform definition for WebWorker, it opts to leave out anything that is not needed for running without
 * the DOM
 */
export const platformWebWorker = createPlatformFactory(
  platformCore,
  'webWorker',
  [
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
      provide: PortService,
      useValue: portService,
    },
  ]
);

/**
 * This function is used in the library that will setup the custom Angular code to start up in the WebWorker.
 *
 * This function is used in place of where you would normally `platformBrowser().bootstrapModule(AppModule)` in the
 * main.ts file.
 *
 * `ngZone` is obviously unneeded as there is no monkey patching required when there is no DOM.
 * @param moduleType
 * @param compilerOptions
 */
export function bootstrapNgWebWorker<M>(
  moduleType: Type<M>,
  compilerOptions?: WebWorkerCompilerOptions
) {
  return platformWebWorker().bootstrapModule(moduleType, {
    ...(compilerOptions ?? {}),
    ngZone: 'noop',
  });
}
