import { defineEventHandler } from "h3"
import { z } from "zod"
import { parseAssociationIdFromRouteGuid } from "./index.get"
import prisma from "~/lib/prisma"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"
import { paginate } from "~/server/util/request/pagination.service"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  const query = await getValidatedQuery(event, z.object({
    search: z.string().optional(),
  }).parse)

  if (!associationId) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  const prismaSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    isPending: true,
    userId: true,
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
                    firstName: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    lastName: {
                      contains: query.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: query.search,
                      mode: "insensitive",
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
