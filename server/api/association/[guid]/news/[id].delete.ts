import { requireAssociationOwner } from '~/server/util/user/auth.guard'
import { parseAssociationIdFromRouteGuid } from '../index.get'
import prisma from '~/lib/prisma'
import { z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { validateParam } from '~/server/util/request/request.service'

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)
  const newsId = await validateParam(event, 'id', z.coerce.number().int().positive())

  //TODO: replace with requireAssociationMember
  const user = await requireAssociationOwner(event, associationId)

  try {
    await prisma.news.delete({
      where: {
        id: newsId,
        associationId: associationId,
      },
    });
  } catch (error) {
    if(error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw createError({
          statusCode: 404,
          statusMessage: 'News not found',
        })
      }
    }

    throw error;
  }

  return {
    message: "News deleted",
  }
})
