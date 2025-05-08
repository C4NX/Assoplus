import prisma from "~/lib/prisma"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  const associations = await prisma.association.findMany({
    select: {
      id: true,
      name: true,
      members: {
        where: {
          userId: user.id
        },
        select: {
          roles: true
        }
      },
    },
    where: {
      OR: [
        { members: { some: { userId: user.id } } }, // Associations where the user is a member and not pending
      ]
    },
  })

  return associations.map(association => ({
    id: association.id,
    name: association.name,
    roles: association.members[0]?.roles || null
  }))
})
