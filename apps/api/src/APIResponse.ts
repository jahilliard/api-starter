import type { FastifyReply } from 'fastify'
import _ from 'lodash'

export function encodeURLQuery(query: { [s: string]: string | number | boolean }): string {
  if (!_.isObjectLike(query)) {
    throw new Error('Query Object Params not object ')
  }
  const bodyElements = Object.entries(query) as [string, string | number | boolean][]
  return bodyElements.reduce((accumFormValue, [key, value], indx) => {
    let formVal = `${accumFormValue}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    if (indx !== bodyElements.length) {
      formVal = formVal.concat('&')
    }
    return formVal
  }, '')
}

// List of API response codes
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

export interface APIResponse {
  statusCode: number
  send(reply: FastifyReply): void
}

export class APISuccess<Response> implements APIResponse {
  statusCode: 200 | 201 | 202 | 203 | 204 | 205
  response: Response

  constructor(opts: { response: Response; statusCode?: 200 | 201 | 202 | 203 | 204 | 205 }) {
    const { statusCode = 200, response } = opts
    this.statusCode = statusCode
    this.response = response
  }

  public send(reply: FastifyReply): void {
    reply.statusCode = this.statusCode
    reply.header('Content-Type', 'application/json')
    reply.send(this.response)
  }
}

export abstract class APIRedirect implements APIResponse {
  statusCode: 307 | 308 | 302
  path: string
  query: { [s: string]: string | number | boolean } | false

  constructor(opts: {
    path: string
    query?: { [s: string]: string | number | boolean }
    statusCode?: 307 | 308 | 302
  }) {
    const { statusCode = 307, path, query = false } = opts
    this.statusCode = statusCode
    this.query = query
    this.path = path
  }

  public send(reply: FastifyReply): void {
    const { path, query } = this
    reply.redirect(query ? `${path}?${encodeURLQuery(query)}` : path)
  }
}

export abstract class APIError extends Error implements APIResponse {
  statusCode: number
  cause: string
  error: string

  constructor(message: string, statusCode: number, error: string) {
    super(message)
    this.cause = message
    this.statusCode = statusCode
    this.error = error
  }

  public send(reply: FastifyReply): void {
    reply.statusCode = this.statusCode
    reply.header('Content-Type', 'application/json')
    reply.send({
      error: this.error,
      cause: this.cause,
    })
  }
}

export class BadRequest extends APIError {
  constructor(message: string) {
    super(message, 400, 'Bad Request')
  }
}

export class NotAcceptable extends APIError {
  constructor(message: string) {
    super(message, 406, 'Not Acceptable')
  }
}

export class NotAllowed extends APIError {
  constructor(message: string) {
    super(message, 405, 'Method Not Allowed')
  }
}

export class NotAuthenticated extends APIError {
  constructor(message: string) {
    super(message, 401, 'Not Authenticated')
  }
}

export class NotFound extends APIError {
  constructor(message: string) {
    super(message, 404, 'Not Found')
  }
}

export class InternalServerError extends APIError {
  constructor(message: string) {
    super(message, 500, 'Internal Server Error')
  }
}

export class NotImplemented extends APIError {
  constructor(message: string) {
    super(message, 501, 'Internal Server Error')
  }
}
