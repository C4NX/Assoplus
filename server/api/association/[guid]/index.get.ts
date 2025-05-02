import type { H3Event } from "h3"
import { defineEventHandler } from "h3"
import { z } from "zod"
import prisma from "~/lib/prisma"

export function parseAssociationIdFromRouteGuid(event: H3Event) {
  const result = z.string().uuid().safeParse(getRouterParam(event, "guid"))
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid association ID" })
  }
  return result.data
}

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  const association = await prisma.association.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      logoPathUrl: true,
    },
    where: {
      id: associationId,
    },
  })

  if (!association) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  return association
})
