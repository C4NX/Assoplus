import { defineEventHandler } from "h3"
import { parseAssociationIdFromRouteId } from "./members.get"
import prisma from "~/lib/prisma"
import { requireUserAuthenticated } from "~/server/util/user/auth.guard"

export default defineEventHandler(async (event) => {
  const associationId = parseAssociationIdFromRouteId(event)
  const user = await requireUserAuthenticated(event)

  await prisma.association.delete({
    where: {
      id: associationId,
      ownerId: user.id,
    },
  })

  return { message: "Association deleted successfully" }
})
