import { Prisma } from "@prisma/client"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import prisma from "~/lib/prisma"

import { paginate } from "~/server/util/request/pagination.service"

/**
 * Récupère la liste des actualités d'une association, avec pagination.
 * Cette route est publique.
 */
export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  const prismaSelect = {
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      status: true,
      author: {
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

  return paginate(event, {
    data: async inject => await prisma.news.findMany({
      ...prismaSelect,
      where: {
        associationId,
        status: 'PUBLISHED',
      },
      ...inject,
    }),
    count: async () => await prisma.news.count({
      where: {
        associationId,
        status: 'PUBLISHED',
      },
    }),
  })
})
