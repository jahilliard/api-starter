/* eslint-disable no-console */
import * as fastify from 'fastify'

import { makeFastify } from './make'

describe('Ping-Pong test endpoint', () => {
  beforeAll(async () => {
    console.log('beforeAll')
  })

  afterAll(async () => {
    console.log('afterAll')
  })

  it('succeeds', async () => {
    const server = fastify.fastify()
    server.register(makeFastify, { stub: true })
    const { status } = await server.inject({ method: 'GET', url: '/api/v1/ping' }).then((res) => res.json())
    expect(status).toBe('pong')
  })
})
