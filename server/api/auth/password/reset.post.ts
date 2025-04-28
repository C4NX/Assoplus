import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { validateBodySchema } from "~/server/util/request/request.service"
import { PasswordSchema, validateAndHashPassword } from "~/server/util/user/auth.service"

const ForgetPasswordSchema = z.object({
  token: z.string(),
  password: PasswordSchema,
})

export default defineEventHandler(async (event) => {
  const forgetPasswordData = await validateBodySchema(event, ForgetPasswordSchema)
  const t = await useTranslation(event)
  const { secure } = await getUserSession(event)

  if (!secure || !secure.passwordReset || secure.passwordReset.token !== forgetPasswordData.token) {
    throw createError({ statusCode: 400, message: t("login.reset.error") })
  }

  if (secure.passwordReset.expiresAt < new Date()) {
    throw createError({ statusCode: 400, message: t("login.reset.expired") })
  }

  // Update the password for the user only if the last update was >1h ago or never.
  try {
    await prisma.user.update({
      where: {
        id: secure.passwordReset.userId,
        OR: [
          { passwordLastUpdated: null },
          { passwordLastUpdated: { lt: new Date(Date.now() - 1000 * 60 * 60) } },
        ],
      },
      data: {
        passwordHash: await validateAndHashPassword(forgetPasswordData.password),
        passwordLastUpdated: new Date(),
      },
    })
  }
  catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        await replaceUserSession(event, { secure: { passwordReset: undefined } })
        throw createError({ statusCode: 400, message: t("login.reset.retry") })
      }
      throw e
    }
  }

  await replaceUserSession(event, { secure: { passwordReset: undefined } })

  return {
    message: t("login.reset.success"),
  }
})
