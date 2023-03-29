import { randomUUID } from 'crypto'
import { createServer } from 'http'

import cors from '@fastify/cors'
import Swagger from '@fastify/swagger'
import SwaggerUI from '@fastify/swagger-ui'
import type { FastifyServerFactory, FastifyServerFactoryHandler } from 'fastify'
import Fastify from 'fastify'
import type { IncomingMessage, ServerResponse } from 'http'

import { makeFastify } from './make'

const port = Number(process.env.PORT) || 3000

const serverFactory: FastifyServerFactory = (fastifyHandler: FastifyServerFactoryHandler) =>
  createServer(async (req: IncomingMessage, reply: ServerResponse) => {
    fastifyHandler(req, reply)
    return
  })

const fastify = Fastify({
  serverFactory,
  genReqId(req) {
    const requestId = req.headers['x-request-id'] || randomUUID()
    return requestId as string
  },
})

// Handle cors for a Public API
fastify.register(cors, {
  origin: true,
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Request-Id',
    'X-Timezone-Offset',
    'X-Source',
  ],
})

fastify.register(Swagger, {
  swagger: {
    info: {
      title: 'Functionary API',
      description: 'Functionary API endpoint documentation',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://functionary.run',
      description: 'Trigger Zaps from user events',
    },
    host: 'functionary.run',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})

fastify.register(SwaggerUI, {
  routePrefix: '/swagger',
})

// start connections
fastify.addHook('onReady', async () => {
  // TODO: Add back kafka
  // await publisher.start()
})

// shutdown connections
fastify.addHook('onClose', async () => {
  // TODO: Add back kafka
  // await publisher.shutdown()
})

fastify.register(makeFastify, { stub: false })

// fastify.addHook("onSend", async (req: FastifyRequest, reply: FastifyReply) => {
//   reply.ctx.finishSentryTranscation()
//   return
// })

fastify.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) throw err
  // eslint-disable-next-line no-console
  console.log(`\n\n\nReady on https://0.0.0.0:3000/\n\n\n`)
})
