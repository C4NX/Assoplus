import { AssociationRole, Prisma } from "@prisma/client"
import { z } from "zod"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"
import { paginate } from "~/server/util/request/pagination.service"
import prisma from "~/lib/prisma"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  await requireAssociationVolunteer(event, associationId, [AssociationRole.TREASURER, AssociationRole.PRESIDENT])

  const { search, order } = await getValidatedQuery(event, z.object({
    search: z.string().optional(),
    order: z.enum(["asc", "desc"]).default("desc"),
  }).parse)

  const prismaOptions = {
    select: {
      id: true,
      amount: true,
      currency: true,
      donorName: true,
      paymentMethod: true,
      type: true,
      campaign: true,
      receiptNumber: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: order,
    },
    where: {
      associationId,
      ...search
        ? {
            OR: [
              { donorName: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
              { campaign: { contains: String(search), mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {},
    },
  }

  if (await isRequestingCsv(event)) {
    return await exportCsv(event, await prisma.donation.findMany(prismaOptions))
  }

  return await paginate(event, {
    data: async ({ take, skip }) => await prisma.donation.findMany({
      ...prismaOptions,
      take,
      skip,
    }),
    count: async () => await prisma.donation.count({
      where: prismaOptions.where,
    }),
  })
})
