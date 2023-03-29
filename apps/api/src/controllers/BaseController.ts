import type { FastifyReply, FastifyRequest } from 'fastify'

import type { APIResponse } from '~/APIResponse'
import { APIError, InternalServerError, NotAuthenticated, NotImplemented } from '~/APIResponse'
import type { IAuthDelegate } from '~/AuthDelegate'
import { Closed } from '~/AuthDelegate'

export abstract class Controller<SuccessAPIResponse extends APIResponse> {
  // By default, we don't authenticate any requests.
  authenticator: IAuthDelegate = new Closed()

  async requestHandler(request: FastifyRequest, reply: FastifyReply): Promise<APIError | SuccessAPIResponse> {
    try {
      const wasAuthed = await this.authenticator.authenticate(request)

      if (!wasAuthed) {
        throw new NotAuthenticated('Unable to authenticate the Request.')
      }

      const ourResponse = await this._requestHandler(request)
      reply.ourResponse = ourResponse

      reply.send(reply)
      return ourResponse
    } catch (error) {
      const isKnownError = error instanceof APIError

      if (!isKnownError) {
        const serverErr = new InternalServerError((error as Error).message)
        serverErr.send(reply)
        return serverErr
      }

      error.send(reply)
      return error
    }
  }

  // eslint-disable-next-line
  async _requestHandler(request: FastifyRequest): Promise<SuccessAPIResponse> {
    throw new NotImplemented('Request Handler Not implemented')
  }

  async postRequestHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      await this._postRequestHandler(request, reply)
    } catch (error) {
      request.ourCtx.logger.error((error as Error).message)
    }
  }

  // eslint-disable-next-line
  async _postRequestHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    throw new Error('Post Request Handler Not implemented')
  }
}
