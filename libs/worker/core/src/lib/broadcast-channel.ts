import { NG_IN_WORKER_BROADCAST_CHANNEL } from './tokens';

/**
 * Create the BroadcastChannel that will manage event sending between workers and the main thread.
 * @param instanceId
 * @param share
 */
export function createBroadcastChannel(
  instanceId: string,
  share: boolean
): BroadcastChannel {
  return new BroadcastChannel(
    share
      ? NG_IN_WORKER_BROADCAST_CHANNEL
      : `${instanceId}:${NG_IN_WORKER_BROADCAST_CHANNEL}`
  );
}
