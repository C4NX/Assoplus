import { defineEventHandler, type H3Event, type EventHandlerRequest } from "h3"
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  return await prisma.association.findMany()
})
