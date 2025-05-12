import { defineEventHandler } from "h3"
import { parseAssociationIdFromRouteGuid } from "../index.get"
import { uploadAssociationLogoFromBuffer } from "~/server/util/association/logo.service"
import { requireAssociationOwner } from "~/server/util/user/auth.guard"
import { extractFileBufferFromRequest } from "~/server/util/request/files.service"
import prisma from "~/lib/prisma"

export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteGuid(event)
  const t = await useTranslation(event)
  await requireAssociationOwner(event, associationId)

  const buffer = await extractFileBufferFromRequest(event, "file", ALLOWED_IMAGE_MIME_TYPES)

  const logoPath = await uploadAssociationLogoFromBuffer(event, associationId, buffer)
  await prisma.association.update({
    where: {
      id: associationId,
    },
    data: {
      logoPath,
    },
  })
  return {
    message: t("association.logo.uploaded"),
  }
})
