import { defineEventHandler } from "h3"
import prisma from "~/lib/prisma"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"
import { paginate } from "~/server/util/request/pagination.service"
import { parseAssociationIdFromRouteGuid } from "./index.get"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  if (!associationId) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  const prismaSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
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

  return paginate(event, {
    data: async (inject) => await prisma.volunteer.findMany({
      ...inject,
      where: {
        associationId: associationId,
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
