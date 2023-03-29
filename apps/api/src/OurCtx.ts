import os from 'os'

import { pino } from 'pino'
import pretty from 'pino-pretty'

const logger =
  process.env.NODE_ENV === 'production'
    ? pino({
        name: 'Functionary Logger',
        level: 'info',
        translateTime: 'HH:MM:ss.l Z',
      })
    : pino(
        {
          name: 'Functionary Logger',
          level: 'debug',
          enabled: process.env.NODE_ENV !== 'test',
          translateTime: 'HH:MM:ss.l Z',
        },
        pretty({
          levelFirst: true,
          colorize: true,
        })
      )

export class OurCtx {
  // protected _workspace: Workspace | null

  logger: pino.Logger

  constructor(opts: { requestId?: string; url?: string; timezoneOffset?: number } = {}) {
    const { url, requestId, timezoneOffset } = opts
    this.logger = logger.child({
      base: {
        ...(url && { url }),
        ...(requestId && { requestId }),
        // pid: process.pid,
        hostname: os.hostname(),
      },
    })
  }

  // get workspace(): Workspace {
  //   if (this._workspace) {
  //     return this._workspace
  //   } else {
  //     throw new Error(`The workspace you are trying to access is not set in request ctx`)
  //   }
  // }

  // addWorkspace(w: Workspace) {
  //   if (this._workspace) {
  //     throw new Error(`The workspace you are trying to access is not set in request ctx`)
  //   } else {
  //     this._workspace = w
  //   }
  // }
}
