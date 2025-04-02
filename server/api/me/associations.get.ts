import prisma from "~/lib/prisma"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  return await prisma.association.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      tags: true,
    },
  })
})
