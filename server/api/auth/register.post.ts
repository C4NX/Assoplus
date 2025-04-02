import { defineEventHandler } from "h3"
import { z } from "zod"
import { PasswordSchema } from "~/server/util/user/auth.service"
import { createUserWithVerification } from "~/server/util/user/user.service"

const UserRegistrationRequestDto = z.object({
  email: z.string().email(),
  password: PasswordSchema,
  firstName: z.string(),
  lastName: z.string(),
})

export default defineEventHandler(async (event) => {
  const registrationPayload = await readValidatedBody(event, UserRegistrationRequestDto.parse)
  const t = await useTranslation(event)

  try {
    // Create the user after validating the payload
    await createUserWithVerification(event, {
      email: registrationPayload.email,
      unsafePassword: registrationPayload.password,
      firstName: registrationPayload.firstName,
      lastName: registrationPayload.lastName,
    })
  } catch {
    throw createError({ statusCode: 500, message: t("register.error") })
  }

  return { message: t("register.success") }
})
