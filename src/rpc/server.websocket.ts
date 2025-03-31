import { HttpApiBuilder, HttpMiddleware, HttpRouter, HttpServer } from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer, pipe } from "effect";
import { ProceduresLive } from "./handler.js";
import { Procedures } from "./procedure.js";

const RpcLive = RpcServer.layer(Procedures).pipe(
  Layer.provide(RpcServer.layerProtocolWebsocket({ path: "/" })),
  Layer.provide(ProceduresLive), //
  Layer.provide(RpcSerialization.layerJson),
);

const router = pipe(
  HttpRouter.Default.serve(HttpMiddleware.logger),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(RpcLive),
  HttpServer.withLogAddress,
  Layer.provide(
    BunHttpServer.layerServer({
      hostname: "localhost",
      port: 3001,
    }),
  ),
);

export const start = Layer.launch(router);
