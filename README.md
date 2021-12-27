Angular running inside a web worker with two way communication using MessageChannel and Observables

This is a PoC, I will be trying to get NgRx running inside of the minimally bootstrapped Angular app

Projects:

1. `client` demo app showcasing loads `worker-impl` in a `new Worker`
2. `worker-impl` buildable lib that is the actual web worker code included in the `client`, uses `worker`
3. `worker` implementation that will be published to a list to bootstrap angular in a webworker

Development:

Either set `aot: false` for serving

or

Change tsconfig.base.json paths to point to compiled asset dirs for your library that is used within the webworker and then manually build the lib

`yarn serve`

Open the console and behold the beauty

Compiling app and serving through compiled bundles:

`yarn build`

`yarn server`

Open the console and behold the beauty
