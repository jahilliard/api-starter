/* eslint-disable no-console */
import * as fastify from 'fastify'
import { describe, expect, it } from 'vitest'

import { makeFastify } from '~/make'

describe('Ping-Pong test endpoint', () => {
  it('succeeds', async () => {
    const server = fastify.fastify()
    server.register(makeFastify, { stub: true })
    const { status } = await server.inject({ method: 'GET', url: '/api/v1/ping' }).then((res) => res.json())
    expect(status).toBe('pong')
  })
})
