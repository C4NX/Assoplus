import type { H3Event } from "h3"
import { v4 as uuid } from "uuid"
import type { User } from "@prisma/client"
import { sendMail } from "../mailer/mailer.service"
import prisma from "~/lib/prisma"

/**
 * Verify a user account with a given token stored in session. If the tokens match, the user is verified,
 * email is updated if needed and the session is cleared to let the user log in again.
 * @param event H3Event
 * @param token The token to verify the user account
 */
export async function verifyUserAccount(event: H3Event, token: string) {
  const { secure } = await getUserSession(event)
  const t = await useTranslation(event)

  const userToBeVerified = await prisma.user.findUnique({
    where: {
      id: secure?.verify?.userId,
    },
  })

  if (!userToBeVerified?.passwordHash) { // OAuth2 users can't be verified
    throw createError({ statusCode: 400, message: t("login.verify.cannot_verify") })
  }

  // Check if the user is already verified AND the email is not updated,
  // this was made because we are revalidating the email address and do not want to throw an error on that.
  if (userToBeVerified?.isVerified && secure?.verify?.pendingEmailUpdate === undefined) {
    throw createError({ statusCode: 400, message: t("login.verify.already_verified") })
  }

  if (!secure || !secure.verify || secure.verify.token !== token || secure.verify.userId !== userToBeVerified?.id) {
    throw createError({ statusCode: 400, message: t("login.verify.error") })
  }

  if (secure?.verify?.expiresAt < new Date()) {
    await replaceUserSession(event, { secure: { verify: undefined } })
    throw createError({ statusCode: 400, message: t("login.verify.expired") })
  }

  await prisma.user.update({
    where: {
      id: userToBeVerified.id,
    },
    data: {
      isVerified: true,
      email: secure?.verify?.pendingEmailUpdate ?? undefined, // If the email is updated, set it to the new email.
    },
  })

  await clearUserSession(event)
}

export async function sendVerificationEmail(event: H3Event, user: User, newEmail?: string) {
  const { baseUrl } = useRuntimeConfig(event)
  const uniqueToken = uuid()

  // Check if the new email is already in use
  if (newEmail && await prisma.user.findUnique({
    where: { email: newEmail },
  })) {
    throw createError({ statusCode: 409, message: "Email already in use" })
  }

  await replaceUserSession(event, {
    secure: {
      verify: {
        userId: user.id,
        token: uniqueToken,
        pendingEmailUpdate: newEmail,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours (in the session duration)
      },
    },
  })

  await sendMail({
    to: newEmail ?? user.email,
    subject: "Verify your email",
    text: "Please verify your email by clicking on the link below",
    html: `<a href='${baseUrl}/api/auth/verify?token=${uniqueToken}'>Verify email</a>`,
  })
}
