import { BrowserSocket } from "@effect/platform-browser";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer, LogLevel, Logger, ManagedRuntime } from "effect";
import { type CallRemoteFn, type ClientContext, catchPromise } from "./client.common.js";
import { Procedures } from "./procedure.js";

class Client extends Effect.Service<Client>()("Client", {
  scoped: Effect.gen(function* () {
    const rpc = yield* RpcClient.make(Procedures);

    return { rpc };
  }),
  dependencies: [
    RpcClient.layerProtocolSocket.pipe(
      Layer.provide(BrowserSocket.layerWebSocket("http://localhost:3001")),
      Layer.provide(RpcSerialization.layerJson),
    ),
  ],
  accessors: true,
}) {}

const ClientLayer = Client.Default.pipe(
  Layer.provide(Logger.minimumLogLevel(LogLevel.Trace)),
  Layer.provide(Logger.pretty),
);

const ClientRuntime = ManagedRuntime.make(ClientLayer);

export const callWebsocketPromise = <A, E>(run: CallRemoteFn<A, E, ClientContext>) =>
  Effect.gen(function* () {
    const rpc = yield* Client.rpc;

    return yield* run(rpc);
  }).pipe(ClientRuntime.runPromiseExit, (promise) => promise.then(catchPromise));
