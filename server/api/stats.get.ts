import { defineEventHandler } from "h3"
import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  const associationsCount = await prisma.association.count()
  const usersCount = await prisma.user.count()

  return {
    associations: associationsCount < 10 ? associationsCount : Math.round(associationsCount / 10) * 10,
    users: usersCount < 10 ? usersCount : Math.round(usersCount / 10) * 10,
  }
})
