import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Angular requires there to be an ErrorHandler provided. This is a minimal ErrorHandler that just logs
 * to the console but you could provide your own overtop by providing in the AppModule.
 */
@Injectable()
export class WebWorkerHandlerErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error(error);
  }
}

/**
 * Each Angular application requires an ApplicationRef to be able to start up. This is actually unused as
 * the bootstrap method should never actually be called (since there is no DOM)
 */
@Injectable()
export class WebWorkerApplicationRef {}
