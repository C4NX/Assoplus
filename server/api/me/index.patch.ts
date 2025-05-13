import z from "zod"
import prisma from "~/lib/prisma"
import { validateBodySchema } from "~/server/util/request/request.service"
import { requireUserAuthenticatedAndVerified } from "~/server/util/user/auth.guard"
import { sanitizeUser } from "~/server/util/user/user.service"
import { sendVerificationEmail } from "~/server/util/user/verify.service"

const MePatchSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  email: z.string().email().optional(),
})

export default defineEventHandler(async (event) => {
  const data = await validateBodySchema(event, MePatchSchema)
  const user = await requireUserAuthenticatedAndVerified(event)
  const t = await useTranslation(event)

  // Update user's information and update the session
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    },
  })
  await replaceUserSession(event, {
    user: sanitizeUser(updatedUser),
  })

  // - Check if the email is being updated
  // - If the email is being updated, check if the new email is already in use
  // - Send a verification email to the new email address
  // OAuth accounts cannot change their email
  const emailUpdate = Boolean(data.email) && data.email !== user.email && user.passwordHash !== null

  if (emailUpdate) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser && existingUser.id !== user.id) {
      throw createError({ statusCode: 409, statusMessage: "profile.email_already_in_use" })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: data.email,
        isVerified: false,
      },
    })

    await sendVerificationEmail(event, updatedUser)
  }

  return {
    message: emailUpdate ? t("profile.email_update_success") : t("profile.update_success"),
  }
})
