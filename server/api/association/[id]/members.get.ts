import type { H3Event } from "h3"
import { defineEventHandler } from "h3"
import prisma from "~/lib/prisma"
import { exportCsv, isRequestingCsv } from "~/server/util/request/exporter.service"
import { paginate } from "~/server/util/request/pagination.service"

export function parseAssociationIdFromRouteId(event: H3Event) {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Association ID is required" })
  }

  const associationId = Number(id)

  if (associationId === null || isNaN(associationId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid association ID" })
  }

  return associationId
}

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteId(event)

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
    return await exportCsv(event, await prisma.associationMember.findMany({
      where: {
        associationId: associationId,
      },
      select: prismaSelect,
    }), {
      delimiterFromQuery: true,
    })
  }

  return paginate(event, prisma, {
    data: async (prismaClient, inject) => await prismaClient.associationMember.findMany({
      ...inject,
      where: {
        associationId: associationId,
      },
      select: prismaSelect,
    }),
    count: async prismaClient => await prismaClient.associationMember.count({
      where: {
        associationId: associationId,
      },
    }),
  })
})
