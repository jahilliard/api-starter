import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { FastifyRequest, FastifyTypeboxInstance, RawServerDefault, RouteGenericInterface } from 'fastify'
import fp from 'fastify-plugin'
import type { IncomingMessage } from 'http'

import { APISuccess } from '~/APIResponse'
import { PublicKey } from '~/AuthDelegate'
import { Controller } from '~/controllers/BaseController'

export const MinimalState = Type.Object({
  name: Type.String(),
  ts: Type.Number(),
  properties: Type.Optional(Type.Any()),
})

export const ClientEntityWithStates = Type.Object({
  ids: Type.Array(Type.Union([Type.String(), Type.Number()])),
  model: Type.String(),
  states: Type.Array(MinimalState),
})

export const RequestSchema = Type.Union([Type.Array(ClientEntityWithStates), ClientEntityWithStates])

const SuccessResponseSchema = Type.Object({
  ok: Type.Boolean(),
})

const Schema = {
  body: RequestSchema,
  response: { 202: SuccessResponseSchema },
}

type ResponseType = Static<typeof SuccessResponseSchema>

type Request = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  IncomingMessage,
  typeof Schema,
  TypeBoxTypeProvider
>

class ExampleController extends Controller<APISuccess<ResponseType>> {
  authenticator = new PublicKey()

  async _requestHandler() {
    return new APISuccess({ response: { ok: true }, statusCode: 200 })
  }

  async _postRequestHandler() {
    // Handle logic after resopnse is sent
    return
  }
}

export default fp(async (fastify: FastifyTypeboxInstance, opts: { prefix?: string; stub?: boolean }) => {
  const { prefix = `/api/v1`, stub = false } = opts || {}
  fastify.post(
    `${prefix}/endpoint-name`,
    {
      schema: Schema,
    },
    async (request, reply) => {
      request.controller = new ExampleController()

      await request.controller.requestHandler(request, reply)

      if (!stub) {
        await request.controller.postRequestHandler(request, reply)
      }
    }
  )
})
