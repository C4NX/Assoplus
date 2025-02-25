import { defineEventHandler } from "h3"
import { z } from "zod"
import { authenticateUser, handleCreateUser } from "~/server/util/user/user.service"

const SignupRequestDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const tokenRequestData = await readValidatedBody(event, SignupRequestDto.parse)
  const user = await handleCreateUser(tokenRequestData.email, tokenRequestData.password, event)
  return authenticateUser(user, event)
})
