import { logoutUser } from "~/server/util/user/auth.service"

export default defineEventHandler(async (event) => {
  logoutUser(event)
  setResponseStatus(event, 204)
})
