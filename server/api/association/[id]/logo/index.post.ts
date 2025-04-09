import { defineEventHandler } from "h3"
import { parseAssociationIdFromRouteId } from "../members.get"
import { uploadAssociationLogoFromBuffer } from "~/server/util/association/logo.service"
import { requireAssociationOwner, requireUserAuthenticated } from "~/server/util/user/auth.guard"
import { extractFileBufferFromRequest } from "~/server/util/request/files.service"
import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteId(event)
  await requireAssociationOwner(event, associationId)
  
  const buffer = await extractFileBufferFromRequest(event, "file", ["image/jpeg", "image/png"])
  const logoUuid = await uploadAssociationLogoFromBuffer(event, associationId, buffer)
  await prisma.association.update({
    where: {
      id: associationId,
    },
    data: {
      logoUuid: logoUuid,
    },
  })
  return {
    message: "Logo uploaded successfully",
  }
})
