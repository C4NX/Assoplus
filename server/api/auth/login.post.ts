import { defineEventHandler } from "h3"
import { z } from "zod"
import { authenticateUserByEmail } from "~/server/util/user/auth.service"
import { sanitizeUser } from "~/server/util/user/user.service"

const LoginRequestDto = z.object({
  email: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const loginRequestPayload = await readValidatedBody(event, LoginRequestDto.parse)

  const t = await useTranslation(event)

  const loggedUser = await authenticateUserByEmail(loginRequestPayload.email, loginRequestPayload.password)
  await setUserSession(event, {
    user: sanitizeUser(loggedUser),
    loggedInAt: Date.now(),
  })

  return {
    message: t("login.success"),
  }
})
