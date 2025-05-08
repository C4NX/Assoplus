import { validateBodySchema, validateParam } from "~/server/util/request/request.service"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"
import { AssociationRole, NewsPublicationStatus } from "@prisma/client"
import { sanitize } from "~/server/util/request/sanitizer.service"

const NewsUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string()
    .transform((arg) => sanitize(arg))
    .optional(),
  status: z.nativeEnum(NewsPublicationStatus).optional(),
})

export async function checkNewsAndGetAssociationId(newsId: number) {
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
  return news.associationId
}

export default defineEventHandler(async (event) => {
  const newsId = await validateParam(event, "newsId", z.coerce.number().int().positive())

  // Check news existence and get associationId
  const associationId = await checkNewsAndGetAssociationId(newsId)

  // Check if the user is a volunteer of the news'association
  const user = await requireAssociationVolunteer(event, associationId, [AssociationRole.PRESIDENT, AssociationRole.WRITER])

  const newsUpdateData = await validateBodySchema(event, NewsUpdateSchema)
  const updatedNews = await prisma.news.update({
    where: {
      id: newsId,
    },
    data: {
      ...newsUpdateData,
      updatedById: user.id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  })

  return updatedNews
})
