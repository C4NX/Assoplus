import { defineEventHandler, sendStream, setHeader } from "h3"
import { parseAssociationIdFromRouteId } from "../members.get"
import { getAssociationLogoStream } from "~/server/util/association/logo.service"

export default defineEventHandler(async (event) => {
  const logoUuid = getRouterParam(event, "uuid")
  const associationId = parseAssociationIdFromRouteId(event)

  if (!logoUuid) {
    throw createError({ statusCode: 400, statusMessage: "Logo UUID is required" })
  }

  const stream = await getAssociationLogoStream(associationId, logoUuid)
  if (!stream) {
    throw new Error("Failed to get association logo stream")
  }

  setHeader(event, "Content-Type", "image/webp")
  await sendStream(event, stream)
})
