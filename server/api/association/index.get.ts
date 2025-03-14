import { Prisma } from "@prisma/client"
import { defineEventHandler } from "h3"
import prisma from "~/lib/prisma"
import { paginate } from "~/server/util/request/pagination.service"

export default defineEventHandler(async (event) => {
  const { search } = getQuery(event)
  const prismaSelectOptions = {
    where: search
      ? {
          OR: [
            { name: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            { description: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined,
  }

  return await paginate(event, prisma, {
    data: async (prismaClient, inject) => prismaClient.association.findMany({ ...inject, ...prismaSelectOptions }),
    count: async prismaClient => prismaClient.association.count(prismaSelectOptions),
    maxItemPerPage: 10,
  })
})
