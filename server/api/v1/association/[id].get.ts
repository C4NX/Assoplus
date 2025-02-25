import { defineEventHandler, type H3Event, type EventHandlerRequest } from "h3"
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Association ID is required" })
  }

  const associationId = Number(id)

  if (isNaN(associationId)) {
    throw createError({ statusCode: 400, statusMessage: "Invaliad association ID" })
  }

  const association = await prisma.association.findFirst({
    where: {
      id: associationId,
    },
  })

  if (!association) {
    throw createError({ statusCode: 404, statusMessage: "Association not found" })
  }

  return association 
})
