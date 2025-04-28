import { z } from "zod"
import prisma from "~/lib/prisma"
import { validateBodySchema } from "~/server/util/request/request.service"
import { sendPasswordResetEmail } from "~/server/util/user/user.service"

const ForgetPasswordSchema = z.object({
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const forgetPasswordData = await validateBodySchema(event, ForgetPasswordSchema)
  const t = await useTranslation(event)

  const user = await prisma.user.findUnique({
    where: {
      email: forgetPasswordData.email,
    },
  })

  if (user) {
    try {
      await sendPasswordResetEmail(user, event)
    }
    catch {
      throw createError({ statusCode: 500, message: t("login.reset.error_email") })
    }
  }

  return {
    message: t("login.reset.success_email"),
  }
})
