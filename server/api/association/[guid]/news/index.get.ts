import { Prisma } from "@prisma/client"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import prisma from "~/lib/prisma"

import { paginate } from "~/server/util/request/pagination.service"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"

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

  if (await isRequestingCsv(event)) {
    const csvData = await prisma.news.findMany({
      ...prismaSelect,
      where: {
        associationId,
      },
    })
    return exportCsv(event, csvData, {
      transform: (data) => {
        for (const item of data) {
          item.author = `${item.author.firstName} ${item.author.lastName}`
          item.createdAt = item.createdAt.toISOString()
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
