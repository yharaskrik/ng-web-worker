export interface MessageEventPayload<T = any> {
  workerId: string | 'main';
  context: 'ng-web-worker';
  event: string;
  payload: T;
}

export type NgInWorkerEvent = MessageEvent<MessageEventPayload>;

export type SendMessagePayload<T = any> = Omit<
  MessageEventPayload<T>,
  'workerId' | 'context'
>;

export interface MessageDispatcher {
  sendMessage<T = any>(message: SendMessagePayload<T>): void;
}

export type WorkerFactory = (name: string) => Worker;

export interface RegisterWorkerConfig {
  workerId: string;
  factory: WorkerFactory;
}

/**
 * The configuration passed down into the WebWorker via the `name` property.
 */
export interface NgInWorkerConfig {
  instanceId: string;
  workerId: string;
  share: boolean;
}
