import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"
import prisma from "~/lib/prisma"
import { validateAndHashPassword } from "~/server/util/user/auth.service"

const ForgetPasswordSchema = z.object({
  token: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const forgetPasswordData = await readValidatedBody(event, ForgetPasswordSchema.parse)
  const t = await useTranslation(event)
  const { secure } = await getUserSession(event)

  if (!secure.passwordReset || secure.passwordReset.token !== forgetPasswordData.token) {
    throw createError({ statusCode: 400, message: t('login.reset.error') })
  }

  if(secure.passwordReset.expiresAt < new Date()) {
    throw createError({ statusCode: 400, message: t('login.reset.expired') })
  }

  try {
    await prisma.user.update({
      where: {
        id: secure.passwordReset.userId,
        // Allow reset only if last update was >1h ago or never set
        OR: [
          { passwordLastUpdated: null },
          { passwordLastUpdated: { lt: new Date(Date.now() - 1000 * 60 * 60) } }
        ]
      },
      data: {
        passwordHash: await validateAndHashPassword(forgetPasswordData.password),
        passwordLastUpdated: new Date(),
      },
    })
  } catch (e) {
    if(e instanceof PrismaClientKnownRequestError) {
      if(e.code === "P2025") {
        await replaceUserSession(event, { secure: { passwordReset: undefined } })
        throw createError({ statusCode: 400, message: t('login.reset.retry') })
      }
      throw e
    }
  }

  await replaceUserSession(event, { secure: { passwordReset: undefined } })

  return {
    message: t('login.reset.success'),
  }
})
