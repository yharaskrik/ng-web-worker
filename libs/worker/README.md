To run:

Either `yarn nx serve` which will serve the app with `aot: false` or `yarn nx serve-build` which will use Nx buildable libs and then a file server.

If `aot` is true then Angular will compile the WebWorkers and remove the `Compiler` as it is only needed for JIT, but does not compile the WebWorker code beyond downleveling to JS which means
that the WebWorker code is not AOT compiled and errors are thrown at run time.

Using the second option above, we are compiling our libraries with the Angular Compiler beforehand with full Ivy compilation and then when the WebWorkers are being compiled they are bundled with fully
AOT code and they work without issues.
