import { defineEventHandler } from "h3"
import { z } from "zod"
import { authenticateUserByEmail } from "~/server/util/user/auth.service"

const LoginRequestDto = z.object({
  email: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event)
  const loginRequestPayload = await readValidatedBody(event, LoginRequestDto.parse)

  await authenticateUserByEmail(event, loginRequestPayload.email, loginRequestPayload.password)

  return {
    message: t("login.success"),
  }
})
