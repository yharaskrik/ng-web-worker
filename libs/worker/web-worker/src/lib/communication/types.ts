export interface NgWebWorkerCommunication {
  registerMessageListener(port: MessagePort | BroadcastChannel): void;
}
