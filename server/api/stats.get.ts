import { defineEventHandler } from "h3"
import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  return {
    associations: await prisma.association.count(),
    users: await prisma.user.count(),
  }
})
