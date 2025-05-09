import { z } from "zod"
import { requireAssociationOwner } from "~/server/util/user/auth.guard"
import { validateBodySchema } from "~/server/util/request/request.service"
import prisma from "~/lib/prisma"
import { sendMail } from "~/server/util/mailer/mailer.service"
import { emailTemplateBase } from "~/server/util/mailer/templates"

const VolunteerInviteSchema = z.object({
  associationId: z.string().uuid(),
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const body = await validateBodySchema(event, VolunteerInviteSchema)
  const user = await requireAssociationOwner(event, body.associationId)
  const { baseUrl } = useRuntimeConfig()

  const association = await prisma.association.findUnique({
    where: {
      id: body.associationId,
    },
    select: {
      name: true,
    },
  })

  const existingInvite = await prisma.invite.findFirst({
    where: {
      associationId: body.associationId,
      email: body.email,
    },
  })

  if (existingInvite) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invite already exists",
    })
  }

  const inviteToken = crypto.randomUUID()

  await prisma.invite.create({
    data: {
      associationId: body.associationId,
      email: body.email,
      token: inviteToken,
      createdById: user.id,
    },
  })

  await sendMail({
    to: body.email,
    subject: "Invitation to join the association",
    html: emailTemplateBase(event, {
      title: "Invitation to join the association",
      content: `
      <p>Hello,</p>
      <p>You have been invited to join the association.</p>
      <p>Please click the link below to accept the invitation:</p>
      <p><a href="${baseUrl}/api/invite/accept?associationId=${body.associationId}&token=${inviteToken}">Accept Invitation</a></p>
      <p>Best regards,</p>
      <p>${user.firstName} ${user.lastName}</p>
      <p>${association?.name}</p>
    `,
    }),
  })

  return {
    message: "Invite sent successfully",
  }
})
