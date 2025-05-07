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
      OR: [
        { ownerId: user.id }, // Associations where the user is the owner
        { members: { some: { userId: user.id, isPending: false } } }, // Associations where the user is a member and not pending
      ]
    },
  })
})
