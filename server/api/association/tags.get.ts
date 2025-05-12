import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  return await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      type: true,
    },
    orderBy: {
      name: "asc",
    },
  })
})
