To run:

Either `yarn nx serve` which will serve the app with `aot: false` or `yarn nx serve-build` which will use Nx buildable libs and then a file server.

If `aot` is true then Angular will compile the WebWorkers and remove the `Compiler` as it is only needed for JIT, but does not compile the WebWorker code beyond transforming to JS which means
that the WebWorker code is not AOT compiled and errors are thrown at run time.

Using the second option above, we are compiling our libraries with the Angular Compiler beforehand with full Ivy compilation and then when the WebWorkers are being compiled they are bundled with fully
AOT code and they work without issues.

# What

A library allowing you to run the Angular Service/DI layer in a WebWorker context. This allows for offloading processing into WebWorkers and subscribing to the message channels from the various workers in the
main thread to receive the results. 

Supports using BroadcastChannel to share all events across any number of tabs running the same application or keeping them isolated per tab.

Has an NgRx integration to run feature states inside WebWorkers.

# Why?

Just to see if it was possible.

# Usage

## Setup

Ensure you follow the setup for WebWorkers with Angular here: https://angular.io/guide/web-worker

## AppModule/Main Application

In your applications `AppModule` you will need to add an import to initialize the library.

```typescript
NgInWorkerModule.forRoot({
  share: true,
  initializeWorkers: true,
  debug: true,
  workers: [
    {
      workerId: 'worker1',
      factory: (name: string) =>
        // There should be a `worker1.worker.ts` file in your app `src/app` folder
        new Worker(new URL('./worker1.worker', import.meta.url), {
          name,
        }),
    },
  ],
})
```

*Note: full configurations below*

## Worker

### Configuration

These docs assume you have your Worker factory setup like above and a worker file called `worker1.worker.ts` setup in your app.\

There are some gotchas with how our workers need to be setup and compiled for this to work.

If `aot` is true then Angular will compile the WebWorkers and remove the `Compiler` as it is only needed for JIT, but does not compile the WebWorker code beyond transforming to JS which means
that the WebWorker code is not AOT compiled and errors about a missing compiler are thrown at run time.

This gives us two options:

#### Option 1
Serve/Deploy our application in JIT mode (not suggested), this will leave the `Compiler` are part of the bundle and the WebWorker will have
access to compile your Angular modules and services on the fly

#### Option 2
Use a tool like Nx that allows you to create buildable libraries, you can then compile the library using full Ivy compilation and serve/build your application
using the Ivy compiled artifacts instead. We can then serve using this guide: https://nx.dev/ci/setup-incremental-builds-angular#running-and-serving-incremental-builds

### Setup

From here on our I will assume you are using a Nx (because you should be using Nx anyway!) buildable library but the concepts are the same
regardless.

Your library will be the worker implementation instead of the worker file in your apps src folder, which is just the entry point for your functional code.

