import type { RpcClient, RpcGroup } from "@effect/rpc";
import { type Effect, Exit } from "effect";
import type { Procedures } from "./procedure";

export type ClientContext = never;
type Client = RpcClient.RpcClient<RpcGroup.Rpcs<typeof Procedures>>;

export type CallRemoteFn<A, E, R extends ClientContext> = (
  client: Client,
) => Effect.Effect<A, E, R>;

export const catchPromise = <T, E>(exit: Exit.Exit<T, E>) => {
  if (Exit.isSuccess(exit)) {
    return exit.value;
  }

  throw exit.cause;
};
