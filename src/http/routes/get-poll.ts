import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../../lib/prisma"

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:poolId', async (request, reply) => {
    const getPollParams = z.object({
      poolId: z.string().uuid(),
    })

    const { poolId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: { id: poolId },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    if (!poll) {
      return reply.status(404).send({ error: 'Poll not found' })
    }

    return reply.send(poll)
  })
}
