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
    data: async (prismaClient, inject) => {
      return await prismaClient.association.findMany(
        {
          ...inject, // pagination
          ...prismaSelectOptions, // search
          select: {
            id: true,
            name: true,
            description: true,
            logoUuid: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      )
    },
    count: async prismaClient => prismaClient.association.count(prismaSelectOptions),
    maxItemPerPage: 10,
  })
})
