import { z } from "zod"
import { requireAssociationOwner } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"
import { validateParam } from "~/server/util/request/request.service"

export default defineEventHandler(async (event) => {
  const volunteerId = await validateParam(event, "volunteerId", z.coerce.number().int().positive())

  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: volunteerId,
    },
    select: {
      associationId: true,
    },
  })

  if (!volunteer) {
    throw createError({ statusCode: 404, statusMessage: "Volunteer not found" })
  }

  // Check if the user is the owner of volunteer's association
  await requireAssociationOwner(event, volunteer.associationId)

  await prisma.volunteer.delete({
    where: {
      id: volunteerId,
    },
  })

  return {
    message: "Volunteer deleted successfully",
  }
})
