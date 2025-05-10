import { defineEventHandler } from "h3"
import { parseAssociationIdFromRouteGuid } from "./index.get"
import prisma from "~/lib/prisma"
import { requireAssociationOwner } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const associationGuid = parseAssociationIdFromRouteGuid(event)
  await requireAssociationOwner(event, associationGuid)

  await prisma.association.delete({
    where: {
      id: associationGuid,
    },
  })

  return { message: "Association deleted successfully" }
})
