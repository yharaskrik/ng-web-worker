import { ComponentRef, ErrorHandler, Injectable } from '@angular/core';
import { of } from 'rxjs';

/**
 * Angular requires there to be an ErrorHandler provided. This is a minimal ErrorHandler that just logs
 * to the console but you could provide your own overtop by providing in the AppModule.
 */
@Injectable()
export class WebHandlerErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error(error);
  }
}

/**
 * Each Angular application requires an ApplicationRef to be able to start up. This is actually unused as
 * the bootstrap method should never actually be called (since there is no DOM)
 */
@Injectable()
export class WebWorkerApplicationRef {
  readonly isStable = of(true);

  boostrap(): ComponentRef<unknown> {
    throw new Error(
      'Cannot bootstrap a component inside of a web worker context.'
    );
  }
}
