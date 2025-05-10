import { NewsPublicationStatus, Prisma } from "@prisma/client"
import { z } from "zod"
import { getValidatedQuery } from "h3"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import prisma from "~/lib/prisma"

import { paginate } from "~/server/util/request/pagination.service"

/**
 * Récupère la liste des actualités d'une association, avec pagination.
 * Cette route est publique.
 */
export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  const { search, order } = await getValidatedQuery(event, z.object({
    search: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("desc"),
  }).parse)

  const prismaOptions = {
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      status: true,
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: order === "asc"
        ? Prisma.SortOrder.asc
        : Prisma.SortOrder.desc,
    },
    where: {
      associationId,
      status: NewsPublicationStatus.PUBLISHED,
      ...(search
        ? {
            OR: [
              { title: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            // { content: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    },
  }

  return paginate(event, {
    data: async ({ take, skip }) => await prisma.news.findMany({
      ...prismaOptions,
      take,
      skip,
    }),
    count: async () => await prisma.news.count({
      where: prismaOptions.where,
    }),
  })
})
