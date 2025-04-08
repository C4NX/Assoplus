import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  return await prisma.associationTag.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  })
})
