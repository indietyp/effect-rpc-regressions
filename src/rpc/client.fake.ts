import { RpcTest } from "@effect/rpc";
import { Effect, Layer, LogLevel, Logger, ManagedRuntime } from "effect";
import { type CallRemoteFn, type ClientContext, catchPromise } from "./client.common.js";
import { ProceduresLive } from "./handler.js";
import { Procedures } from "./procedure.js";

const ServerLayer = Layer.empty.pipe(
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug)),
  Layer.provide(Logger.pretty),
);

const ServerRuntime = ManagedRuntime.make(ServerLayer);

class ServerClient extends Effect.Service<ServerClient>()("ServerClient", {
  scoped: Effect.gen(function* () {
    const rpc = yield* RpcTest.makeClient(Procedures).pipe(
      Effect.provide(ProceduresLive),
    );

    return { rpc };
  }),
  accessors: true,
}) {}

export const callFakePromise = <A, E>(run: CallRemoteFn<A, E, ClientContext>) =>
  Effect.gen(function* () {
    const rpc = yield* ServerClient.rpc;

    return yield* run(rpc);
  }).pipe(Effect.provide(ServerClient.Default), ServerRuntime.runPromiseExit, (promise) =>
    promise.then(catchPromise),
  );
