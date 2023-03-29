import type { FastifyRequest } from "fastify";

import { NotAuthenticated } from "~/APIResponse";

export interface IAuthDelegate {
  authenticate: (request: FastifyRequest) => Promise<boolean>;
}

export class Open implements IAuthDelegate {
  async authenticate(request: FastifyRequest): Promise<boolean> {
    return true;
  }
}

export class Closed implements IAuthDelegate {
  async authenticate(request: FastifyRequest): Promise<boolean> {
    return false;
  }
}

export class PublicKey implements IAuthDelegate {
  async authenticate(request: FastifyRequest): Promise<boolean> {
    // const key = this._getApiKey(request)
    // const workspace = await this._checkWorkspace(key)
    // request.ourCtx.addWorkspace(workspace)

    const url = new URL(request.url);

    // posthogNode.capture({
    //   event: `apiEndpoint${url.pathname}_called`,
    //   distinctId: workspace.id,
    //   groups: { workspace: workspace.id },
    // })

    return true;
  }

  private _getApiKey(req: FastifyRequest) {
    const token =
      (req.headers["authorization"] || "").replace("Bearer", "").trim() ||
      ((req.query as any) || {})["apikey"] ||
      ((req.body as any) || {})["apiKey"];
    if (!token) {
      throw new NotAuthenticated(
        `Public API key not present.  Either send header authorization (w/ Bearer), add to the POST body with key apiKey, or add GET search param w/ apiKey`
      );
    }
    return token;
  }

  // private async _checkWorkspace(publicApiKey: string): Promise<Workspace> {
  //   const wrkspace = await Workspace.factory({ type: "APIKEY", publicApiKey })

  //   if (!wrkspace) {
  //     throw new NotAuthenticated(
  //       `API key parameter set in request, but unable to authenticate this key.  Is it correct?`
  //     )
  //   }

  //   return wrkspace
  // }
}
