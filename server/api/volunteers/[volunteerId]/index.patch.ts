import { requireAssociationOwner } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"
import { z } from "zod"
import { validateBodySchema, validateParam } from "~/server/util/request/request.service"
import { AssociationRole } from "@prisma/client"

const VolunteerUpdateSchema = z.object({
  roles: z.array(z.nativeEnum(AssociationRole)).nonempty("At least one role is required"),
})

export default defineEventHandler(async (event) => {
  const volunteerId = await validateParam(event, "volunteerId", z.coerce.number().int().positive())
  const volunteerUpdateData = await validateBodySchema(event, VolunteerUpdateSchema)


  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id: volunteerId,
    },
    select: {
      associationId: true,
      roles: true,
    },
  })

  if (!volunteer) {
    throw createError({ statusCode: 404, statusMessage: "Volunteer not found" })
  }

  await requireAssociationOwner(event, volunteer.associationId)


  if(volunteer.roles.includes(AssociationRole.PRESIDENT) && !volunteerUpdateData.roles.includes(AssociationRole.PRESIDENT)) {
    throw createError({ statusCode: 400, message: "You cannot remove the president role" })
  }

  await prisma.volunteer.update({
    where: {
      id: volunteerId,
    },
    data: {
      roles: volunteerUpdateData.roles,
    },
    select: {
      id: true,
    },
  })

  return {
    message: "Volunteer updated successfully",
  }
})
