import { Inject, Injectable } from '@angular/core';
import {
  BROADCAST_CHANNEL,
  MessageDispatcher,
  MessageEventPayload,
  NG_IN_WORKER_CONTEXT,
  SendMessagePayload,
} from '@ng-web-worker/worker/core';

@Injectable()
export class MainThreadCommunicator implements MessageDispatcher {
  constructor(
    @Inject(BROADCAST_CHANNEL) private broadcastChannel: BroadcastChannel
  ) {}

  sendMessage<T = any>(message: SendMessagePayload<T>) {
    const payload: MessageEventPayload = {
      ...message,
      context: NG_IN_WORKER_CONTEXT,
      workerId: 'main',
    };

    this.broadcastChannel.postMessage(payload);
  }
}
