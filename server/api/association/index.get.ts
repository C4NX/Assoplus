import { Prisma } from "@prisma/client"
import { defineEventHandler } from "h3"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { paginate } from "~/server/util/request/pagination.service"

export default defineEventHandler(async (event) => {
  const { search, order } = await getValidatedQuery(event, z.object({
    search: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("asc"),
  }).parse)

  const prismaSelectOptions = {
    where: search
      ? {
          OR: [
            { name: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            { description: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined,
    orderBy: {
      name: order === "asc" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
    },
  }

  return await paginate(event, {
    data: async (inject) => {
      return (await prisma.association.findMany(
        {
          ...inject, // pagination
          ...prismaSelectOptions, // search
          select: {
            id: true,
            name: true,
            description: true,
            logoPathUrl: true,
            tags: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      ))
    },
    count: async () => prisma.association.count(prismaSelectOptions),
    maxItemPerPage: 10,
  })
})
