/// <reference types="vinxi/types/server" />
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

import { Effect, LogLevel, Logger } from "effect";
import { createRouter } from "./router";
import { start } from "./rpc/server.websocket";

Effect.runFork(
  start.pipe(Effect.provide([Logger.minimumLogLevel(LogLevel.Debug), Logger.pretty])),
);

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
