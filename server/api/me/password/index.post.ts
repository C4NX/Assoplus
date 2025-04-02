import { z } from "zod"
import prisma from "~/lib/prisma"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { validateAndHashPassword } from "~/server/util/user/auth.service"

const PasswordChangeSchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  // handle password change
  const user = await requireUserAuthenticated(event)
  const passwordChangeData = await readValidatedBody(event, PasswordChangeSchema.parse)
  const t = await useTranslation(event)

  if (!user.passwordHash) {
    return createError({ statusCode: 400, message: t('profile.error.oauth_account') })
  }

  // check if old password is correct
  if (!await verifyPassword(user.passwordHash, passwordChangeData.password)) {
    return createError({ statusCode: 400, message: t('profile.error.wrong_password') })
  }

  // update password
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash: await validateAndHashPassword(passwordChangeData.newPassword),
    },
  })

  return {
    message: t('profile.error.password_updated'),
  }
})
