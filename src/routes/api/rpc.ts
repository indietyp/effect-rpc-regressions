import { createAPIFileRoute } from "@tanstack/react-start/api";
import { handler } from "~/rpc/server.http";

export const APIRoute = createAPIFileRoute("/api/rpc")({
  POST: ({ request }) => {
    return handler(request);
  },
});
