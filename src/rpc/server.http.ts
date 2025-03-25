import { BunHttpServer } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer, LogLevel, Logger } from "effect";
import { ProceduresLive } from "./handler";
import { Procedures } from "./procedure.js";

const ServerLayer = Layer.empty.pipe(
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug)),
  Layer.provide(Logger.pretty),
);

export const { handler, dispose } = RpcServer.toWebHandler(Procedures, {
  layer: Layer.empty.pipe(
    Layer.provideMerge(ProceduresLive),
    Layer.provideMerge(RpcSerialization.layerNdjson),
    Layer.provideMerge(BunHttpServer.layerContext),
    Layer.provideMerge(ServerLayer),
  ),
});
