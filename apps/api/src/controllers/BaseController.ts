import type { FastifyReply, FastifyRequest } from "fastify";

import type { APIResponse } from "~/APIResponse";
import {
  APIError,
  InternalServerError,
  NotAuthenticated,
  NotImplemented,
} from "~/APIResponse";
import type { IAuthDelegate } from "~/AuthDelegate";
import { Closed } from "~/AuthDelegate";

export abstract class Controller<SuccessAPIResponse extends APIResponse> {
  authenticator: IAuthDelegate = new Closed();

  async requestHandler(request, reply): Promise<APIError | SuccessAPIResponse> {
    try {
      const wasAuthed = await this.authenticator.authenticate(request);

      if (wasAuthed) {
        const functReply = await this._requestHandler(request);
        functReply.send(reply);
        return functReply;
      } else {
        const authErr = new NotAuthenticated(
          "Unable to authenticate the Request."
        );
        authErr.send(reply);
        return authErr;
      }
    } catch (error) {
      console.error(error.message);
      if (error instanceof APIError) {
        error.send(reply);
        return error;
      } else {
        const serverErr = new InternalServerError(error.message);
        serverErr.send(reply);
        return serverErr;
      }
    }
  }

  async _requestHandler(request): Promise<SuccessAPIResponse> {
    throw new NotImplemented("Request Handler Not implemented");
  }

  postRequestHandler: (
    request: FastifyRequest,
    fapiReply: FastifyReply,
    functReply: APIResponse
  ) => Promise<void> = async (request, fapiReply, functReply) => {
    try {
      await this._postRequestHandler(request, fapiReply, functReply);
    } catch (error) {
      request.OurCtx.logger.error(error.message);
    }
  };

  async _postRequestHandler(request, fapiReply, functReply): Promise<void> {
    throw new Error("Post Request Handler Not implemented");
  }
}
