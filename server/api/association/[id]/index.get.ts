import { defineEventHandler, H3Event } from "h3"
import prisma from "~/lib/prisma"

export function parseAssociationIdFromRouteId(event: H3Event) {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Association ID is required" })
  }

  const associationId = Number(id)

  if (isNaN(associationId)) {
    throw createError({ statusCode: 400, statusMessage: "Invaliad association ID" })
  }

  return associationId
}

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteId(event)

  const association = await prisma.association.findUnique({
    where: {
      id: associationId,
    },
  })

  if (!association) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  return association
})
