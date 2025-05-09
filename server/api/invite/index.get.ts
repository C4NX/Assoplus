import prisma from "~/lib/prisma"
import { paginate } from "~/server/util/request/pagination.service"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticated(event)

  const where = {
    email: user.email,
  }

  return await paginate(
    event,
    {
      count: async () => {
        return await prisma.invite.count({
          where,
        })
      },
      data: async ({ skip, take }) => {
        return await prisma.invite.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            createdAt: true,
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            association: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        })
      },
    },
  )
})
