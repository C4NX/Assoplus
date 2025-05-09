import { z } from "zod"
import { NewsPublicationStatus } from "@prisma/client"
import { defineEventHandler } from "h3"
import { validateBodySchema } from "~/server/util/request/request.service"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"

import { sanitize } from "~/server/util/request/sanitizer.service"

const NewsCreateSchema = z.object({
  associationId: z.string(),
  title: z.string(),
  content: z.string().transform(arg => sanitize(arg)),
  status: z.nativeEnum(NewsPublicationStatus).default(NewsPublicationStatus.DRAFT).optional(),
})

export default defineEventHandler(async (event) => {
  const newsCreateData = await validateBodySchema(event, NewsCreateSchema)
  const user = await requireAssociationVolunteer(event, newsCreateData.associationId)

  return await prisma.news.create({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    data: {
      title: newsCreateData.title,
      content: newsCreateData.content,
      status: newsCreateData.status,
      associationId: newsCreateData.associationId,
      createdById: user.id,
      updatedById: user.id,
    },
  })
})
