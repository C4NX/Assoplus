import { z } from "zod"
import { parseAssociationIdFromRouteGuid } from "./index.get"
import { requireAssociationOwner } from "~/server/util/user/auth.guard"
import prisma from "~/lib/prisma"
import { uploadAssociationLogoFromRequest } from "~/server/util/association/logo.service"
import { hasMultipartFileOfMimeType, validateBodyFromMultipartFormData } from "~/server/util/request/files.service"
import { ALLOWED_IMAGE_MIME_TYPES } from "./logo/index.post"

const AssociationPatchSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().min(1).max(500).optional(),
  tags: z.array(z.number()).optional(),
  logo: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const multipartFormData = await readMultipartFormData(event)
  const associationId = parseAssociationIdFromRouteGuid(event)
  await requireAssociationOwner(event, associationId)

  // Validate the multipart json body
  const associationPatchData = await validateBodyFromMultipartFormData(multipartFormData, "data", AssociationPatchSchema)

  // Check if the logo is present and valid
  const hasLogo = hasMultipartFileOfMimeType(multipartFormData, "logo", ALLOWED_IMAGE_MIME_TYPES)

  await prisma.association.update({
    where: { id: associationId },
    data: {
      name: associationPatchData.name,
      description: associationPatchData.description,
      tags: {
        set: associationPatchData.tags?.map(tagId => ({ id: tagId })),
      },
      logoPath: hasLogo ? await uploadAssociationLogoFromRequest(event, multipartFormData, associationId, "logo") : undefined,
    },
  })

  return {
    message: "L'association a été mise à jour avec succès",
  }
})
