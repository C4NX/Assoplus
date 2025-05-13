import { AssociationRole } from "@prisma/client"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { uploadAssociationLogoFromRequest } from "~/server/util/association/logo.service"
import { hasMultipartFileOfMimeType, validateBodyFromMultipartFormData } from "~/server/util/request/files.service"
import { requireUserAuthenticatedAndVerified } from "~/server/util/user/auth.guard"

const AssociationCreateSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  tags: z.array(z.number()).optional(),
})

export default defineEventHandler(async (event) => {
  const multipartFormData = await readMultipartFormData(event)
  const associationCreateData = await validateBodyFromMultipartFormData(multipartFormData, "data", AssociationCreateSchema)
  const hasLogo = hasMultipartFileOfMimeType(multipartFormData, "logo", ["image/png", "image/jpeg", "image/jpg"])

  const user = await requireUserAuthenticatedAndVerified(event)
  const userAssociationsCount = await prisma.association.count({
    where: {
      members: {
        some: {
          userId: user.id,
          // roles: {
          //   has: AssociationRole.PRESIDENT,
          // },
        },
      },
    },
  })

  if (userAssociationsCount >= 5) {
    throw createError({
      statusCode: 403,
      statusMessage: "You have reached the maximum number of associations you can create or join.",
    })
  }

  const association = await prisma.association.create({
    select: {
      id: true,
    },
    data: {
      name: associationCreateData.name,
      description: associationCreateData.description,
      tags: {
        connect: associationCreateData.tags?.map(tag => ({
          id: tag,
        })) ?? [],
      },
      members: {
        create: {
          userId: user.id,
          roles: [AssociationRole.PRESIDENT],
        },
      },
    },
  })

  if (hasLogo) {
    await prisma.association.update({
      where: { id: association.id },
      data: {
        logoPath: await uploadAssociationLogoFromRequest(event, multipartFormData, association.id, "logo"),
      },
    })
  }

  return association
})
