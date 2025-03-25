import { FetchHttpClient } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer, LogLevel, Logger, ManagedRuntime } from "effect";
import { type CallRemoteFn, type ClientContext, catchPromise } from "./client.common.js";
import { Procedures } from "./procedure.js";

const ClientLayer = Layer.empty.pipe(
  Layer.merge(FetchHttpClient.layer),
  Layer.provide(Logger.minimumLogLevel(LogLevel.Trace)),
  Layer.provide(Logger.pretty),
);

const ClientRuntime = ManagedRuntime.make(ClientLayer);

class Client extends Effect.Service<Client>()("Client", {
  scoped: Effect.gen(function* () {
    const rpc = yield* RpcClient.make(Procedures).pipe(
      Effect.provide(RpcClient.layerProtocolHttp({ url: "/api/rpc" })),
      Effect.provide(RpcSerialization.layerNdjson),
    );

    return { rpc };
  }),
  accessors: true,
}) {}

export const callHttpPromise = <A, E>(run: CallRemoteFn<A, E, ClientContext>) =>
  Effect.gen(function* () {
    const rpc = yield* Client.rpc;

    return yield* run(rpc);
  }).pipe(Effect.provide(Client.Default), ClientRuntime.runPromiseExit, (promise) =>
    promise.then(catchPromise),
  );
