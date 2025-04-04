import prisma from "~/lib/prisma"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  return await prisma.association.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      ownerId: user.id,
    },
  })
})
