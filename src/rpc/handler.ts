/* eslint-disable require-yield */
import { Effect, Stream } from "effect";
import { Procedures } from "./procedure";

export const ProceduresLive = Procedures.toLayer(
  Effect.gen(function* () {
    return {
      TestStream: () =>
        Stream.fromIterable([
          { property: "A" }, //
          { property: "B" },
          { property: "C" },
        ]),
      TestValue: () => Effect.succeed({ property: "Value" }),
    };
  }),
);
