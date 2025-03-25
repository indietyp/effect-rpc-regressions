import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Chunk, Effect, Stream } from "effect";
import { callFakePromise } from "~/rpc/client.fake";
import { callHttpPromise } from "~/rpc/client.http";
import { callWebsocketPromise } from "~/rpc/client.websocket";

export const Route = createFileRoute("/")({
  component: Home,

  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ["fake stream"],
      queryFn: () =>
        callFakePromise((client) =>
          client.TestValue().pipe(Stream.runCollect, Effect.map(Chunk.toReadonlyArray)),
        ),
    });
  },
});

function Home() {
  const { data: httpValues } = useQuery({
    queryKey: ["http stream"],
    queryFn: () =>
      callHttpPromise((client) =>
        client.TestStream().pipe(Stream.runCollect, Effect.map(Chunk.toReadonlyArray)),
      ),
  });

  const { data: websocketValues } = useQuery({
    queryKey: ["websocket stream"],
    queryFn: () =>
      callWebsocketPromise((client) =>
        client.TestStream().pipe(Stream.runCollect, Effect.map(Chunk.toReadonlyArray)),
      ),
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">TanStarter</h1>

      {JSON.stringify(httpValues)}

      {JSON.stringify(websocketValues)}

      <a
        className="text-muted-foreground underline hover:text-foreground"
        href="https://github.com/dotnize/tanstarter"
        target="_blank"
        rel="noreferrer noopener"
      >
        dotnize/tanstarter
      </a>
    </div>
  );
}
