import { z } from "zod"
import { validateBodySchema } from "~/server/util/request/request.service"
import { requireUserAuthenticatedAndVerified } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"

const RejectInviteSchema = z.object({
  inviteId: z.string().uuid(),
})

export default defineEventHandler(async (event) => {
  const user = await requireUserAuthenticatedAndVerified(event)
  const { inviteId } = await validateBodySchema(event, RejectInviteSchema)

  const invite = await prisma.invite.findFirst({
    where: {
      id: inviteId,
      email: user.email,
    },
  })

  if (!invite) {
    throw createError({ statusCode: 404, statusMessage: "Invite not found" })
  }

  await prisma.invite.delete({
    where: {
      id: invite.id,
    },
  })

  return {
    message: "Invite rejected successfully",
  }
})
