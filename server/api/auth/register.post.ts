import { defineEventHandler } from "h3"
import { z } from "zod"
import { handleCreateUser } from "~/server/util/user/user.service"

const SignupRequestDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
})

export default defineEventHandler(async (event) => {
  const tokenRequestData = await readValidatedBody(event, SignupRequestDto.parse)
  const t = await useTranslation(event)

  await handleCreateUser(event, tokenRequestData)
  return { message: t("register.success") }
})
