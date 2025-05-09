import { defineEventHandler } from "h3"
import { z } from "zod"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import prisma from "~/lib/prisma"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"
import { paginate } from "~/server/util/request/pagination.service"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  const query = await getValidatedQuery(event, z.object({
    search: z.string().optional(),
  }).parse)

  await requireAssociationVolunteer(event, associationId)

  const prismaSelect = {
    id: true,
    roles: true,
    user: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
  }

  if (await isRequestingCsv(event)) {
    return await exportCsv(event, await prisma.volunteer.findMany({
      where: {
        associationId: associationId,
      },
      select: prismaSelect,
    }), {
      delimiterFromQuery: true,
    })
  }

  return await paginate(event, {
    data: async inject => await prisma.volunteer.findMany({
      ...inject,
      where: {
        associationId: associationId,
        ...(
          query.search
            ? { // search filter
                OR: [
                  {
                    user: {
                      firstName: {
                        contains: query.search,
                        mode: "insensitive",
                      },
                    },
                  },
                  {
                    user: {
                      lastName: {
                        contains: query.search,
                        mode: "insensitive",
                      },
                    },
                  },
                  {
                    user: {
                      email: {
                        contains: query.search,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              }
            : {}),
      },
      select: prismaSelect,
    }),
    count: async () => await prisma.volunteer.count({
      where: {
        associationId: associationId,
      },
    }),
  })
})
