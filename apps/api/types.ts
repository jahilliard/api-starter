import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type {
  FastifyBaseLogger,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify'

import type { APIResponse } from '~/APIResponse'
import type { Controller } from '~/controllers/BaseController'
import type { OurCtx } from '~/OurCtx'

declare module 'fastify' {
  export type FastifyTypeboxInstance = FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    TypeBoxTypeProvider
  >

  export interface FastifyRequest {
    ourCtx: OurCtx
    controller: Controller<APIResponse>
  }

  export interface FastifyReply {
    ourResponse: APIResponse
  }
}
