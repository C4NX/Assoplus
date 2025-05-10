import { defineEventHandler, sendStream, setHeader } from "h3"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import { getAssociationLogoStream } from "~/server/util/association/logo.service"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)

  const stream = await getAssociationLogoStream(associationId)
  if (!stream) {
    throw new Error("Failed to get association logo stream")
  }

  setHeader(event, "Content-Type", "image/webp")
  await sendStream(event, stream)
})
