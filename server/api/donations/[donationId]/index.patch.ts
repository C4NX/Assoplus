import { DonationType, PaymentMethod } from "@prisma/client"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { validateBodySchema, validateParam } from "~/server/util/request/request.service"
import { requireAssociationVolunteer } from "~/server/util/user/auth.guard"

const DonationUpdateSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  currency: z.string().length(3).toUpperCase().optional(),
  donorName: z.string().min(1).optional(),
  donorEmail: z.string().email().nullable().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  type: z.nativeEnum(DonationType).optional(),
  campaign: z.string().optional(),
  receiptNumber: z.string().optional(),
}).partial()

export default defineEventHandler(async (event) => {
  const donationId = await validateParam(event, "donationId", z.coerce.number().positive())

  const donation = await prisma.donation.findUnique({
    where: {
      id: donationId,
    },
    select: {
      associationId: true,
    },
  })

  if (!donation) {
    throw createError({
      statusCode: 404,
      statusMessage: "Donation not found",
    })
  }

  await requireAssociationVolunteer(event, donation.associationId)

  const donationUpdateData = await validateBodySchema(event, DonationUpdateSchema)

  await prisma.donation.update({
    where: {
      id: donationId,
    },
    data: {
      ...donationUpdateData,
      associationId: donation.associationId,
    },
  })

  return {
    message: "Donation updated successfully",
  }
})
