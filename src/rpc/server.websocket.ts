import { HttpApiBuilder, HttpMiddleware, HttpRouter, HttpServer } from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer, pipe } from "effect";
import { ProceduresLive } from "./handler.js";

export const start = Effect.gen(function* () {
  const router = pipe(
    HttpRouter.Default.serve(HttpMiddleware.logger),
    Layer.provide(RpcServer.layerProtocolWebsocket({ path: "/" })),
    Layer.provide(ProceduresLive), //
    Layer.provide(HttpApiBuilder.middlewareCors()),
    HttpServer.withLogAddress,
    Layer.provide(RpcSerialization.layerNdjson),
    Layer.provide(
      BunHttpServer.layerServer({
        hostname: "localhost",
        port: 3001,
      }),
    ),
  );

  yield* Layer.launch(router);
});
