import { defineEventHandler } from "h3"
import { z } from "zod"
import { authenticateUser, verifyPasswordAndReturnUser } from "~/server/util/user/auth.service"

const TokenRequestDto = z.object({
  email: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const tokenRequestData = await readValidatedBody(event, TokenRequestDto.parse)
  const user = await verifyPasswordAndReturnUser(tokenRequestData.email, tokenRequestData.password)
  return authenticateUser(user, event)
})
