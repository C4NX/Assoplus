import { AssociationRole } from "@prisma/client"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { validateBodySchema } from "~/server/util/request/request.service"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

const AssociationCreateSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  tags: z.array(z.number()).optional(),
})

export default defineEventHandler(async (event) => {
  const associationCreateData = await validateBodySchema(event, AssociationCreateSchema)

  const user = await requireUserAuthenticated(event)

  return await prisma.association.create({
    select: {
      id: true,
    },
    data: {
      name: associationCreateData.name,
      description: associationCreateData.description,
      ownerId: user.id,
      tags: {
        connect: associationCreateData.tags?.map(tag => ({
          id: tag,
        })) ?? [],
      },
      members: {
        create: {
          userId: user.id,
          role: AssociationRole.PRESIDENT,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: true,
          isPending: false,
        },
      },
    },
  })
})
