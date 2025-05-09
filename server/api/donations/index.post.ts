import { DonationType, PaymentMethod } from '@prisma/client'
import { z } from 'zod'
import prisma from '~/lib/prisma'
import { validateBodySchema } from '~/server/util/request/request.service'
import { requireAssociationVolunteer } from '~/server/util/user/auth.guard'

const DonationCreateSchema = z.object({
  associationId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).toUpperCase(),
  donorName: z.string().min(1),
  donorEmail: z.string().email().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  type: z.nativeEnum(DonationType),
  campaign: z.string().optional(),
  receiptNumber: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const donationCreateData = await validateBodySchema(event, DonationCreateSchema)

  await requireAssociationVolunteer(event, donationCreateData.associationId)

  await prisma.donation.create({
    data: {
      ...donationCreateData,
    },
  })

  return {
    message: 'Donation created successfully',
  }
})
