import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

export async function createPoll (app: FastifyInstance): Promise<void> {
  app.post('/polls', async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string())
    })

    const { title, options } = createPollBody.parse(request.body)

    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => ({ title: option }))
          }
        }
      }
    })

    await reply.status(201).send({ pollId: poll.id })
  })
}
