import prisma from "~/lib/prisma";
import { tryGetAuthenticatedUser } from "~/server/util/user/auth.guard"
import { z } from "zod"
import { AssociationRole } from "@prisma/client";

function isTokenInviteExpired(invite: {createdAt: Date}) {
  const now = new Date();
  const inviteCreatedAt = new Date(invite.createdAt);
  const inviteExpirationTime = new Date(inviteCreatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours expiration
  return now > inviteExpirationTime;
}

async function acceptInvite(invite: {id: string, associationId: string}, userId: string) {
  await prisma.invite.delete({
    where: {
      id: invite.id,
    },
  });

  await prisma.volunteer.create({
    data: {
      associationId: invite.associationId,
      userId,
      roles: [AssociationRole.VOLUNTEER],
    },
  });
}

async function acceptByToken(token: string, associationId: string) {
  const invite = await prisma.invite.findFirst({
    where: {
      associationId,
      token,
    },
  });

  if (!invite) {
    throw createError({ statusCode: 404, statusMessage: "Invite not found" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: invite.email,
    },
  });

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  // Email token expiration check
  if(isTokenInviteExpired(invite)) {
    await prisma.invite.delete({
      where: {
        id: invite.id,
      },
    });
    throw createError({ statusCode: 400, statusMessage: "Invite expired" });
  }

  await acceptInvite(invite, user.id);
}

async function acceptByInviteId(inviteId: string, user: {email: string, id: string}) {
  const invite = await prisma.invite.findFirst({
    where: {
      id: inviteId,
      email: user.email, // Also check if the invite is for the current user
    },
  });

  if (!invite) {
    throw createError({ statusCode: 404, statusMessage: "Invite not found" });
  }

  await acceptInvite(invite, user.id);
}



export default defineEventHandler(async (event) => {
  let user = await tryGetAuthenticatedUser(event); // Try to get the authenticated user or null if not authenticated

  const { associationId, inviteId, token } = await getValidatedQuery(event, z.object({
    associationId: z.string().uuid().optional(),
    token: z.string().optional(),
    inviteId: z.string().uuid().optional(),
  }).parse);

  const isAcceptByToken = token != null && inviteId == null && associationId != null;
  const isAcceptByInviteId = inviteId != null && token == null && user != null;

  if(!isAcceptByToken && !isAcceptByInviteId) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });
  }

  if (isAcceptByToken) { // If token is provided, we assume it's an accept by token
    await acceptByToken(token, associationId);
    await sendRedirect(event, `/dashboard`, 302);
    return;
  } else if (isAcceptByInviteId) { // If no token is provided, we assume it's an accept by inviteId
    await acceptByInviteId(inviteId, user);
    return  {
      statusCode: 200,
      body: {
        message: "Invite accepted",
      },
    }
  }

  throw createError({ statusCode: 400, statusMessage: "Invalid request" });
})
