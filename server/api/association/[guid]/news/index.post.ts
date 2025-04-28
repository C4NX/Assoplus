import { z } from 'zod'
import { validateBodySchema } from '~/server/util/request/request.service'
import { requireAssociationOwner } from '~/server/util/user/auth.guard'
import { parseAssociationIdFromRouteGuid } from '../index.get'
import prisma from '~/lib/prisma'
import { NewsPublicationStatus } from '@prisma/client'

const NewsCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  status: z.nativeEnum(NewsPublicationStatus).optional().default(NewsPublicationStatus.DRAFT),
})

export default defineEventHandler(async (event) => {
  const newsCreateData = await validateBodySchema(event, NewsCreateSchema)
  const associationId = parseAssociationIdFromRouteGuid(event)
  
  //TODO: replace with requireAssociationMember
  const user = await requireAssociationOwner(event, associationId)

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
      associationId,
      authorId: user.id,
    },
  });
})
