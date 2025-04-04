import type { H3Event } from "h3"
import { v4 as uuid } from "uuid"
import type { User } from "@prisma/client"
import { sendMail } from "../mailer/mailer.service"
import prisma from "~/lib/prisma"

export async function verifyUserAccount(event: H3Event, token: string) {
  const { secure } = await getUserSession(event)
  const t = await useTranslation(event)

  const userToBeVerified = await prisma.user.findUnique({
    where: {
      id: secure?.verify?.userId,
    },
  })

  if (userToBeVerified?.isVerified) {
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
    },
  })
  await replaceUserSession(event, { secure: { verify: undefined } })
}

export async function sendVerificationEmail(event: H3Event, user: User) {
  const { baseUrl } = useRuntimeConfig(event)
  const uniqueToken = uuid()

  await replaceUserSession(event, {
    secure: {
      verify: {
        userId: user.id,
        token: uniqueToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours (in the session duration)
      },
    },
  })

  await sendMail({
    to: user.email,
    subject: "Verify your email",
    text: "Please verify your email by clicking on the link below",
    html: `<a href='${baseUrl}/api/auth/verify?token=${uniqueToken}'>Verify email</a>`,
  })
}
