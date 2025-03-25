# Effect RPC Regressions

This repository documents several regressions encountered while working with Effect RPC.

You can start the development server using `bun dev`.

Of specific interest are the following directories:
* `src/rpc` - houses all RPC implementations
* `routes/api/rpc.ts` - redirects HTTP requests
* `routes/index.ts` - calls all RPC implementations

The repository implements three clients, each exhibiting different erroneous behavior:
* `client.fake.ts` - utilizes `RpcTest` to simulate RPC calls without server round-trips
* `client.http.ts` - implements HTTP connectivity
* `client.websocket.ts` - implements WebSocket connectivity

Two server implementations are provided:
* `server.http.ts` - initializes a web handler for nitro integration
* `server.websocket.ts` - initializes a WebSocket handler called in `src/ssr.tsx` to start a background server

## Scenario 1: Fake Client

The fake client produces the following error during execution:

```
[10:44:05.366] DEBUG (#7): Fiber terminated with an unhandled error
TypeError: undefined is not an object (evaluating 'fiber.unsafePoll')
    at resume ([...]/node_modules/@effect/rpc/dist/esm/RpcClient.js:115:16)
    at write ([...]/node_modules/@effect/rpc/dist/esm/RpcClient.js:243:19)
    at runLoop ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:1129:34)
    at evaluateEffect ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:733:27)
    at start ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:786:14)
    at <anonymous> ([...]/node_modules/effect/dist/esm/internal/runtime.js:59:18)
    at handleRequest ([...]/node_modules/@effect/rpc/dist/esm/RpcServer.js:209:27)
    at runLoop ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:1129:34)
    at evaluateEffect ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:733:27)
    at start ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:786:14)
    at <anonymous> ([...]/node_modules/effect/dist/esm/internal/runtime.js:59:18)
    at <anonymous> ([...]/node_modules/@effect/rpc/dist/esm/RpcClient.js:123:20)
    at <anonymous> ([...]/node_modules/effect/dist/esm/internal/core.js:291:21)
    at runLoop ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:1129:34)
    at evaluateEffect ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:733:27)
    at evaluateMessageWhileSuspended ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:708:16)
    at drainQueueOnCurrentThread ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:486:85)
    at run ([...]/node_modules/effect/dist/esm/internal/fiberRuntime.js:1156:10)
    at starveInternal ([...]/node_modules/effect/dist/esm/Scheduler.js:68:15)
    at processTicksAndRejections (native)
    at RpcServer.TestValue
```

### Scenario 2: HTTP Client does not Stream

The HTTP client fails to support stream functionality. Regardless of the input, the result is always an empty array (`[]`), even when sending simple structured data streams. This behavior can be verified on the webpage.

### Scenario 3: WebSocket immediately terminates

The WebSocket connection terminates prematurely, before the server can respond or the client can transmit data.

Server console output shows:

```
[10:44:06.028] INFO (#11) http.span.1=9ms:
All fibers interrupted without errors.
http.status: 499
http.method: GET
http.url: /
```

Custom implementation of the `makeWebSocket` function without connection closing eliminates this error, but the server still fails to respond.

Client-side console errors:

Firefox:
```
Firefox can't establish a connection to the server at ws://localhost:3001/. Socket.ts:368:22
The connection to ws://localhost:3001/ was interrupted while the page was loading. Socket.ts:368:22
```

Chrome:
```
client.http.ts:32 WebSocket connection to 'ws://localhost:3001/' failed: WebSocket is closed before the connection is established.
```
