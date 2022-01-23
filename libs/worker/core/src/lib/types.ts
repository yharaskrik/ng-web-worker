import { NG_IN_WORKER_CONTEXT } from './tokens';

export interface MessageEventPayload<T = any> {
  workerId: string | 'main';
  context: typeof NG_IN_WORKER_CONTEXT;
  event: string;
  payload: T;
}

export type NgInWorkerEvent<T = any> = MessageEvent<MessageEventPayload<T>>;

export type SendMessagePayload<T = any> = Omit<
  MessageEventPayload<T>,
  'workerId' | 'context'
>;

export interface MessageDispatcher {
  sendMessage<T = any>(message: SendMessagePayload<T>): void;
}

/**
 * The configuration passed down into the WebWorker via the `name` property.
 */
export interface WorkerConfig {
  instanceId: string;
  workerId: string;
  /**
   * `share` will determine whether each of the events are sent to a BroadcastChannel that all tabs
   * under the same domain share or to a BroadcastChannel isolated to a single instance of the application.
   */
  share: boolean;
  debug: boolean;
}
