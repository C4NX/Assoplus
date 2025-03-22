import bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import type { H3Event } from "h3"
import { createError } from "h3"
import { useTranslation } from "@intlify/h3"
import type { User } from "@prisma/client"
import { signVerifyTokenForUser } from "./auth.service"
import prisma from "@/lib/prisma"
import { sendMail } from "~/server/util/mailer/mailer.service"
import { createLogger } from "~/server/util/logger/logger.service"
import type { PublicUserInterface } from "~/shared/auth"

const logger = createLogger("user")

interface CreateUserInterface {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function handleCreateUser(event: H3Event, { email, password, firstName, lastName }: CreateUserInterface) {
  const salt = await bcrypt.genSalt(10)
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: await bcrypt.hash(password, salt),
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

export function sanitizeUser(user: User): PublicUserInterface {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isVerified: user.isVerified,
    roles: user.roles,
    avatarUuid: user.avatarUuid,
  }
}
