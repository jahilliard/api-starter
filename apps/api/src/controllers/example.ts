import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";
import type {
  FastifyReply,
  FastifyRequest,
  FastifyTypeboxInstance,
  RawServerDefault,
  RouteGenericInterface,
} from "fastify";
import fp from "fastify-plugin";
import type { IncomingMessage } from "http";
import _ from "lodash";

import type { APIResponse } from "~/APIResponse";
import { APISuccess, BadRequest } from "~/APIResponse";
import { PublicKey } from "~/AuthDelegate";
import { Controller } from "~/controllers/BaseController";

export const MinimalState = Type.Object({
  name: Type.String(),
  ts: Type.Number(),
  properties: Type.Optional(Type.Any()),
});

export const ClientEntityWithStates = Type.Object({
  ids: Type.Array(Type.Union([Type.String(), Type.Number()])),
  model: Type.String(),
  states: Type.Array(MinimalState),
});

export const RequestSchema = Type.Union([
  Type.Array(ClientEntityWithStates),
  ClientEntityWithStates,
]);

const SuccessResponseSchema = Type.Object({
  ok: Type.Boolean(),
});

const Schema = {
  body: RequestSchema,
  response: { 202: SuccessResponseSchema },
};

type ResponseType = Static<typeof SuccessResponseSchema>;

type FastifyStateRequest = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  IncomingMessage,
  typeof Schema,
  TypeBoxTypeProvider
>;

class ExampleController extends Controller<APISuccess<ResponseType>> {
  authenticator = new PublicKey();

  async _requestHandler(request: FastifyStateRequest) {
    // Handle logic after resopnse is sent
    if (_.isArray(request.headers["x-source"])) {
      throw new BadRequest("x-source must be a string");
    }
    return new APISuccess({ response: { ok: true }, statusCode: 202 });
  }

  async _postRequestHandler(
    request: FastifyStateRequest,
    fapiReply: FastifyReply,
    functReply: APIResponse
  ) {
    // Handle logic after resopnse is sent
    return;
  }
}

export default fp(
  async (
    fastify: FastifyTypeboxInstance,
    opts: { prefix?: string; stub?: boolean }
  ) => {
    const { prefix = `/api/v1`, stub = false } = opts || {};
    fastify.post(
      `${prefix}/endpoint-name`,
      {
        schema: Schema,
      },
      async (request, reply) => {
        request.controller = new ExampleController();

        const functResponse = await request.controller.requestHandler(
          request,
          reply
        );

        if (!stub) {
          await request.controller.postRequestHandler(
            request,
            reply,
            functResponse
          );
        }
      }
    );
  }
);
