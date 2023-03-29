import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type {
  FastifyReply,
  FastifyRequest,
  FastifyTypeboxInstance,
} from "fastify";
import fp from "fastify-plugin";

import ExampleController from "./controllers/example";
import { OurCtx } from "./OurCtx";

export const pingPlugin = async (fastify: FastifyTypeboxInstance) => {
  fastify.get("/ping", async (request, reply) => {
    reply.send({
      status: "pong",
    });
  });
};

export const makeFastify = fp(
  async (fastify: FastifyTypeboxInstance, opts: { stub: boolean }) => {
    fastify.withTypeProvider<TypeBoxTypeProvider>();

    fastify.decorateRequest("OurCtx", null);
    fastify.addHook(
      "onRequest",
      async (req: FastifyRequest, reply: FastifyReply) => {
        req.OurCtx = new OurCtx({
          requestId: req.id,
          url: req.url,
          timezoneOffset: Number(req.headers["x-timezone-offset"]) || undefined,
        });
      }
    );

    fastify.addHook(
      "onSend",
      async (req: FastifyRequest, reply: FastifyReply) => {
        reply.header("X-Request-Id", req.id);
      }
    );

    fastify.decorateRequest("controller", null);

    // Register Routes
    fastify.register(pingPlugin, { prefix: "/api/v1" });
    fastify.register(ExampleController, { prefix: "/api/v1", stub: opts.stub });
  }
);
