import { defineEventHandler } from "h3"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  await requireUserAuthenticated(event)
  return {
    associations: await prisma.association.count(),
  }
})
