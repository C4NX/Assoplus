import { AssociationRole } from '@prisma/client';
import { z } from 'zod';
import prisma from '~/lib/prisma';
import { validateBodySchema } from '~/server/util/request/request.service';
import { requireAssociationOwner } from '~/server/util/user/auth.guard';

const VolunteerPostSchema = z.object({
  associationId: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  role: z.nativeEnum(AssociationRole).default(AssociationRole.VOLUNTEER).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await validateBodySchema(event, VolunteerPostSchema)

  // TODO: Later a check for volunteers (using roles)
  await requireAssociationOwner(event, body.associationId)

  // Looking for an existing user with the same email
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })

  return await prisma.volunteer.create({
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
    data: {
      associationId: body.associationId,
      userId: existingUser?.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      role: body.role ?? AssociationRole.VOLUNTEER,
      isVerified: false,
      isPending: false,
    },
  })
})
