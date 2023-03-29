import type { FastifyReply } from "fastify";
import { encodeURLQuery } from "lib";

// List of API response codes
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

export interface APIResponse {
  statusCode: number;
  send(reply: FastifyReply): void;
}

export class APISuccess<Response> implements APIResponse {
  statusCode: 200 | 201 | 202 | 203 | 204 | 205;
  response: Response;

  constructor(opts: {
    response: Response;
    statusCode?: 200 | 201 | 202 | 203 | 204 | 205;
  }) {
    const { statusCode = 200, response } = opts;
    this.statusCode = statusCode;
    this.response = response;
  }

  public send(reply: FastifyReply): void {
    reply.statusCode = this.statusCode;
    reply.header("Content-Type", "application/json");
    reply.send(this.response);
  }
}

export abstract class APIRedirect implements APIResponse {
  statusCode: 307 | 308 | 302;
  path: string;
  query: { [s: string]: string | number | boolean } | false;

  constructor(opts: {
    path: string;
    query?: { [s: string]: string | number | boolean };
    statusCode?: 307 | 308 | 302;
  }) {
    const { statusCode = 307, path, query = false } = opts;
    this.statusCode = statusCode;
    this.query = query;
    this.path = path;
  }

  public send(reply: FastifyReply): void {
    const { path, query } = this;
    reply.redirect(query ? `${path}?${encodeURLQuery(query)}` : path);
  }
}

export abstract class APIError extends Error implements APIResponse {
  statusCode: number;
  cause: string;
  error: string;

  constructor(message: string) {
    super(message);
    this.cause = message;
  }

  public send(reply: FastifyReply): void {
    reply.statusCode = this.statusCode;
    reply.header("Content-Type", "application/json");
    reply.send({
      error: this.error,
      cause: this.cause,
    });
  }
}

export class BadRequest extends APIError {
  statusCode: 400 = 400;
  error: "Bad Request" = "Bad Request";
}

export class NotAcceptable extends APIError {
  statusCode: 406 = 406;
  error: "Not Acceptable" = "Not Acceptable";
}

export class NotAllowed extends APIError {
  statusCode: 405 = 405;
  error: "Method Not Allowed" = "Method Not Allowed";
}

export class NotAuthenticated extends APIError {
  statusCode: 401 = 401;
  error: "Not Authenticated" = "Not Authenticated";
}

export class NotFound extends APIError {
  statusCode: 404 = 404;
  error: "Not Found" = "Not Found";
}

export class InternalServerError extends APIError {
  statusCode: 500 = 500;
  error: "Internal Server Error" = "Internal Server Error";
}

export class NotImplemented extends APIError {
  statusCode: 501 = 501;
  error: "Internal Server Error" = "Internal Server Error";
}
