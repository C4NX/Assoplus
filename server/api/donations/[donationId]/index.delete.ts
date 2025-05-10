import { AssociationRole } from "@prisma/client"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { validateParam } from "~/server/util/request/request.service"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const donationId = await validateParam(event, "donationId", z.coerce.number().int().positive())

  const donation = await prisma.donation.findUnique({
    select: {
      id: true,
      associationId: true,
    },
    where: {
      id: donationId,
    },
  })

  if (!donation) {
    throw createError({
      statusCode: 404,
      statusMessage: "Donation not found",
    })
  }

  await requireAssociationVolunteer(event, donation.associationId, [AssociationRole.PRESIDENT, AssociationRole.TREASURER])

  await prisma.donation.delete({
    where: {
      id: donation.id,
    },
  })

  return {
    statusCode: 200,
    message: "Donation deleted successfully",
  }
})
