import { z } from "zod"
import { AssociationRole } from "@prisma/client"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"
import { validateParam } from "~/server/util/request/request.service"

export default defineEventHandler(async (event) => {
  const newsId = await validateParam(event, "newsId", z.coerce.number().int().positive())

  const news = await prisma.news.findUnique({
    where: {
      id: newsId,
    },
    select: {
      associationId: true,
    },
  })

  if (!news) {
    throw createError({
      statusCode: 404,
      statusMessage: "News not found",
    })
  }

  // Check if the user is a volunteer of the news'association
  await requireAssociationVolunteer(event, news.associationId, [AssociationRole.PRESIDENT, AssociationRole.WRITER])

  await prisma.news.delete({
    where: {
      id: newsId,
    },
  })

  return {
    message: "News deleted",
  }
})
