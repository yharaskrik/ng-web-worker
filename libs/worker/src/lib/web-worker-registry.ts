import { Inject, Injectable } from '@angular/core';
import {
  BROADCAST_CHANNEL,
  Logger,
  MessageEventStream,
  NgInWorkerEvent,
  NG_IN_WORKER_CONFIG,
  WorkerConfig,
} from '@ng-web-worker/worker/core';
import { INITIALIZE_WORKERS, WORKERS } from './tokens';
import { RegisterWorkerConfig } from './types';

@Injectable()
export class WebWorkerRegistry {
  private readonly workers = new Map<string, Worker>();

  private readonly workerConfigs = new Map<string, RegisterWorkerConfig>();

  constructor(
    private messageEventStream: MessageEventStream,
    @Inject(NG_IN_WORKER_CONFIG)
    private ngInWorkerConfig: WorkerConfig,
    @Inject(WORKERS) workers: RegisterWorkerConfig[],
    private logger: Logger,
    @Inject(INITIALIZE_WORKERS) private initializeWorkers: boolean,
    @Inject(BROADCAST_CHANNEL) private broadcastChannel: BroadcastChannel
  ) {
    /*
     * Set up the listener for the broadcast channel to ensure that all events are sent into the global
     * NgInWorker event stream
     */
    this.broadcastChannel.onmessage = (ev: NgInWorkerEvent) =>
      this.messageEventStream.dispatchMessage(ev);

    /*
     * The workers registered in the `forRoot` method
     */
    if (workers) {
      this.registerWorkers(workers);
    }
  }

  private registerWorkers(configs: RegisterWorkerConfig[]): void {
    configs.forEach((config) => {
      this.registerWorker(config);
    });
  }

  terminateWorker(workerId: string): void {
    const worker = this.workers.get(workerId);

    if (worker == null) {
      if (this.workerConfigs.has(workerId)) {
        this.logger.warn(
          `${workerId} is not currently running. Cannot terminate.`
        );
      } else {
        this.logger.warn(`${workerId} is not registered.`);
      }
      return;
    }

    this.logger.log(`Terminating worker ${workerId}`);
    worker.terminate();
    this.workers.delete(workerId);
  }

  initializeWorker(workerId: string): void {
    const config = this.workerConfigs.get(workerId);

    if (this.workers.has(workerId)) {
      this.logger.log(`${workerId} already initialized.`);
      return;
    }

    if (!config) {
      throw new Error(
        `Something went wrong, ${workerId} was not registered before initialization.`
      );
    }

    this.logger.log(`Initializing ${workerId}`);

    const workerConfig: WorkerConfig = {
      workerId,
      instanceId: this.ngInWorkerConfig.instanceId,
      share: this.ngInWorkerConfig.share,
      debug: this.ngInWorkerConfig.debug,
    };

    const worker = config.factory(JSON.stringify(workerConfig));

    this.workers.set(workerId, worker);
  }

  /**
   * Register a web worker and set up the listeners
   * @param config
   */
  registerWorker(config: RegisterWorkerConfig): void {
    const { workerId, factory } = config;
    if (this.workerConfigs.has(workerId)) {
      throw new Error(
        `There is already a worker registered with ID: ${config.workerId}. Worker IDs must be unique.`
      );
    }

    if (!factory || typeof factory !== 'function') {
      throw new Error(
        `Factory function for worker ${config.workerId} is invalid.`
      );
    }

    this.logger.log(`Registering ${workerId}.`);

    this.workerConfigs.set(workerId, config);

    if (
      config.initialize === false ||
      (!this.initializeWorkers && config.initialize == null)
    ) {
      return;
    }

    this.initializeWorker(workerId);
  }
}