In your library create a function (let's call it `initWebWorker`):

```typescript
export async function initWebWorker() {
    // bootstrap code goes here, keep reading!
}
```

This function will be imported and called in the `worker2.worker.ts` file in your apps src.

```typescript
import { initWebWorker } from '@scope/lib-name';

initWebWorker();
```

We now want to bootstrap the Angular application inside the WebWorker but need a `Module` to bootstrap just like we do in the `main.ts` file with our apps
`AppModule`.

Create a new `Module` in our WebWorkers library:

```typescript
@NgModule({})
export class WorkerImplModule implements DoBootstrap {
  // Bootstrap function must be supplied, otherwise Angular will fail to bootstrap
  ngDoBootstrap(): void {}
}
```

We now have our "apps" (WebWorker) "AppModule"! Let's bootstrap it in the WebWorker now. From above in our `initWebWorker` call the bootstrap function
with our newly created module.

```typescript
export async function initWebWorker() {
  await bootstrapNgWebWorker(WorkerImplModule);
}
```

Congrats! Now if you serve your application, it will spin up a web worker that will also spin up a mini Angular inside it (assuming you configured it to `initialize`
the web worker right away).

This doesn't actually do anything yet though. Let's add a simple service that will use the `interval` function of `rxjs` to emit an incrementing number every second which will be listened
for the app.

In a file beside your `WorkerImplModule` create a new service:

```typescript
@Injectable()
export class IntervalService {
  readonly timer$ = interval(1000);
}
```

We now have a service that has an observable that will emit once a second, but our app has no way of knowing that this observable is emitting since it is running inside the worker.

Introducing the `postEvent` pipeable operator for `rxjs`! It takes as it's arguments an `event: string` and our built-in message dispatcher `dispatcher: MessageDispatcher` (the latter is supplied for you).

```typescript
@Injectable()
export class IntervalService {
  constructor(@Inject(COMMUNICATOR) private dispatcher: MessageDispatcher) {}

  readonly timer$ = interval(1000).pipe(postEvent('timer', this.dispatcher));
}
```

The `COMMUNICATOR` token can be used from within the WebWorker context or inside your Apps context and has a `sendMessage` function on it to be able to send messages to the BroadcastChannel.

Our `IntervalService` is now setup to automatically subscribe to that observable and send what it emits to the BroadcastChannel as a `timer` event and with the emission of the `interval` function as the
events `payload`. The only thing missing now is injecting the IntervalService so that it is initialized. Usually this would be done by injecting into a component or another service but because we are
only running the service layer in the WebWorker we would need to inject each of these functions into the constructor of our modules which isn't standard. To help with this there is a helper module provided.

In your WebWorkers module import the following:

```typescript

@NgModule({
  imports: [
    // other imports from before
    WorkerServicesModule.forRoot([IntervalService]),
  ],
})
export class WorkerImplModule implements DoBootstrap {
  // Bootstrap function must be supplied
  ngDoBootstrap(): void {}
}
```

*Note: The `WorkerServicesModule` also provides a `.forFeature` method that can be used in multiple places, unlike the `forRoot` method.*

Great! Now the BroadcastChannel is receiving messages but we haven't received them in our app yet. In your apps `AppComponent` let's add the following injection.

```typescript
@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private messageEventStream: MessageEventStream
  ) {}
}
```

This provides us with a service that we can subscribe to to receive a stream of events from the BroadcastChannel. Now that we have access to the stream let's filter out only the events
we care about and print them to the console:

```typescript
@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private messageEventStream: MessageEventStream
  ) {
    this.messageEventStream
      .stream()
      .pipe(
        ofEvent<number>('timer'),
        map((event) => event.data)
      )
      .subscribe((data) => {
        console.log(data.payload);
      });
  }
}
```

The `stream()` function will return an observable that will be all the events being received from the BroadcastChannel, we want to filter those out,
so we use the `ofEvent` operator (similar to the `ofType` operator from NgRx if you are familiar), with the event that we care about as the first param.

Congrats! Now you are logging all the interval emissions in the console in our app that were received from the WebWorker!

## API

### App Context

#### Configurations:

`NgInWorkerModule#forRoot` Configuration

| property          | description                                                            | type                   | default   | required |
|-------------------|------------------------------------------------------------------------|------------------------|-----------|----------|
| share             | Whether the events dispatched from the Workers are shared between tabs | boolean                | false     | yes      |
| initializeWorkers | Immediately initialize workers or wait for explicit init calls         | boolean                | false     | no       |
| debug             | Show messages to help explain what is happening and issues             | boolean                | true      | no       |
| workers           | An array of workers to register                                        | RegisterWorkerConfig[] | undefined | no       |

`RegisterWorkerConfig`

| property   | description                                                  | type                     | default | required |
|------------|--------------------------------------------------------------|--------------------------|---------|----------|
| workerId   | A unique ID of the worker                                    | string                   |         | yes      |
| factory    | The factory function to create the worker with               | (name: string) => Worker |         | yes      |
| initialize | Whether to initialize this worker, overwrite global property | boolean                  | false   | no       |

*Note:* The `name` property in the `factory` function is used for passing configuration into the Worker. See examples for usage.

#### WebWorkerRegistry

`WebWorkerRegistry#registerWorker(config: RegisterWorkerConfig): void` - Will register a worker with the registry, will not initialize unless `initialize` is set to true.
This is called internally on the worker configuration supplied in the `forRoot` method.

`WebWorkerRegistry#initializeWorker(workerId: string): void` - Initialize a worker by its ID, will throw an error if already initialized.

`WebWorkerRegistry#terminateWorker(workerId: string): void` - Terminate a worker to stop its processing.

### WebWorker Context

`postEvent(event: string, dispatcher: MessageDispatcher)` - An operator to be used in `rxjs` observable streams that will auto subscribe and send messages to the BroadcastChannel.

#### WorkerServicesModule

`WorkerServicesModule#forRoot(services: Type<any>[])` - Accepts an array of services that will be provided and instantiated when the WebWorker boots up.

`WorkerServicesModule#forFeature(services: Type<any>[])` - Accepts an array of services that will be provided and instantiated when the module that imports it is instantiated.

### Context Agnostic (Works in both app and worker)

`ofEvent<T>(event: string)` - An operator to be used in `rxjs` observables streams that originate from the message stream that the BroadcastChannel pipes in to that will filter for only events
that match the `event` parameter.

#### MessageEventStream

`MessageEventStream#stream` - Returns an observable that will emit events from the BroadcastChannel

`MessageEventStream#dispatchMessage` - Send a event to the BroadcastChannel




















