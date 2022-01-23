import { Injectable } from '@angular/core';
import {
  MessageDispatcher,
  MessageEventPayload,
  NG_IN_WORKER_CONTEXT,
  SendMessagePayload,
} from '@ng-web-worker/worker/core';
import { WebWorkerRegistry } from './web-worker-registry';

@Injectable()
export class MainThreadCommunicator implements MessageDispatcher {
  constructor(private webWorkerRegistry: WebWorkerRegistry) {}

  sendMessage<T = any>(message: SendMessagePayload<T>) {
    const payload: MessageEventPayload = {
      ...message,
      context: NG_IN_WORKER_CONTEXT,
      workerId: 'main',
    };

    this.webWorkerRegistry.sendMessageToWorker(payload);
  }
}
