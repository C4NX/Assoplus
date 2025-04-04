import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import type { H3Event } from "h3"
import { createError } from "h3"
import { useTranslation } from "@intlify/h3"
import type { User } from "@prisma/client"
import { v4 as uuid } from "uuid"
import { signVerifyTokenForUser } from "./verify.service"
import { validateAndHashPassword } from "./auth.service"
import prisma from "@/lib/prisma"
import { sendMail } from "~/server/util/mailer/mailer.service"
import { createLogger } from "~/server/util/logger/logger.service"
import type { PublicUserInterface } from "~/shared/auth"

const logger = createLogger("user")

interface CreateUserInterface {
  email: string
  unsafePassword: string
  firstName: string
  lastName: string
}

export async function createUserWithVerification(event: H3Event, { email, unsafePassword, firstName, lastName }: CreateUserInterface) {
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: await hashPassword(unsafePassword),
        firstName: firstName,
        lastName: lastName,
        isVerified: false,
      },
    })

    logger.trace(`User created: ${user.email} (${user.id})`)

    // Send verification email
    await sendVerificationEmail(user, event)
  }
  catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        const t = await useTranslation(event)
        throw createError({ statusCode: 409, message: t("login.email_already_in_use") })
      }
    }

    throw e
  }
}

async function sendVerificationEmail(user: User, event: H3Event) {
  const { baseUrl } = useRuntimeConfig(event)
  const token = await signVerifyTokenForUser(user, event)

  await sendMail({
    to: user.email,
    subject: "Verify your email",
    text: "Please verify your email by clicking on the link below",
    html: `<a href='${baseUrl}/api/auth/verify?token=${token}'>Verify email</a>`,
  })
}

export async function sendPasswordResetEmail(user: User, event: H3Event) {
  const { baseUrl } = useRuntimeConfig(event)
  const uniqueToken = uuid()

  await setUserSession(event, {
    secure: {
      passwordReset: {
        userId: user.id,
        token: uniqueToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
      },
    },
  })

  await sendMail({
    to: user.email,
    subject: "Reset your password",
    text: "Please reset your password by clicking on the link below",
    html: `<a href='${baseUrl}/login/forgot-password?t=${uniqueToken}'>Reset password</a>`,
  })
}

export function sanitizeUser(user: User): PublicUserInterface {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    roles: user.roles,
    avatarUuid: user.avatarUuid,
    googleId: user.googleId,
  }
}

export async function updatePassword(user: User, newPassword: string) {
  if (!user.passwordHash) {
    throw createError({ statusCode: 401, message: "Cannot update password for oauth users" })
  }

  if (!await verifyPassword(user.passwordHash, newPassword)) {
    throw createError({ statusCode: 400, message: "New password cannot be the same as the old password" })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await validateAndHashPassword(newPassword) },
  })
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } })

  // TODO: rgpd-ize this
}
