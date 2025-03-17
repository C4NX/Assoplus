import { defineEventHandler } from "h3"
import { z } from "zod"
import { authorizeUserSession, authenticateUserByEmail } from "~/server/util/user/auth.service"

const TokenRequestDto = z.object({
  email: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const tokenRequestData = await readValidatedBody(event, TokenRequestDto.parse)
  const user = await authenticateUserByEmail(tokenRequestData.email, tokenRequestData.password)
  return authorizeUserSession(user, event)
})
