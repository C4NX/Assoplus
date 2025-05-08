import { Prisma } from "@prisma/client"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import prisma from "~/lib/prisma"

import { paginate } from "~/server/util/request/pagination.service"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"
import { requireAssociationOwner, requireAssociationVolunteer } from "~/server/util/user/auth.guard"

/**
 * Récupère la liste de toutes les actualités d'une association, avec pagination et export CSV
 * Cette route est pour les gérants d'associations.
 */
export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  await requireAssociationVolunteer(event, associationId)

  const prismaSelect = {
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      updatedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      status: true,
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
  }

  if (await isRequestingCsv(event)) {
    const csvData = await prisma.news.findMany({
      ...prismaSelect,
      where: {
        associationId,
      },
    })
    return exportCsv(event, csvData, {
      delimiterFromQuery: true,
      transform: (data) => {
        for (const item of data) {
          item.createdBy = `${item.createdBy.firstName} ${item.createdBy.lastName}`
          item.updatedBy = `${item.updatedBy.firstName} ${item.updatedBy.lastName}`
          item.createdAt = item.createdAt.toISOString()
          item.updatedAt = item.updatedAt.toISOString()
        }
        return data
      },
    })
  }

  return paginate(event, {
    data: async inject => await prisma.news.findMany({
      ...prismaSelect,
      where: {
        associationId,
      },
      ...inject,
    }),
    count: async () => await prisma.news.count({
      where: {
        associationId,
      },
    }),
  })
})
