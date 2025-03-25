import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";

export class Procedures extends RpcGroup.make(
  Rpc.make("TestStream", {
    success: Schema.Struct({ property: Schema.String }),
    stream: true,
  }),
  Rpc.make("TestValue", {
    success: Schema.Struct({ property: Schema.String }),
  }),
) {}
