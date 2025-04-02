import type { H3Event } from "h3"
import prisma from "~/lib/prisma";
import { updateUserAvatarFromBuffer } from "~/server/util/avatar/avatar.service";
import { Role } from "~/server/util/user/role.enum";
import { sanitizeUser } from "~/server/util/user/user.service";

export interface GoogleUserInterface {
  sub:            string;
  name:           string;
  given_name:     string;
  picture:        string;
  email:          string;
  email_verified: boolean;
}

function splitDisplayName(displayName: string) {
  const [firstName, ...lastName] = displayName.split(" ");
  return { firstName, lastName: lastName.join(" ") };
}

export default defineOAuthGoogleEventHandler({
  config: {
    authorizationParams: {
      access_type: 'offline',
    },
  },
  async onSuccess(event: H3Event,{ user }: { user: GoogleUserInterface }) {
    let databaseUser = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: user.sub },
        ],
      },
    })

    if(!databaseUser) {
      const {firstName, lastName} = splitDisplayName(user.name)
      const avatarBuffer = await $fetch<ArrayBuffer>(user.picture, { responseType: "arrayBuffer" })

      databaseUser = await prisma.user.create({
        data: {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          passwordHash: null,
          roles: [Role.USER],
          createdAt: new Date(),
          avatarUuid: null,
          googleId: user.sub,
        },
      })

      if(avatarBuffer) {
        const avatarUuid = await updateUserAvatarFromBuffer(event, databaseUser.id, Buffer.from(avatarBuffer))
        databaseUser.avatarUuid = avatarUuid
      }
    }

    await setUserSession(event, {
      user: sanitizeUser(databaseUser),
      loggedInAt: Date.now(),
    })

    return sendRedirect(event, "/")
  },
  async onError({ event, error }: { event: H3Event, error: unknown }) {
    console.error("Google OAuth error:", error)
    return sendRedirect(event, "/")
  }
})
